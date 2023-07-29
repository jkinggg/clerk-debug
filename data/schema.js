export const eventSchema = {
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

export const taskSchema = {
    version: 0,
    title: 'Tasks',
    description: 'Tasks for the queue',
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: '128',
        },
        dueDate: {
            type: 'string',
        },
        duration: {
            type: 'number',
        },
        title: {
            type: 'string',
        },
        isCompleted: {
            type: 'boolean',
        },
        description: {
            type: 'string',
        }
    },
    required: ['id'],
};

export const sessionSchema = {
    version: 0,
    title: 'Sessions',
    description: 'AI chat sessions',
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