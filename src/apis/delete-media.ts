import * as dotenv from 'dotenv';
dotenv.config();
import { API_URL, TEXT } from '../constants'

export const DeleteMedia = async (url: string) => {
    await fetch(`${API_URL.MEDIA_V2}?url=${url}`, {
        headers: {
            "X-MICROCMS-API-KEY": `${process.env.MICROCMS_API_KEY}`,
        },
        method: "DELETE",
    }).then(async (response) => {
        if (!response.ok) {
            const { message } = await response.json();
            console.log(`${TEXT.FAILED} ステータス:${response.status} ${message}`);
        }
    });
}
