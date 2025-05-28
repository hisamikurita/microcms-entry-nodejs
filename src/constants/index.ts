import * as dotenv from 'dotenv';
dotenv.config();

export const ENDPOINT = {
    BLOGS: 'blogs',
    MEDIA: 'media',
    CATEGORIES: 'categories',
} as const

export const API_URL = {
    BLOGS: `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT.BLOGS}`,
    CATEGORIES: `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT.CATEGORIES}`,
    MEDIA_V1: `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v1/${ENDPOINT.MEDIA}`,
    MEDIA_V2: `https://${process.env.MICROCMS_SERVICE_DOMAIN}.microcms-management.io/api/v2/${ENDPOINT.MEDIA}`,
} as const;

export const TEXT = {
    SUCCESS: 'リクエストに成功したよ🎉🎉🎉',
    FAILED: 'リクエストに失敗したよ😔😔😔'
}