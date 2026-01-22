
import { Contract5RequestDto } from '../types/contract.types';
import * as path from 'path';
import * as fs from 'fs';
import ContractTemplateService from '../utilities/contract-and-report/logic/contractTemplate.service';
import pdfService from '../utilities/contract-and-report/logic/pdf.service';
import { generateContractQRCodes } from '../utilities/qrcode.util';

const TEMPLATE_BASE_PATH = './src/utilities/contract-and-report/templates/contract 5';

export class Contract5Service {

    async generateContract(data: Contract5RequestDto): Promise<Buffer> {
        const templateService = new ContractTemplateService();
        await templateService.readFile(`${TEMPLATE_BASE_PATH}/index.html`);

        // Generate QR codes for employee profiles
        const { consumerQRCode, providerQRCode } = await generateContractQRCodes(
            data.simple.consumerEmployeeId,
            data.simple.providerEmployeeId
        );

        // Replace simple placeholders
        const simpleReplacements = Object.entries(data.simple).map(([key, value]) => ({
            searchKey: key,
            value: value || ''
        }));

        // Add QR code replacements
        simpleReplacements.push(
            { searchKey: 'consumerQRCode', value: consumerQRCode },
            { searchKey: 'providerQRCode', value: providerQRCode }
        );

        await templateService.replaceContent(simpleReplacements);

        // Helper function to generate BOQ rows HTML
        const generateBoqRowsHtml = (rows: { value: (string | string[])[] }[]): string => {
            const boqRowTemplate = fs.readFileSync(`${TEMPLATE_BASE_PATH}/boqRow.html`, 'utf-8');
            let rowsHtml = '';
            let rowIndex = 1;

            for (const row of rows) {
                const item = row.value[0] as string;
                const descriptions = row.value[1]; // Array of strings or string
                const qty = row.value[2] as string;
                const unitPrice = row.value[3] as string;
                const total = row.value[4] as string;

                // Convert description array to HTML list
                let descriptionHtml = '';
                if (Array.isArray(descriptions)) {
                    descriptionHtml = '<ul class="description-list">';
                    descriptions.forEach(desc => {
                        descriptionHtml += `<li>${desc}</li>`;
                    });
                    descriptionHtml += '</ul>';
                } else {
                    descriptionHtml = descriptions as string; // Fallback if string
                }

                // Generate the row HTML
                let rowHtml = boqRowTemplate
                    .replace('[[1]]', total || '')
                    .replace('[[2]]', unitPrice || '')
                    .replace('[[3]]', qty || '')
                    .replace('[[4]]', descriptionHtml)
                    .replace('[[5]]', item || '')
                    .replace('[[6]]', rowIndex.toString());

                rowsHtml += rowHtml;
                rowIndex++;
            }

            return rowsHtml;
        };

        // Process Fire Alarm System rows
        if (data.repeated.boqRowsFireAlarm && data.repeated.boqRowsFireAlarm.length > 0) {
            const fireAlarmHtml = generateBoqRowsHtml(data.repeated.boqRowsFireAlarm);
            await templateService.replaceContent([{ searchKey: 'boqRowsFireAlarm', value: fireAlarmHtml }]);
        } else {
            await templateService.replaceContent([{ searchKey: 'boqRowsFireAlarm', value: '' }]);
        }

        // Process Fire Fighting System rows
        if (data.repeated.boqRowsFireFighting && data.repeated.boqRowsFireFighting.length > 0) {
            const fireFightingHtml = generateBoqRowsHtml(data.repeated.boqRowsFireFighting);
            await templateService.replaceContent([{ searchKey: 'boqRowsFireFighting', value: fireFightingHtml }]);
        } else {
            await templateService.replaceContent([{ searchKey: 'boqRowsFireFighting', value: '' }]);
        }

        // Process Exit Safety rows
        if (data.repeated.boqRowsExitSafety && data.repeated.boqRowsExitSafety.length > 0) {
            const exitSafetyHtml = generateBoqRowsHtml(data.repeated.boqRowsExitSafety);
            await templateService.replaceContent([{ searchKey: 'boqRowsExitSafety', value: exitSafetyHtml }]);
        } else {
            await templateService.replaceContent([{ searchKey: 'boqRowsExitSafety', value: '' }]);
        }

        const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const tempHtmlPath = path.resolve(`${TEMPLATE_BASE_PATH}/temp_${uniqueId}.html`);
        await templateService.saveFile(tempHtmlPath);

        const pdfBuffer = await pdfService.htmlFileToPdfBuffer(tempHtmlPath, {
            format: 'A4',
            landscape: false,
            printBackground: true,
            margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' }
        });

        if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
        }

        return pdfBuffer;
    }
}

export default new Contract5Service();
