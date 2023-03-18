// import './shim';
import 'react-native-get-random-values';
import 'expo-dev-client';

import React, {useEffect, useState} from 'react';
// import Heroes from '.';
import { Slot, Stack } from 'expo-router';
import initialize from '../data/initialize';
import { AppContext } from "../data/context";
import { Provider } from 'rxdb-hooks';
import { RxDatabase } from 'rxdb';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(root)',
};

export default function RootLayout() {
    
    const [db, setDb] = useState<RxDatabase>();

	useEffect(() => {
		initialize().then(setDb);
	}, []);

    {/*
    const [db, setDb] = useState(null);

    useEffect(() => {
        const initDB = async () => {
            const _db = await initialize();
            setDb(_db);
        };
        initDB().then();
    }, []);
    */}


    return (
        <Provider db={db}>
        {/* <AppContext.Provider value={{ db }}> */}
            <Stack>
                <Stack.Screen name="(root)" options={{ headerShown: false }} />
               {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
            </Stack>
        {/* </AppContext.Provider> */}
        </Provider>
    );
};
