export type blog = {
    title: string,
    content: string,
    eyecatch: {
        url: string,
        width: number,
        height: number,
    },
    category: {
        name: string,
    }
}

export type blogs = {
    contents: blog[]
}