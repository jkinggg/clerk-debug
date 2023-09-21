import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { YStack, Card, Text, Image, Input, H2, Paragraph, XStack, useMedia, ScrollView } from 'tamagui';
import { useRxData } from 'rxdb-hooks';
import { FlashList } from "@shopify/flash-list";
import { bookmarksCollectionName, eventsCollectionName } from "../../../data/initialize";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useScreenDimensions from '../../../hooks/screenDimensions';

export default function Search() {
  const insets = useSafeAreaInsets();
  const { height } = useScreenDimensions();
  const cardHeight = height / 2;

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [debounceSearch, setDebounceSearch] = useState(''); // For debouncing
  const abortController = useRef(null);
  

  const media = useMedia();
  let cardFlex = 1;  // Default for xs and sm
  if (media.md || media.lg) cardFlex = 2;     // Two columns for md or lg
  if (media.xl || media.xxl) cardFlex = 3;  // Three columns for xl or xxl

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchResults(debounceSearch); // Fetch results after 1 second delay
    }, 1000);

    // Clear timeout if the user types again before the 1 second delay
    return () => {
      clearTimeout(timerId);
      if (abortController.current) {
        abortController.current.abort(); // Abort the ongoing fetch request
      }
    };
  }, [debounceSearch]);

  const fetchResults = async (text) => {
    if (abortController.current) {
      abortController.current.abort(); // Abort any ongoing fetch request
    }

    // Initialize a new AbortController for the new request
    abortController.current = new AbortController();

    try {
      const response = await fetch("https://johnking93--app-py-search-dev.modal.run", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search_string: text }),
        signal: abortController.current.signal, // Add the signal to the fetch request
      });

      const result = await response.json();
      setFilteredData([...result.results]);
      console.log(result);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error searching:", error);
      }
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    setDebounceSearch(text); // This will trigger the useEffect
  };

  // Define a query constructor to filter data based on doc_id
  const queryConstructor = (collection) => {
    return collection.find().where('id').in(filteredData.map(item => item.metadata.doc_id));
  };

  // Use the useRxData hook to get the data based on the query
  const { result: bookmarks, isFetching } = useRxData(bookmarksCollectionName, queryConstructor);

  // Map of doc_id to score for sorting
  const scoreMapping = {};
  filteredData.forEach(item => {
    scoreMapping[item.metadata.doc_id] = item.score;
  });

  // Sort the bookmarks based on the score from the search results
  const sortedBookmarks = bookmarks.sort((a, b) => scoreMapping[b.id] - scoreMapping[a.id]);

  console.log("Bookmarks data:" + bookmarks);

  return (
    <YStack flex={1} paddingTop={insets.top} paddingBottom={insets.bottom}>
      <Input
        value={search}
        onChangeText={handleSearch}
        placeholder="Search..."
      />
      <XStack flexDirection='row' flexWrap='wrap'>
        <FlashList
          numColumns={cardFlex}
          data={sortedBookmarks}
          renderItem={({ item }) => 
            <Card key={item.id} elevate size="$4" bordered flex={1} height={cardHeight}>
              <Image 
                flex={1}
                source={{ uri: item.image_url }} 
                resizeMode='contain'
                height={100 + '%'}
                width={100 + '%'}
              />
              <Text>{item.description}</Text>
            </Card>
          }
          estimatedItemSize={2}
        />
      </XStack>
    </YStack>
  );
}