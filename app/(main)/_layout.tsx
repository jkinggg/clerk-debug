import { Tabs } from "expo-router";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HeroOutline } from '@nandorojo/heroicons'
import React, {useEffect, useState} from 'react';

export default function AppLayout() {
  return (
      <Tabs 
        screenOptions= {{ 
          tabBarShowLabel: false, 
          tabBarActiveTintColor: 'blue', 
          headerShown: false 
        }
      }>
        <Tabs.Screen 
          name="index" 
          options={{ 
            tabBarIcon: ({ color }) => <HeroOutline.Home />
          }}
        />
        <Tabs.Screen 
          name="calendar" 
          options={{ 
            tabBarIcon: ({ color }) => <HeroOutline.Calendar />
          }}
        />
        <Tabs.Screen 
          name="tasks" 
          options={{ 
            tabBarIcon: ({ color }) => <HeroOutline.CheckCircle />
          }}
        />
        <Tabs.Screen 
          name="notes" 
          options={{ 
            tabBarIcon: ({ color }) => <HeroOutline.Document />
          }}
        />
        <Tabs.Screen 
          name="search" 
          options={{ 
            tabBarIcon: ({ color }) => <HeroOutline.MagnifyingGlass />
          }}
        />
        <Tabs.Screen 
          name="chat" 
          options={{ 
            tabBarIcon: ({ color }) => <HeroOutline.ChatBubbleOvalLeftEllipsis />
          }}
        />
      </Tabs>
  );
}