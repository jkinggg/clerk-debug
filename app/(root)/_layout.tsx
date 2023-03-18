import { Tabs, Link } from "expo-router";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppLayout() {

  return (
    <Tabs 
      screenOptions= {{ 
        tabBarShowLabel: false, 
        tabBarActiveTintColor: 'blue', 
        headerShown: false 
      }
    }>
      {/*
      <Tabs.Screen 
        name="index" 
        options={{ 
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weather-sunset" size={25} color={color} />
        }}
      />
      */}
      <Tabs.Screen 
        name="calendar" 
        options={{ 
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="view-day-outline" size={25} color={color} />
        }}
      />
      <Tabs.Screen 
        name="search" 
        options={{ 
          tabBarIcon: ({ color }) => <MaterialIcons name="add-box" size={25} color={color} />
        }}
      />
      <Tabs.Screen 
        name="tasks" 
        options={{ 
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="checkbox-outline" size={25} color={color} />
        }}
      />
      <Tabs.Screen 
        name="notes" 
        options={{ 
          tabBarIcon: ({ color }) => <MaterialIcons name="notes" size={25} color={color} />
        }}
      />
    </Tabs>
  );
}