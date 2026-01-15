import { Request, Response } from 'express';
import contract1Service from '../services/contract1.service';
import contract2Service from '../services/contract2.service';
import contract3Service from '../services/contract3.service';
import contract4Service from '../services/contract4.service';
import contract5Service from '../services/contract5.service';
import contract6Service from '../services/contract6.service';
import contract7Service from '../services/contract7.service';
import s3Service from '../utilities/s3.service';
import {
    Contract1RequestDto,
    Contract2RequestDto,
    Contract3RequestDto,
    Contract4RequestDto,
    Contract5RequestDto,
    Contract6RequestDto,
    Contract7RequestDto
} from '../types/contract.types';

export class ContractsController {

    /**
     * Generate Contract 1: Unified Maintenance Contract
     * POST /api/contracts/1/generate
     */
    async generateContract1(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract1RequestDto = req.body;
            const pdfBuffer = await contract1Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 1);
            console.log(`Contract 1 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 1:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 1',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Generate Contract 2: Fire Extinguisher Maintenance Contract
     * POST /api/contracts/2/generate
     */
    async generateContract2(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract2RequestDto = req.body;
            const pdfBuffer = await contract2Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 2);
            console.log(`Contract 2 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 2:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 2',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Generate Contract 3: Technical Inspection Report
     * POST /api/contracts/3/generate
     */
    async generateContract3(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract3RequestDto = req.body;
            const pdfBuffer = await contract3Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 3);
            console.log(`Contract 3 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 3:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 3',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Generate Contract 4: Fire Extinguisher Repair Quotation
     * POST /api/contracts/4/generate
     */
    async generateContract4(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract4RequestDto = req.body;
            const pdfBuffer = await contract4Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 4);
            console.log(`Contract 4 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 4:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 4',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Generate Contract 5: Safety Systems Repair Quotation
     * POST /api/contracts/5/generate
     */
    async generateContract5(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract5RequestDto = req.body;
            const pdfBuffer = await contract5Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 5);
            console.log(`Contract 5 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 5:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 5',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Generate Contract 6: Fire Extinguisher Delivery Receipt (After Maintenance)
     * POST /api/contracts/6/generate
     */
    async generateContract6(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract6RequestDto = req.body;
            const pdfBuffer = await contract6Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 6);
            console.log(`Contract 6 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 6:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 6',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Generate Contract 7: Fire Extinguisher Receipt (Before Maintenance)
     * POST /api/contracts/7/generate
     */
    async generateContract7(req: Request, res: Response): Promise<void> {
        try {
            const data: Contract7RequestDto = req.body;
            const pdfBuffer = await contract7Service.generateContract(data);

            // Upload to S3
            const s3Url = await s3Service.uploadPdf(pdfBuffer, 7);
            console.log(`Contract 7 uploaded to S3: ${s3Url}`);

            res.json({s3Url});
        } catch (error) {
            console.error('Error generating Contract 7:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to generate Contract 7',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}

export default new ContractsController();

