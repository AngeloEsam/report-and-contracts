import * as fs from 'fs';
class ContractTemplateService {
    fileContent: string = '';
    async readFile(fileName: string): Promise<void> {
        const fileData = await fs.readFileSync(fileName, 'utf-8');
        this.fileContent = fileData;
    }

    async readRepeatedTemplateFile(filePath: string): Promise<string> {
        const fileData = await fs.readFileSync(filePath, 'utf-8');
        return fileData;
    }

    async replaceContent(changeable: { searchKey: string, value: string }[]): Promise<string> {
        let updatedContent = this.fileContent;
        changeable.forEach(({ searchKey, value }) => {
            // Replace all occurrences of the placeholder
            const placeholder = `[[${searchKey}]]`;
            const found = updatedContent.includes(placeholder);
            if (searchKey.includes('QR')) {
                console.log(`Replacing ${searchKey}: found=${found}, valueLength=${value?.length || 0}`);
            }
            // Use split/join to replace ALL occurrences
            updatedContent = updatedContent.split(placeholder).join(value);
        });
        this.fileContent = updatedContent;
        return updatedContent;
    }

    async replaceRepeatedContent(data: { repeatedTempletePath: string, placeholder: string, changeable: { value: string[] }[] }[]): Promise<string> {
        let updatedContent = this.fileContent;
        for (const { repeatedTempletePath, placeholder, changeable } of data) {
            let repeatedTemplateContent = await this.readRepeatedTemplateFile(repeatedTempletePath);
            let updatedRepeatedTemplateContent = '';
            changeable.forEach(({ value }) => {
                let tempContent = repeatedTemplateContent;
                value.forEach((val, index) => {
                    tempContent = tempContent.replace(`[[${index + 1}]]`, val);
                });
                updatedRepeatedTemplateContent += tempContent;
            });
            console.log('Updated Repeated Template Content:', updatedRepeatedTemplateContent);
            console.log('Placeholder to be replaced:', `[[${placeholder}]]`);
            const idx = updatedContent.indexOf(`[[${placeholder}]]`);
            console.log('Index of placeholder:', idx);
            if (idx === -1) {
                console.log('⚠️ Placeholder NOT FOUND in content!');
            }
            updatedContent = updatedContent.replace(`[[${placeholder}]]`, updatedRepeatedTemplateContent);
            this.fileContent = updatedContent;
        }

        return updatedContent;
    }


    async saveFile(fileName: string): Promise<void> {
        fs.writeFileSync(fileName, this.fileContent, 'utf-8');
    }

}

export default ContractTemplateService;


