import { Link, Stack, useRouter } from "expo-router";

export default function CalendarLayout() {
  const router = useRouter();

  return (
    <Stack>
        <Stack.Screen
            name="index"
            options={{
                title: "Calendar",
                headerShown: false
            }}
        />
    </Stack>
  );
}