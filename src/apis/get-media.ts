import * as dotenv from 'dotenv';
dotenv.config();
import { API_URL, TEXT } from '../constants'
import path from 'node:path';
import fs from 'node:fs';

export const GetMedia = async () => {
    const response = await fetch(`${API_URL.MEDIA_V2}?limit=100`, {
        headers: {
            "X-MICROCMS-API-KEY": `${process.env.MICROCMS_API_KEY}`,
        },
        method: "GET",
    })

    if (!response.ok) {
        console.log(`${TEXT.FAILED} ステータス:${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.media
}

export const SyncGetMedia = async () => {
    const imagesPath = path.resolve('src/images');
    const medias: { url: string }[] = await GetMedia();
    const localFiles = fs.readdirSync(imagesPath);
    const downloadList: { url: string, fileName: string }[] = [];

    for (const media of medias) {
        const url = new URL(media.url);
        const fileName = path.basename(url.pathname);

        if (!localFiles.includes(fileName)) {
            downloadList.push({ url: media.url, fileName: fileName });
        }
    }

    for (const { url, fileName } of downloadList) {
        const localFilePath = path.join(imagesPath, fileName);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`${TEXT.FAILED} ファイル名: ${fileName} のダウンロードに失敗しました。ステータス: ${response.status} ${response.statusText}`);
            continue;
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(localFilePath, buffer);
        console.log(`${TEXT.SUCCESS} ファイル名: ${fileName} を /images に保存しました。`);
    }
}
