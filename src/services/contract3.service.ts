
import { Contract3RequestDto, Contract3InspectionRow } from '../types/contract.types';
import * as path from 'path';
import * as fs from 'fs';
import ContractTemplateService from '../utilities/contract-and-report/logic/contractTemplate.service';
import pdfService from '../utilities/contract-and-report/logic/pdf.service';
import { generateContractQRCodes } from '../utilities/qrcode.util';

const TEMPLATE_BASE_PATH = './src/utilities/contract-and-report/templates/contract 3';

export class Contract3Service {

    async generateContract(data: Contract3RequestDto): Promise<Buffer> {
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

        // Read inspection row template
        const inspectionRowTemplate = fs.readFileSync(`${TEMPLATE_BASE_PATH}/inspectionRow.html`, 'utf-8');

        // Process inspection rows - convert boolean values to icons
        const processInspectionRows = (rows: Contract3InspectionRow[]) => {
            let html = '';
            for (const row of rows) {
                const item = row.value[0];
                const total = row.value[1];
                const working = row.value[2];
                const broken = row.value[3];
                const checklistItems = row.value[4];

                // Generate checklist items HTML dynamically (only for existing items)
                let checklistHtml = '';
                if (checklistItems && checklistItems.length > 0) {
                    for (const checkItem of checklistItems) {
                        const desc = checkItem[0] as string || '';
                        const classification = checkItem[1] as string || '';
                        const status = checkItem[2];

                        // Convert status to icon and class
                        const isPass = status === true || status === 1 || status === "1" || status === "true";
                        const icon = isPass ? '✓' : '✗';
                        const iconClass = isPass ? 'icon-check' : 'icon-cross';
                        const rowBgClass = isPass ? '' : 'detail-item--fail';

                        checklistHtml += `
                        <div class="detail-item ${rowBgClass}">
                            <div class="detail-col col-desc">• ${desc}</div>
                            <div class="detail-col col-class">${classification}</div>
                            <div class="detail-col col-status"><span class="status-icon ${iconClass}">${icon}</span></div>
                        </div>`;
                    }
                }

                // Generate row HTML
                let rowHtml = inspectionRowTemplate
                    .replace('[[1]]', item)
                    .replace('[[2]]', total)
                    .replace('[[3]]', working)
                    .replace('[[4]]', broken)
                    .replace('[[checklistHtml]]', checklistHtml);

                html += rowHtml;
            }
            return html;
        };

        // Replace inspection placeholders
        if (data.repeated.inspectionAlarm && data.repeated.inspectionAlarm.length > 0) {
            await templateService.replaceContent([{
                searchKey: 'inspectionAlarm',
                value: processInspectionRows(data.repeated.inspectionAlarm)
            }]);
        }

        if (data.repeated.inspectionFighting && data.repeated.inspectionFighting.length > 0) {
            await templateService.replaceContent([{
                searchKey: 'inspectionFighting',
                value: processInspectionRows(data.repeated.inspectionFighting)
            }]);
        }

        if (data.repeated.inspectionEscape && data.repeated.inspectionEscape.length > 0) {
            await templateService.replaceContent([{
                searchKey: 'inspectionEscape',
                value: processInspectionRows(data.repeated.inspectionEscape)
            }]);
        }

        // Replace repeated content for faults and assembly
        const repeatedReplacements: { repeatedTempletePath: string; placeholder: string; changeable: { value: string[] }[] }[] = [];

        if (data.repeated.faults && data.repeated.faults.length > 0) {
            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/faultRow.html`,
                placeholder: 'faults',
                changeable: data.repeated.faults
            });
        }

        // Process assembly rows with checkbox conversion (0/1 to CSS class)
        if (data.repeated.assembly && data.repeated.assembly.length > 0) {
            const assemblyRowTemplate = fs.readFileSync(`${TEMPLATE_BASE_PATH}/assemblyRow.html`, 'utf-8');
            let assemblyHtml = '';

            for (const row of data.repeated.assembly) {
                const values = row.value;
                // Convert checkbox values: indices 2, 4, 6 are checkbox states (0/1)
                // Convert to CSS class: 1 = "checked", 0 = ""
                const convertCheckbox = (val: string): string => {
                    return (val === '1' || val === 'true' || val === 'checked') ? 'checked' : '';
                };

                let rowHtml = assemblyRowTemplate
                    .replace('[[1]]', values[0] || '')   // criteria title
                    .replace('[[2]]', values[1] || '')   // option 1 label
                    .replace('[[3]]', convertCheckbox(values[2] || ''))  // option 1 checkbox
                    .replace('[[4]]', values[3] || '')   // option 2 label
                    .replace('[[5]]', convertCheckbox(values[4] || ''))  // option 2 checkbox
                    .replace('[[6]]', values[5] || '')   // option 3 label
                    .replace('[[7]]', convertCheckbox(values[6] || ''))  // option 3 checkbox
                    .replace('[[8]]', values[7] || '')   // engineer notes
                    .replace('[[9]]', values[8] || '');  // hide row 3 class

                assemblyHtml += rowHtml;
            }

            await templateService.replaceContent([{
                searchKey: 'assembly',
                value: assemblyHtml
            }]);
        }

        if (repeatedReplacements.length > 0) {
            await templateService.replaceRepeatedContent(repeatedReplacements);
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

export default new Contract3Service();
