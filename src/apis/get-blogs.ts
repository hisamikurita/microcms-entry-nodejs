import * as dotenv from 'dotenv';
dotenv.config();
import { API_URL, TEXT } from '../constants'

export const GetBlogs = async () => {
    const response = await fetch(`${API_URL.BLOGS}?limit=100`, {
        headers: {
            "X-MICROCMS-API-KEY": `${process.env.MICROCMS_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "GET",
    })

    const json = await response.json();
    console.log(json.contents[11])
    return json
}