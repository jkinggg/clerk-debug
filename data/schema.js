
export const bookmarkSchema = {
    version: 0,
    title: 'Bookmarks',
    description: 'Content saved from sites across the internet',
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: '128',
        },
        url: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        image_url: {
            type: 'string',
        }
    },
    required: ['id'],
};