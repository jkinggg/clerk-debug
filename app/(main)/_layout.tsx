import { Tabs } from "expo-router";
import { HomeIcon, CalendarIcon, CheckCircleIcon, DocumentIcon, MagnifyingGlassIcon, ChatBubbleOvalLeftEllipsisIcon, PencilSquareIcon, BookmarkIcon } from "react-native-heroicons/outline";
import React, {useEffect, useState } from 'react';
import { useMedia, XStack, YStack, Button } from 'tamagui';
import { Link, Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView, initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';
import { size } from "@tamagui/themes";

export default function MainLayout() {
  const media = useMedia();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  
  useEffect(() => {
      setDrawerOpen(media.gtMd);
      console.log(`Size is gtMd: ${media.gtMd}`)
  }, [media.gtMd]);

  useEffect(() => {
      console.log(`Drawer is open: ${isDrawerOpen}`)
  }, [isDrawerOpen]);

  return (
      (media.gtMd ?
        <SafeAreaView>
          <XStack>
              {/* {isDrawerOpen && media.gtMd && <DesktopDrawer />} */}
              <YStack padding="$4" flex={1}>
                  <Link href={'/(main)/'}>
                    <Button padding="$1" width="100%" backgroundColor="grey" color="white" alignSelf="center" icon={<HomeIcon />}>
                      Home
                    </Button>
                  </Link>
                  <Link href={'/(main)/bookmarks'}>
                    <Button width="100%" backgroundColor="grey" color="white" alignSelf="center" icon={<BookmarkIcon />}>
                      Bookmarks
                    </Button>
                  </Link>
                  <Link href={'/(main)/notes'}>
                    <Button width="100%" backgroundColor="grey" color="white" alignSelf="center" icon={<PencilSquareIcon />}>
                      Notes
                    </Button>
                  </Link>
                  <Link href={'/(main)/search'}>
                    <Button width="100%" backgroundColor="grey" color="white" alignSelf="center" icon={<MagnifyingGlassIcon />}>
                      Search
                    </Button>
                  </Link>
                  <Link href={'/(main)/chat'}>
                    <Button width="100%" backgroundColor="grey" color="white" alignSelf="center" icon={<ChatBubbleOvalLeftEllipsisIcon />}>
                      Chats
                    </Button>
                  </Link>
              </YStack>
              <YStack flex={5}>
                  <Slot />
              </YStack>
          </XStack>
        </SafeAreaView>
      :
        <Tabs 
          screenOptions= {{ 
            tabBarShowLabel: false, 
            tabBarActiveTintColor: 'black', 
            headerShown: false 
          }
        }>
          <Tabs.Screen 
            name="index" 
            options={{ 
              tabBarIcon: ({ color }) => <HomeIcon color={color} />
            }}
          />
          {/* <Tabs.Screen 
            name="calendar" 
            options={{ 
              tabBarIcon: ({ color }) => <CalendarIcon color={color} />
            }}
          />
          <Tabs.Screen 
            name="tasks" 
            options={{ 
              tabBarIcon: ({ color }) => <CheckCircleIcon color={color} />
            }}
          /> */}
          <Tabs.Screen 
            name="bookmarks" 
            options={{ 
              tabBarIcon: ({ color }) => <BookmarkIcon color={color} />
            }}
          />
          <Tabs.Screen 
            name="notes" 
            options={{ 
              tabBarIcon: ({ color }) => <PencilSquareIcon color={color} />
            }}
          />
          <Tabs.Screen 
            name="search" 
            options={{ 
              tabBarIcon: ({ color }) => <MagnifyingGlassIcon color={color} />
            }}
          />
          <Tabs.Screen 
            name="chat" 
            options={{ 
              tabBarIcon: ({ color }) => <ChatBubbleOvalLeftEllipsisIcon color={color} />
            }}
          />
        </Tabs>
      )
  );
}