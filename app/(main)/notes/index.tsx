import { useContext, useState } from 'react';
import { Link, Slot, Stack, useRouter } from "expo-router";
import CardList from '../../../components/cardList'
import { useRxData } from 'rxdb-hooks';
import { bookmarksCollectionName } from "../../../data/initialize";
import { XStack, YStack, useMedia } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Notes() {
  const router = useRouter();
  const media = useMedia();
  const [selectedCard, setSelectedCard] = useState(null);
  const insets = useSafeAreaInsets();

  const { result: bookmarks, isFetching } = useRxData(
    bookmarksCollectionName,
    (bookmarksCollection) => bookmarksCollection.find()
  );

  const handleSelectCard = (noteId) => {
    setSelectedCard(noteId);
    router.push(`/notes/${noteId}`);
  };

  if(isFetching) {
    return null
  }

  return (
    <CardList 
      data={bookmarks} 
      cardHeight={50} 
      columns={1} 
      estimatedSize={10}
      onSelectCard={handleSelectCard}
    />
  );
}