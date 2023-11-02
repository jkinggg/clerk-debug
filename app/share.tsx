import { useEffect } from 'react';
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRxCollection } from 'rxdb-hooks';
import { bookmarksCollectionName } from "../data/initialize";
import { generateUUID } from '../utils/uuid';

export default function ShareIntent() {
  const router = useRouter();
  const shareIntent = useLocalSearchParams();
  const bookmarksCollection = useRxCollection(bookmarksCollectionName);

  const transformSharedContent = (shareIntent) => {
    let url;
    if (typeof shareIntent === 'string') {
      url = shareIntent.replace(/['"]+/g, '');
    } else if (Array.isArray(shareIntent.text)) {
      url = shareIntent.text.join('').replace(/['"]+/g, '');
    }
    return url;
  }

  useEffect(() => {
    if (shareIntent.text && bookmarksCollection) {
      console.log(`Upserting bookmark ${shareIntent.text}`)
      bookmarksCollection.upsert({
        id: generateUUID(),
        url: transformSharedContent(shareIntent.text)
      });
    }
  }, [shareIntent, bookmarksCollection]);

  return (
    <View style={styles.container}>
      {!shareIntent && <Text>No Share intent detected</Text>}
      {!!shareIntent && (
        <Text style={[styles.gap, { fontSize: 20 }]}>
          Content saved!
        </Text>
      )}
      {!!shareIntent?.text && (
        <Text style={styles.gap}>{shareIntent.text}</Text>
      )}
      {shareIntent?.uri && (
        <Image source={shareIntent} style={[styles.image, styles.gap]} />
      )}
      {!!shareIntent && (
        <Button onPress={() => router.replace("/")} title="Go home" />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  gap: {
    marginBottom: 20,
  },
});