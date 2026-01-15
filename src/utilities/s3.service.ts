import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * S3 Service for uploading contract PDFs to AWS S3
 */
class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
            }
        });
        this.bucketName = process.env.AWS_BUCKET_NAME || 'safty-zone';
    }

    /**
     * Upload a PDF buffer to S3
     * @param pdfBuffer - The PDF file as a Buffer
     * @param contractType - The type of contract (1-7)
     * @param identifier - Optional identifier (e.g., contract ID, customer ID)
     * @returns The S3 URL of the uploaded file
     */
    async uploadPdf(
        pdfBuffer: Buffer,
        contractType: number,
        identifier?: string
    ): Promise<string> {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const identifierPart = identifier ? `_${identifier}` : '';

        // Generate unique file name: contracts/contract{type}_{identifier}_{timestamp}_{random}.pdf
        const fileName = `contracts/contract${contractType}${identifierPart}_${timestamp}_${randomSuffix}.pdf`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
        });

        try {
            await this.s3Client.send(command);

            // Construct the S3 URL
            const s3Url = `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;

            console.log(`PDF uploaded successfully to S3: ${s3Url}`);
            return s3Url;
        } catch (error) {
            console.error('Error uploading PDF to S3:', error);
            throw new Error(`Failed to upload PDF to S3: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

export default new S3Service();
