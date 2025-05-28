import * as dotenv from 'dotenv';
dotenv.config();
import { API_URL, TEXT } from '../constants'

export const GetCategories = async () => {
    const response = await fetch(`${API_URL.CATEGORIES}?limit=100`, {
        headers: {
            "X-MICROCMS-API-KEY": `${process.env.MICROCMS_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "GET",
    })

    if (!response.ok) {
        console.log(`${TEXT.FAILED} ステータス:${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.contents
}