import { Link, Stack, useRouter } from "expo-router";

export default function DataLayout() {
  const router = useRouter();

  return (
    <Stack>
        <Stack.Screen
            name="data"
            options={{
                title: "Data",
                headerShown: false
            }}
        />
    </Stack>
  );
}