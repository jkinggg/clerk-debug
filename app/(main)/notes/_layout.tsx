import { Link, Stack, useRouter } from "expo-router";

export default function NotesLayout() {
  const router = useRouter();

  return (
    <Stack>
        <Stack.Screen
            name="index"
            options={{
                title: "Notes",
                headerShown: false
            }}
        />
    </Stack>
  );
}