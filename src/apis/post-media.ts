import fs from 'node:fs';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { API_URL, TEXT } from '../constants'
import { fileTypeFromBuffer } from 'file-type';
import { GetMedia } from './get-media';
import { DeleteMedia } from './delete-media';
import { sleep } from '../utils/sleep'
dotenv.config();

const imagesPath = path.resolve('src/images');

const UploadMedia = async (fileName: string) => {
    const mediaPath = path.join(imagesPath, fileName);
    const mediaName: string = path.basename(mediaPath);
    const mediaBuffer = fs.readFileSync(mediaPath);
    const mediaType = await fileTypeFromBuffer(mediaBuffer)

    const formData: FormData = new FormData();
    const fileBlob: Blob = new Blob([mediaBuffer], { type: mediaType?.mime });
    formData.append('file', fileBlob, mediaName);

    await fetch(API_URL.MEDIA_V1, {
        headers: {
            "X-MICROCMS-API-KEY": `${process.env.MICROCMS_API_KEY}`,
        },
        method: "POST",
        body: formData,
    }).then(async (response) => {
        if (response.ok) {
            console.log(`${TEXT.SUCCESS} ファイル名:${fileName} ステータス:${response.status}`);
        } else {
            const { message } = await response.json();
            console.log(`${TEXT.FAILED} ファイル名:${fileName} ステータス:${response.status} ${message}`);
        }
    });
}

export const PostMedias = async () => {
    // PUTリクエストが存在しないので同一の名前が存在する場合は削除しておく
    const medias: { url: string }[] = await GetMedia();
    const imagesList = fs.readdirSync(imagesPath);

    for (const fileName of imagesList) {
        // サーバー上に同一ファイル名のメディアが存在するか確認
        const existingMedia = medias.find(media => {
            try {
                const serverUrl = new URL(media.url);
                const serverFileName = path.basename(serverUrl.pathname);
                return serverFileName === fileName;
            } catch (error) {
                console.error(`メディアURLの解析エラー: ${media.url}`, error);
                return false;
            }
        });

        // 同一ファイル名のメディアが存在する場合、削除する
        if (existingMedia) {
            console.log(`サーバーに同一ファイル名が存在するため${fileName}を一度削除して新しい画像に更新するね`);
            await DeleteMedia(existingMedia.url);
            await sleep(500)
        }

        // 新しいメディアをアップロード
        await UploadMedia(fileName);
        await sleep(500)
    }
}