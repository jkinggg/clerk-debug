import { Link, Stack, useRouter } from "expo-router";

export default function TasksLayout() {
  const router = useRouter();

  return (
    <Stack>
        <Stack.Screen
            name="index"
            options={{
                title: "Tasks",
                headerShown: false
            }}
        />
    </Stack>
  );
}