import {
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxJsonSchema
} from 'rxdb';

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
        containerStyle: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
    },
    required: ['id', 'start', 'end', 'title'],
} as const; // <- It is important to set 'as const' to preserve the literal type
const schemaTyped = toTypedRxJsonSchema(eventSchema);

// aggregate the document type from the schema
export type EventDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const eventSchemaType: RxJsonSchema<EventDocType> = eventSchema;