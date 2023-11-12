import { useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useRxData } from 'rxdb-hooks';
import { bookmarksCollectionName } from "../../../data/initialize";
import { Platform } from 'react-native';


const Bookmark = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { result: bookmark, isFetching } = useRxData(
    bookmarksCollectionName,
    (bookmarksCollection) => bookmarksCollection.find().where('id').equals(id)
  );

  useEffect(() => {
    if (bookmark && bookmark.length > 0 && bookmark[0].url) {
      console.log("Selected bookmark changed:", bookmark[0].url);
    } else {
      console.log("Selected bookmark has no URL or does not exist.");
    }
  }, [bookmark]);

  return (
    !isFetching && bookmark && bookmark.length > 0 && bookmark[0].url
      ? Platform.OS === 'web'
        ? <iframe src={bookmark[0].url} style={{ width: '100%', height: '100%' }} />
        : <WebView source={{ uri: bookmark[0].url }} />
      : null
  );
};

export default Bookmark;