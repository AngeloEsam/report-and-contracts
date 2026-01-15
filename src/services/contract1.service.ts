
import { Contract1RequestDto } from '../types/contract.types';
import * as path from 'path';
import * as fs from 'fs';
import ContractTemplateService from '../utilities/contract-and-report/logic/contractTemplate.service';
import pdfService from '../utilities/contract-and-report/logic/pdf.service';
import { generateContractQRCodes } from '../utilities/qrcode.util';

const TEMPLATE_BASE_PATH = './src/utilities/contract-and-report/templates/contract 1';

export class Contract1Service {

    async generateContract(data: Contract1RequestDto): Promise<Buffer> {
        // Create a new template service instance for this request (prevents race conditions)
        const templateService = new ContractTemplateService();

        // Read the main template
        await templateService.readFile(`${TEMPLATE_BASE_PATH}/index.html`);

        // Generate QR codes for employee profiles
        console.log('Employee IDs:', {
            consumer: data.simple.consumerEmployeeId,
            provider: data.simple.providerEmployeeId
        });
        const { consumerQRCode, providerQRCode } = await generateContractQRCodes(
            data.simple.consumerEmployeeId,
            data.simple.providerEmployeeId
        );
        console.log('QR Codes generated:', {
            consumerLength: consumerQRCode.length,
            providerLength: providerQRCode.length
        });

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
        console.log('Total replacements:', simpleReplacements.length);

        await templateService.replaceContent(simpleReplacements);

        // Replace repeated content
        const repeatedReplacements = [];

        if (data.repeated.visits && data.repeated.visits.length > 0) {
            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/visitSchedule.html`,
                placeholder: 'visits',
                changeable: data.repeated.visits
            });
        }

        if (data.repeated.quantities && data.repeated.quantities.length > 0) {
            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/quantities.html`,
                placeholder: 'quantities',
                changeable: data.repeated.quantities
            });
        }

        if (data.repeated.financialDetails && data.repeated.financialDetails.length > 0) {
            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/financialDetails.html`,
                placeholder: 'financialDetails',
                changeable: data.repeated.financialDetails
            });
        }

        if (data.repeated.maintenanceFees && data.repeated.maintenanceFees.length > 0) {
            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/maintenanceFees.html`,
                placeholder: 'maintenanceFees',
                changeable: data.repeated.maintenanceFees
            });
        }

        if (data.repeated.section11Rows && data.repeated.section11Rows.length > 0) {
            const mappedRows = data.repeated.section11Rows.map((row, index) => ({
                value: [(index + 1).toString(), row.value[0] || '', (index + 1).toString()]
            }));

            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/additionalRows.html`,
                placeholder: 'section11Rows',
                changeable: mappedRows
            });
        }

        if (data.repeated.section12Rows && data.repeated.section12Rows.length > 0) {
            const mappedRows = data.repeated.section12Rows.map((row, index) => ({
                value: [(index + 1).toString(), row.value[0] || '', (index + 1).toString()]
            }));

            repeatedReplacements.push({
                repeatedTempletePath: `${TEMPLATE_BASE_PATH}/additionalRows.html`,
                placeholder: 'section12Rows',
                changeable: mappedRows
            });
        }

        if (repeatedReplacements.length > 0) {
            await templateService.replaceRepeatedContent(repeatedReplacements);
        }

        // Save the processed HTML to a unique temp file
        const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const tempHtmlPath = path.resolve(`${TEMPLATE_BASE_PATH}/temp_${uniqueId}.html`);
        await templateService.saveFile(tempHtmlPath);

        // Generate PDF buffer
        const pdfBuffer = await pdfService.htmlFileToPdfBuffer(tempHtmlPath, {
            format: 'A4',
            landscape: false,
            printBackground: true,
            margin: {
                top: '5mm',
                right: '5mm',
                bottom: '5mm',
                left: '5mm'
            }
        });

        // Clean up temp file
        if (fs.existsSync(tempHtmlPath)) {
            fs.unlinkSync(tempHtmlPath);
        }

        return pdfBuffer;
    }
}

export default new Contract1Service();
