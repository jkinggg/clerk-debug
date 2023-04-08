// import './shim';
import 'react-native-get-random-values';
import 'expo-dev-client';

import React, {useEffect, useState, useContext} from 'react';
// import Heroes from '.';
import { Stack, Navigator, usePathname, Slot, Link } from 'expo-router';
import initialize from '../data/initialize';
import { DimensionsContext, DimensionsContextProvider } from "../utils/dimensions";
import { Provider } from 'rxdb-hooks';
import { RxDatabase } from 'rxdb';
import {Drawer} from "expo-router/drawer";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { Paragraph, Spacer, TamaguiProvider, Theme, YStack } from 'tamagui'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import config from '../tamagui.config'


export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {    
    const [db, setDb] = useState<RxDatabase>();

	useEffect(() => {
		initialize().then(setDb);
	}, []);

    const windowDimensions = Dimensions.get('window');

    const [dimensions, setDimensions] = useState({
        window: windowDimensions,
    });

    useEffect(() => {
        const subscription = Dimensions.addEventListener(
          'change',
          ({window}) => {
            setDimensions({window});
          },
        );
        return () => subscription?.remove();
    });

    console.log(dimensions);

    const colorScheme = useColorScheme()

    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })

    if (!loaded) {
        return null
    }

    return (
        <Provider db={db}>
            <DimensionsContextProvider>
                <SafeAreaProvider>
                    <TamaguiProvider config={config}>
                        <Theme name='light_blue'>
                            <Drawer 
                                drawerContent={(props) => <DefaultDrawer {...props} />}
                                defaultStatus={dimensions.window.width > dimensions.window.height ? "open" : "closed"}
                                screenOptions={{
                                    drawerHideStatusBarOnOpen: true,
                                    headerShown: false
                                }}
                            >
                                <Slot/>
                            </Drawer>
                        </Theme>
                    </TamaguiProvider>
                </SafeAreaProvider>
            </DimensionsContextProvider>
        </Provider>
    );
};

function DefaultDrawer(props) {
    return (
        <DrawerContentScrollView {...props}>
            {false &&
                [
                    <Link href={'/(main)/data'} onPress={() => props.navigation.closeDrawer()}>Home</Link>,
                    <Link href={'/(main)/settings'} onPress={() => props.navigation.closeDrawer()}>Calendar</Link>,
                    <Link href={'/(main)/logout'} onPress={() => props.navigation.closeDrawer()}>Tasks</Link>,
                    <Link href={'/(main)/logout'} onPress={() => props.navigation.closeDrawer()}>Notes</Link>,
                ]
            }
            <Link href={'/(other)/data'} onPress={() => props.navigation.closeDrawer()}>Data</Link>
            <Link href={'/(other)/settings'} onPress={() => props.navigation.closeDrawer()}>Settings</Link>
            <Link href={'/(other)/logout'} onPress={() => props.navigation.closeDrawer()}>Logout</Link>
        </DrawerContentScrollView>
    );
};