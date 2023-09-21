import { addRxPlugin, createRxDatabase } from 'rxdb';
import fetch from 'cross-fetch';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { replicateFirestore } from 'rxdb/plugins/replication-firestore';
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { app } from "firebase/app";
import { useAuth } from "@clerk/clerk-expo";
// import { observeNewCollections } from 'rxdb-hooks';

addRxPlugin(RxDBMigrationPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
// addRxPlugin(observeNewCollections);

import {bookmarkSchema, eventSchema, taskSchema} from './schema';

import {
    STORAGE
} from './storage';

const dbName = 'focused';
export const eventsCollectionName = 'events';
export const tasksCollectionName = 'tasks';
export const bookmarksCollectionName = 'bookmarks';

const isDevelopment = process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

const initialize = async () => {
    if (isDevelopment) {
        await addRxPlugin(RxDBDevModePlugin);
    }

    let db;

    try {
        console.log('Initializing database...');
        db = await createRxDatabase({
            name: dbName,
            storage: STORAGE,
            multiInstance: false,
            ignoreDuplicate: true,
        });
        console.log('Database initialized!');
    } catch (err) {
        console.log('ERROR CREATING DATABASE', err);
    }

    try {
        console.log('Adding collections...');
        await db.addCollections({
            [eventsCollectionName]: {
                schema: eventSchema,
            },
			[tasksCollectionName]: {
                schema: taskSchema,
            },
			[bookmarksCollectionName]: {
                schema: bookmarkSchema,
            },
        });
        console.log('Collections added!');
    } catch (err) {
        console.log('ERROR CREATING COLLECTION', err);
    }


    try {
        console.log('Start sync...');
        // Initialize Firebase services
		// const projectId = process.env.FIREBASE_PROJECTID;
		const projectId = 'assistant-2e3e1';
		const firestoreDatabase = getFirestore(app);
		const firestoreEventsCollection = collection(firestoreDatabase, 'events');
		const firestoreTasksCollection = collection(firestoreDatabase, 'tasks');
		const firestoreBookmarksCollection = collection(firestoreDatabase, 'bookmarks');
		console.log('Firebase initialized');
		const replicationState = replicateFirestore(
			// {
			// 	collection: db[eventsCollectionName],
			// 	firestore: {
			// 		projectId,
			// 		database: firestoreDatabase,
			// 		collection: firestoreEventsCollection
			// 	},
			// 	pull: {},
			// 	push: {},
			// 	/**
			// 	 * Either do a live or a one-time replication
			// 	 * [default=true]
			// 	 */
			// 	live: true,
			// 	/**
			// 	 * (optional) likely you should just use the default.
			// 	 *
			// 	 * In firestore it is not possible to read out
			// 	 * the internally used write timestamp of a document.
			// 	 * Even if we could read it out, it is not indexed which
			// 	 * is required for fetch 'changes-since-x'.
			// 	 * So instead we have to rely on a custom user defined field
			// 	 * that contains the server time which is set by firestore via serverTimestamp()
			// 	 * IMPORTANT: The serverTimestampField MUST NOT be part of the collections RxJsonSchema!
			// 	 * [default='serverTimestamp']
			// 	 */
			// 	serverTimestampField: 'serverTimestamp'
			// },
			// {
			// 	collection: db[tasksCollectionName],
			// 	firestore: {
			// 		projectId,
			// 		database: firestoreDatabase,
			// 		collection: firestoreTasksCollection
			// 	},
			// 	pull: {},
			// 	push: {},
			// 	/**
			// 	 * Either do a live or a one-time replication
			// 	 * [default=true]
			// 	 */
			// 	live: true,
			// 	/**
			// 	 * (optional) likely you should just use the default.
			// 	 *
			// 	 * In firestore it is not possible to read out
			// 	 * the internally used write timestamp of a document.
			// 	 * Even if we could read it out, it is not indexed which
			// 	 * is required for fetch 'changes-since-x'.
			// 	 * So instead we have to rely on a custom user defined field
			// 	 * that contains the server time which is set by firestore via serverTimestamp()
			// 	 * IMPORTANT: The serverTimestampField MUST NOT be part of the collections RxJsonSchema!
			// 	 * [default='serverTimestamp']
			// 	 */
			// 	serverTimestampField: 'serverTimestamp'
			// },
			{
				collection: db[bookmarksCollectionName],
				firestore: {
					projectId,
					database: firestoreDatabase,
					collection: firestoreBookmarksCollection
				},
				pull: {},
				push: {},
				/**
				 * Either do a live or a one-time replication
				 * [default=true]
				 */
				live: true,
				/**
				 * (optional) likely you should just use the default.
				 *
				 * In firestore it is not possible to read out
				 * the internally used write timestamp of a document.
				 * Even if we could read it out, it is not indexed which
				 * is required for fetch 'changes-since-x'.
				 * So instead we have to rely on a custom user defined field
				 * that contains the server time which is set by firestore via serverTimestamp()
				 * IMPORTANT: The serverTimestampField MUST NOT be part of the collections RxJsonSchema!
				 * [default='serverTimestamp']
				 */
				serverTimestampField: 'serverTimestamp'
			}
		);

        console.dir(replicationState);

        replicationState.active$.subscribe((v) => {
            console.log('Replication active$:', v)
        })
        replicationState.canceled$.subscribe((v) => {
            console.log('Replication canceled$:', v)
        })
        replicationState.error$.subscribe(async error => {
            console.error('Replication error$:',error)
        })

    } catch (err) {
        console.log('Error initialize sync', err);
    }

    return db;
};

export default initialize;
