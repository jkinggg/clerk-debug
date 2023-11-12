import { useRouter } from "expo-router";
import CardList from '../../../components/cardList'
import { useRxData } from 'rxdb-hooks';
import { bookmarksCollectionName } from "../../../data/initialize";

export default function Bookmarks() {
  const router = useRouter();

  const { result: bookmarks, isFetching } = useRxData(
    bookmarksCollectionName,
    (bookmarksCollection) => bookmarksCollection.find().where('url').ne(null)
  );

  const handleSelectCard = (bookmarkId) => {
    router.push({ pathname: "/bookmarks/item", params: { id: bookmarkId } });
  };

  console.log(`In route /bookmarks/index`)

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