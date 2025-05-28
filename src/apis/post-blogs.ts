import * as dotenv from 'dotenv';
dotenv.config();
import { API_URL, TEXT } from '../constants'
import fs from 'node:fs';
import { sleep } from '../utils/sleep';
import { blog, blogs } from '../types';
import { GetMedia } from './get-media';
import { GetCategories } from './get-categories';

export const UpdatetBlog = async (blog: blog) => {
    await fetch(API_URL.BLOGS, {
        headers: {
            "X-MICROCMS-API-KEY": `${process.env.MICROCMS_API_KEY}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(blog)
    }).then(async (response) => {
        if (response.ok) {
            console.log(`${TEXT.SUCCESS} ステータス:${response.status}`);
        } else {
            const { message } = await response.json();
            console.log(`${TEXT.FAILED} ステータス:${response.status} ${response.statusText} ${message}`);
        }
    });
}

export const PostBlogs = async () => {
    const data: blogs = JSON.parse(fs.readFileSync('src/contents/blog/index.json', 'utf8'));
    const contents = data.contents;
    const medias = await GetMedia()
    const categories = await GetCategories()

    for (const content of contents) {
        content.eyecatch = medias[Math.floor(Math.random() * medias.length)].url
        content.category = categories[Math.floor(Math.random() * categories.length)].id

        await UpdatetBlog(content);
        await sleep(500)
    }
}