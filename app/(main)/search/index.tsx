import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { YStack, Card, Text, Image, Input, H2, Paragraph, XStack, useMedia, ScrollView, Switch, ZStack, Button } from 'tamagui';
import { useRxData } from 'rxdb-hooks';
import { FlashList } from "@shopify/flash-list";
import { bookmarksCollectionName } from "../../../data/initialize";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useScreenDimensions from '../../../hooks/screenDimensions';
import { Squares2X2Icon, ListBulletIcon, SparklesIcon } from "react-native-heroicons/solid";
import * as DropdownMenu from 'zeego/dropdown-menu'

export default function Search() {
  const insets = useSafeAreaInsets();
  const { height } = useScreenDimensions();
  const cardHeight = height / 2;

  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [debounceSearch, setDebounceSearch] = useState(''); // For debouncing
  const [viewType, setViewType] = useState('list');
  const toggleViewType = () => {
    setViewType(prevType => prevType === 'list' ? 'card' : 'list');
  };
  console.log(viewType)
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

      if (!response.ok) {
        console.error(`Server responded with status code ${response.status}`);
        return;
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error(`Expected application/json but received ${contentType || 'no content type'}`);
        return;
      }
  
      const result = await response.json();
      console.log(`Search response data: ${JSON.stringify(result)}`);
      setFilteredData([...result.results]);

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
    if (filteredData.length < 1) {
      return collection.find().limit(10);
    } else {
      return collection.find().where('id').in(filteredData.map(item => item.metadata.doc_id));
    }
  };

  // Use the useRxData hook to get the data based on the query
  const { result: bookmarks, isFetching } = useRxData(bookmarksCollectionName, queryConstructor);

  // Map of doc_id to score for sorting
  const scoreMapping = {};
  filteredData.forEach(item => {
    scoreMapping[item.metadata.doc_id] = item.score;
  });

  // Sort the bookmarks based on the score from the search results
  let sortedBookmarks = bookmarks;
  if (filteredData.length > 0) {
    sortedBookmarks = bookmarks.sort((a, b) => scoreMapping[b.id] - scoreMapping[a.id]);
  }
  console.log(`First item: ${JSON.stringify(sortedBookmarks[0])}`);


  return (
    <YStack flex={1} paddingTop={insets.top} paddingBottom={insets.bottom}>
      <XStack padding={10} alignItems="center" height={80}>
        <YStack padding={10} flex={10}>
          <XStack flex={1}>
            <ZStack flex={1}>
              <Input
                flex={1}
                value={search}
                onChangeText={handleSearch}
                placeholder="Search..."
              />
              <XStack position='absolute' right={10} top={0} bottom={0} justifyContent='center'>
                <SparklesIcon />
              </XStack>
            </ZStack>
          </XStack>
        </YStack>
        <YStack flex={1}>
          <XStack justifyContent='space-around'>
            <Button onPress={toggleViewType}>
              {viewType === 'list' ? <Squares2X2Icon /> : <ListBulletIcon />}
            </Button>
          </XStack>
        </YStack>
      </XStack>

      <View
        style={{
          flexDirection: viewType === 'card' ? 'column' : 'row',
          flexWrap: viewType === 'card' ? 'nowrap' : 'wrap'
        }}
      >
        <FlashList
          numColumns={cardFlex}
          data={sortedBookmarks}
          renderItem={({ item }) => viewType === 'list' ?
            <Card 
              key={item.id}
              elevate size="$4"
              bordered
              flex={1}
              height={cardHeight}
              margin={10}
            >
              <Image 
                flex={1}
                source={{ uri: item.image_url }} 
                resizeMode='contain'
                height={100 + '%'}
                width={100 + '%'}
              />
              <Text>{item.description}</Text>
            </Card>
            :
            <Card 
              key={item.id}
              elevate size="$4"
              bordered
              flex={1}
              height={cardHeight}
              margin={10}
            >
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
      </View>
    </YStack>
  );
}