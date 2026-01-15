import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

export interface PdfOptions {
    format?: 'A4' | 'A3' | 'Letter' | 'Legal';
    landscape?: boolean;
    margin?: {
        top?: string;
        right?: string;
        bottom?: string;
        left?: string;
    };
    printBackground?: boolean;
}

export class PdfService {
    private defaultOptions: PdfOptions = {
        format: 'A4',
        landscape: false,
        margin: {
            top: '5mm',
            right: '5mm',
            bottom: '5mm',
            left: '5mm'
        },
        printBackground: true
    };

    /**
     * Convert HTML file to PDF using Puppeteer
     * Best solution for preserving CSS and design
     */
    async htmlFileToPdf(
        htmlFilePath: string,
        outputPdfPath: string,
        options?: PdfOptions
    ): Promise<string> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();

            // Read HTML file content
            const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

            // Get the directory of HTML file for resolving relative paths
            const htmlDir = path.dirname(htmlFilePath);

            // Process HTML to inline CSS and images
            const processedHtml = this.processHtmlPaths(htmlContent, htmlDir);

            // Set content
            await page.setContent(processedHtml, {
                waitUntil: 'networkidle0'
            });

            // Merge options
            const mergedOptions = { ...this.defaultOptions, ...options };

            // Ensure output directory exists
            const outputDir = path.dirname(outputPdfPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Generate PDF
            await page.pdf({
                path: outputPdfPath,
                format: mergedOptions.format,
                landscape: mergedOptions.landscape,
                margin: mergedOptions.margin,
                printBackground: mergedOptions.printBackground,
                preferCSSPageSize: true
            });

            console.log(`✅ PDF generated successfully: ${outputPdfPath}`);
            return outputPdfPath;
        } finally {
            await browser.close();
        }
    }

    /**
     * Convert HTML file to PDF and return as buffer (for API responses)
     */
    async htmlFileToPdfBuffer(
        htmlFilePath: string,
        options?: PdfOptions
    ): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();

            const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
            const htmlDir = path.dirname(htmlFilePath);
            const processedHtml = this.processHtmlPaths(htmlContent, htmlDir);

            await page.setContent(processedHtml, {
                waitUntil: 'networkidle0'
            });

            const mergedOptions = { ...this.defaultOptions, ...options };

            const pdfBuffer = await page.pdf({
                format: mergedOptions.format,
                landscape: mergedOptions.landscape,
                margin: mergedOptions.margin,
                printBackground: mergedOptions.printBackground,
                preferCSSPageSize: true
            });

            return Buffer.from(pdfBuffer);
        } finally {
            await browser.close();
        }
    }

    /**
     * Process HTML to convert relative paths to absolute/inline content
     */
    private processHtmlPaths(htmlContent: string, baseDir: string): string {
        let processedHtml = htmlContent;

        // Find and inline CSS files
        const cssLinkRegex = /<link\s+[^>]*href=["']([^"']+\.css)["'][^>]*>/gi;
        let match;

        const htmlCopy = htmlContent;
        while ((match = cssLinkRegex.exec(htmlCopy)) !== null) {
            const cssPath = match[1];
            if (!cssPath.startsWith('http')) {
                const absoluteCssPath = path.resolve(baseDir, cssPath);
                if (fs.existsSync(absoluteCssPath)) {
                    const cssContent = fs.readFileSync(absoluteCssPath, 'utf-8');
                    processedHtml = processedHtml.replace(match[0], `<style>${cssContent}</style>`);
                }
            }
        }

        // Convert relative image paths to base64 data URIs
        const imgRegex = /src=["']([^"']+)["']/gi;
        const processedImages = new Set<string>();
        const htmlCopy2 = processedHtml;

        while ((match = imgRegex.exec(htmlCopy2)) !== null) {
            const imgSrc = match[1];
            if (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:') && !processedImages.has(imgSrc)) {
                processedImages.add(imgSrc);
                const absoluteImgPath = path.resolve(baseDir, imgSrc);
                if (fs.existsSync(absoluteImgPath)) {
                    try {
                        const imgBuffer = fs.readFileSync(absoluteImgPath);
                        const imgBase64 = imgBuffer.toString('base64');
                        const ext = path.extname(absoluteImgPath).slice(1).toLowerCase();
                        const mimeType = this.getMimeType(ext);
                        const dataUri = `data:${mimeType};base64,${imgBase64}`;

                        const escapeRegex = imgSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        processedHtml = processedHtml.replace(new RegExp(`src=["']${escapeRegex}["']`, 'g'), `src="${dataUri}"`);
                    } catch (err) {
                        console.warn(`Warning: Could not process image ${imgSrc}`);
                    }
                }
            }
        }

        return processedHtml;
    }

    /**
     * Get MIME type from file extension
     */
    private getMimeType(ext: string): string {
        const mimeTypes: Record<string, string> = {
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
            'webp': 'image/webp',
            'ico': 'image/x-icon',
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }
}

export default new PdfService();
