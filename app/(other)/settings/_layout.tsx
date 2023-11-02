import { Link, Stack, useRouter } from "expo-router";

export default function SettingsLayout() {
  const router = useRouter();

  return (
    <Stack>
        <Stack.Screen
            name="settings"
            options={{
                title: "Settings",
                headerShown: false
            }}
        />
    </Stack>
  );
}