import { addRxPlugin, createRxDatabase } from 'rxdb';
import fetch from 'cross-fetch';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder'
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb'
import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	collection
} from 'firebase/firestore';
import { replicateFirestore } from 'rxdb/plugins/replication-firestore';
// import { observeNewCollections } from 'rxdb-hooks';

addRxPlugin(RxDBMigrationPlugin)
addRxPlugin(RxDBUpdatePlugin)
addRxPlugin(RxDBQueryBuilderPlugin)
// addRxPlugin(observeNewCollections);

import schema from './schema';

import {
    STORAGE
} from './storage';

const dbName = 'focused';
export const CollectionName = 'events';

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
        console.log('Adding hero collection...');
        await db.addCollections({
            [CollectionName]: {
                schema: schema,
            },
        });
        console.log('Collection added!');
    } catch (err) {
        console.log('ERROR CREATING COLLECTION', err);
    }


    try {
        console.log('Start sync...');
        // Initialize Firebase services
		const projectId = 'assistant-2e3e1';
		const firebaseConfig = {
			apiKey: "AIzaSyAXBYHJlHH4UqQ6oaQROkkd589vzrFpwoI",
			authDomain: "assistant-2e3e1.firebaseapp.com",
			projectId: projectId,
			storageBucket: "assistant-2e3e1.appspot.com",
			messagingSenderId: "6430897433",
			appId: "1:6430897433:web:858cfef0bcd2bd642ac188",
			measurementId: "G-ESBXEFP14B"
		};
		const app = initializeApp(firebaseConfig);

		// For more information on how to access Firebase in your project,
		// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
	
		const firestoreDatabase = getFirestore(app);
		const firestoreCollection = collection(firestoreDatabase, 'events');
		console.log('Firebase initialized');
		console.log(firestoreCollection);
		const replicationState = replicateFirestore(
			{
				collection: db[CollectionName],
				firestore: {
					projectId,
					database: firestoreDatabase,
					collection: firestoreCollection
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
