import * as path from "path";
import * as fs from "fs";
import {default as errorsJson} from "./errors"

export const sessionJsonHandleForYouMi = (basePath, customPath = '/') => {
    const directoryPath = path.join(basePath, customPath); // 替换为你的文件夹路径
    try {
        const files = fs.readdirSync(directoryPath);
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
        return jsonFiles.map(jsonFile => {
            const filePath = path.join(directoryPath, jsonFile);
            let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            let proxy = content.proxy.split("@")
            if (proxy.length === 3) {
                content.proxy = `${proxy[1]}@${proxy[2]}`
            }
            return content
        })
    } catch (err) {
        throw new Error(err.message)
    }
}
export const getErrorMessage = (error) => {
    let errorMessage = error
    if (errorsJson.hasOwnProperty(error)) errorMessage = errorsJson[error]
    return errorMessage
}





