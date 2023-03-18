const eventSchema = {
    version: 0,
    title: 'Events',
    description: 'Events for the calendar',
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: '128',
        },
        start: {
            type: 'string',
        },
        end: {
            type: 'string',
        },
        title: {
            type: 'string',
        },
        color: {
            type: 'string',
        },
        description: {
            type: 'string',
        }
    },
    required: ['id'],
};

export default eventSchema;