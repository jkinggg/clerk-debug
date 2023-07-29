// import './shim';
import 'react-native-get-random-values';
import 'expo-dev-client';
import React, {useEffect, useState} from 'react';
import { Slot, Link } from 'expo-router';
import { DimensionsContext, DimensionsContextProvider } from "../utils/dimensions";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'react-native'
import { TamaguiProvider, Theme} from 'tamagui'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import config from '../tamagui.config'
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "../utils/cache";
import { AuthProvider } from '../hooks/auth';
import { initializeApp } from 'firebase/app';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {    
    const CLERK_PUBLISHABLE_KEY = "pk_test_bWVldC1zdGlua2J1Zy01Mi5jbGVyay5hY2NvdW50cy5kZXYk"

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

    // const colorScheme = useColorScheme()
    const [loaded] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })
    if (!loaded) {
        return null
    }

    // const firebaseConfig = {
    //     apiKey: process.env.FIREBASE_APIKEY,
    //     authDomain: process.env.FIREBASE_AUTHDOMAIN,
    //     projectId: process.env.FIREBASE_PROJECTID,
    //     storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    //     messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    //     appId: process.env.FIREBASE_APPID,
    //     measurementId: process.env.FIREBASE_MEASUREMENTID
    // };
    const firebaseConfig = {
        apiKey: "AIzaSyAXBYHJlHH4UqQ6oaQROkkd589vzrFpwoI",
        authDomain: "assistant-2e3e1.firebaseapp.com",
        projectId: "assistant-2e3e1",
        storageBucket: "assistant-2e3e1.appspot.com",
        messagingSenderId: "6430897433",
        appId: "1:6430897433:web:858cfef0bcd2bd642ac188",
        measurementId: "G-ESBXEFP14B"
    };
    initializeApp(firebaseConfig);

    return (
        <DimensionsContextProvider>
            <SafeAreaProvider>
                <TamaguiProvider config={config}>
                    <Theme name='light_blue'>
                        <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
                            <AuthProvider>
                                <Slot />
                            </AuthProvider>
                        </ClerkProvider>
                    </Theme>
                </TamaguiProvider>
            </SafeAreaProvider>
        </DimensionsContextProvider>
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