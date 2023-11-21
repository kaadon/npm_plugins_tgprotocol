import * as path from "path";
import * as fs from "fs";
export const sessionJsonHandleForYouMi = (basePath,customPath = '/') => {
    const directoryPath = path.join(basePath, customPath); // 替换为你的文件夹路径
    try {
        const files = fs.readdirSync(directoryPath);
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
        return jsonFiles.map(jsonFile=>{
            const filePath = path.join(directoryPath, jsonFile);
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content)
        })
    } catch (err) {
        throw new Error(err.message)
    }
}




