import { useContext, useState, useEffect } from 'react';
import { Link, Slot, Stack, useRouter, usePathname } from "expo-router";
import CardList from '../../../components/cardList'
import { useRxData } from 'rxdb-hooks';
import { bookmarksCollectionName } from "../../../data/initialize";
import { XStack, YStack, useMedia } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookmarksScren() {
  const router = useRouter();
  const media = useMedia();
  const insets = useSafeAreaInsets();
  const currentRoute = usePathname();

  const { result: bookmarks, isFetching } = useRxData(
    bookmarksCollectionName,
    (bookmarksCollection) => bookmarksCollection.find().where('url').ne(null)
  );

  useEffect(() => {
    console.log("Entering route defaulter")
    console.log(`gtMd is: ${media.gtMd}`)
    console.log(`currentRoute is: ${currentRoute}`)
    if (media.gtMd && currentRoute === '/bookmarks' && bookmarks !== null) {
      console.log(`Length is ${bookmarks.length}`)
      if(bookmarks.length > 0) {
        console.log("Pushing first note for large screen")
        router.push({ pathname: "/bookmarks/item", params: { id: bookmarks[0].id } });
      }
    }
  }, [media.md, currentRoute, bookmarks]);

  const handleSelectCard = (bookmarkId) => {
    router.push({ pathname: "/bookmarks/item", params: { id: bookmarkId } });
  };

  return (
    <XStack paddingTop={insets.top} paddingBottom={insets.bottom} flex={1} backgroundColor={'white'}>
      {media.gtMd ? (
        <>
          <YStack flex={1}>
            <CardList
              data={bookmarks} 
              cardHeight={50} 
              columns={1} 
              estimatedSize={10}
              onSelectCard={handleSelectCard}
            />
          </YStack>
          <YStack flex={3}>
            <Slot />
          </YStack>
        </>
      ) : (
        <Stack>
          <Slot />
        </Stack>
      )}
    </XStack>
  );
}