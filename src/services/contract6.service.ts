
import { Contract6RequestDto } from '../types/contract.types';
import * as path from 'path';
import * as fs from 'fs';
import ContractTemplateService from '../utilities/contract-and-report/logic/contractTemplate.service';
import pdfService from '../utilities/contract-and-report/logic/pdf.service';
import { generateContractQRCodes } from '../utilities/qrcode.util';

const TEMPLATE_BASE_PATH = './src/utilities/contract-and-report/templates/contract 6';

export class Contract6Service {

    async generateContract(data: Contract6RequestDto): Promise<Buffer> {
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

        // Replace repeated content
        const repeatedReplacements = [];

        if (data.repeated.deliveryDetails && data.repeated.deliveryDetails.length > 0) {
            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/deliveryDetails.html`,
                placeholder: 'deliveryDetails',
                changeable: data.repeated.deliveryDetails
            });
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

export default new Contract6Service();
