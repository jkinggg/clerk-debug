import React, { useContext, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AppContext } from '../../../data/context';
import { CollectionName } from "../../../data/initialize";
import { useRxDB } from 'rxdb-hooks';

export default function Heroes() {
    const db = useRxDB();
    const [notes, setNotes2] = useState([]);

    useEffect(() => {
        let sub;
        if (db && db[CollectionName]) {
            sub = db[CollectionName]
                .find()
                .$.subscribe((rxdbNotes) => {
                    setNotes2(rxdbNotes);
                });
        }
        return () => {
            if (sub && sub.unsubscribe) sub.unsubscribe();
            console.log("Unsubscribed");
        };
    }, [db]);

    console.log("Notes: " + notes);

    return (
        <View>
            <Text>{notes}</Text>
        </View>
    );
};