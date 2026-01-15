import QRCode from 'qrcode';

const BASE_URL = 'https://api.safetyzoone.com/profile/employee';

/**
 * Generates a QR code as a base64 data URL for an employee profile
 * @param employeeId - The employee ID to generate QR code for
 * @returns Base64 data URL of the QR code, or empty string if no ID provided
 */
export async function generateEmployeeQRCode(employeeId: string | undefined | null): Promise<string> {
    if (!employeeId) {
        // Return a placeholder or empty if no employee ID
        return '';
    }

    const profileUrl = `${BASE_URL}/${employeeId}`;
    console.log('Generating QR code for URL:', profileUrl);

    try {
        const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
            width: 150,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
        console.log('QR code generated successfully, length:', qrCodeDataUrl.length);
        console.log('QR code preview:', qrCodeDataUrl.substring(0, 50) + '...');
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
}

/**
 * Generates QR codes for both consumer and provider employees
 * @param consumerEmployeeId - Consumer/Client employee ID
 * @param providerEmployeeId - Provider/Service employee ID
 * @returns Object with both QR code data URLs
 */
export async function generateContractQRCodes(
    consumerEmployeeId: string | undefined | null,
    providerEmployeeId: string | undefined | null
): Promise<{ consumerQRCode: string; providerQRCode: string }> {
    const [consumerQRCode, providerQRCode] = await Promise.all([
        generateEmployeeQRCode(consumerEmployeeId),
        generateEmployeeQRCode(providerEmployeeId)
    ]);

    return { consumerQRCode, providerQRCode };
}
