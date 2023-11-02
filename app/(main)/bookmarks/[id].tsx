import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useRxData } from 'rxdb-hooks';
import { bookmarksCollectionName } from "../../../data/initialize";

const Bookmark = () => {
  const { id } = useLocalSearchParams();
  const { result: bookmark, isFetching } = useRxData(
    bookmarksCollectionName,
    (bookmarksCollection) => bookmarksCollection.find().where('id').equals(id)
  );

  return (
    !isFetching && bookmark && bookmark[0] && bookmark[0].url
      ? <WebView source={{ uri: bookmark[0].url }} />
      : null
  );
};

export default Bookmark;