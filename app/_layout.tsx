// import './shim';
import 'react-native-get-random-values';
import 'expo-dev-client';
import {useEffect, useState} from 'react';
import { Slot, Link, usePathname, useRouter, SplashScreen } from 'expo-router';
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, Platform } from 'react-native'
import { TamaguiProvider, Theme, useMedia, XStack, YStack} from 'tamagui'
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import config from '../tamagui.config'
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "../utils/cache";
import { AuthProvider } from '../hooks/auth';
import { initializeApp } from 'firebase/app';
import useShareIntent from "../hooks/useShareIntent";


export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {    

    const colorScheme = useColorScheme()
    const [loaded, error] = useFonts({
        Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
        InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    })
    
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUNISHABLE_KEY

    const router = useRouter();
    
    if (Platform.OS !== 'web') {
        const { shareIntent, resetShareIntent } = useShareIntent();
        useEffect(() => {
            if (shareIntent) {
                router.replace({ pathname: "share", params: shareIntent });
                resetShareIntent();
            }
        }, [shareIntent]);
    }

    const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
    };

    initializeApp(firebaseConfig);

    const media = useMedia();

    if (!loaded) {
        return null;
    }

    return (
        <TamaguiProvider config={config}>
            <Theme name='light'>
                <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY}>
                    <AuthProvider>
                        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                            <Drawer
                                drawerContent={(props) => <MobileDrawer {...props} />}
                                defaultStatus={"closed"}
                                screenOptions={{
                                    drawerHideStatusBarOnOpen: true,
                                    headerShown: false,
                                    swipeEnabled: !media.gtMd
                                }}
                            >
                                <Slot />
                            </Drawer>
                        </SafeAreaProvider>
                    </AuthProvider>
                </ClerkProvider>
            </Theme>
        </TamaguiProvider>
    );
};

function MobileDrawer(props) {
    return (
        <DrawerContentScrollView {...props}>
            <Link href={'/(other)/data'} onPress={() => props.navigation.closeDrawer()}>Data</Link>
            <Link href={'/(other)/settings'} onPress={() => props.navigation.closeDrawer()}>Settings</Link>
            <Link href={'/(other)/logout'} onPress={() => props.navigation.closeDrawer()}>Logout</Link>
        </DrawerContentScrollView>
    );
};