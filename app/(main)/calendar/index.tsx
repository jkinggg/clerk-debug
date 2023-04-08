import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import TimelineCalendar from '../../../src/calendar/TimelineCalendar';
import { RangeTime } from '../../../src/calendar/types';
import { useRouter } from "expo-router";
import { useRxData, useRxCollection, useRxQuery } from 'rxdb-hooks';
import { AppContext } from "../../../data/context";
import { eventsCollectionName } from "../../../data/initialize";

export default function CalendarScreen() {
  
  const { result: calendarEvents, isFetching } = useRxData(
		eventsCollectionName,
		collection =>
			collection?.find()
	);

  console.log(isFetching);
  
  {/*
  const { db } = useContext(AppContext);
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
      let sub;
      if (db && db[CollectionName]) {
          sub = db[CollectionName]
              .find()
              .$.subscribe((rxdbEvents) => {
                  setEvents(rxdbEvents);
              });
      }
      return () => {
          if (sub && sub.unsubscribe) sub.unsubscribe();
      };
  }, [db]);
  */}

  const exampleEvents = [
    {
      id: 'trTTHRqGSTQfm96Ig0sN',
      title: 'Event 1',
      start: '2023-03-07T10:00:00.000Z',
      end: '2023-03-07T11:00:00.000Z',
      description: 'Hello world',
    },
    {
      id: 'IoTTHRqGSTQfm96Ig0sN',
      title: 'Event 2',
      start: '2023-03-07T15:00:00.000Z',
      end: '2023-03-07T20:00:00.000Z',
    },
    {
      end: "2023-03-07T15:00:00.000Z",
      id: "IrTTHRqGSTQfm96Ig0sN",
      start: "2023-03-07T11:00:00.000Z",
      title: "Coding",
    },
  ];

  {/*
  useEffect(() => {
    setEvents(exampleEvents);
  }, []);
  */}
  const eventsCollection = useRxCollection(eventsCollectionName);

  const _onDragCreateEnd = async (event: RangeTime) => {
    const randomId = Math.random().toString(36).slice(2, 10);
    const newEvent = {
      id: randomId,
      title: randomId,
      start: event.start,
      end: event.end,
      color: '#A3C7D6',
    };
    await eventsCollection.upsert(newEvent);
  };
  
  {/*
  if (isFetching) {
		return <Text>Loading...</Text>;
	}
  */}

  console.log(calendarEvents);
  // console.log(exampleEvents);

  return (
    <SafeAreaView style={styles.container}>
      <TimelineCalendar
        viewMode="week"
        isLoading={isFetching}
        events={calendarEvents}
        allowDragToCreate
        onDragCreateEnd={_onDragCreateEnd}
        // Optional
        dragCreateInterval={120}
        dragStep={20}
        theme={{
          dragCreateItemBackgroundColor: 'rgba(0, 18, 83, 0.2)',
          dragHourColor: '#001253',
          dragHourBorderColor: '#001253',
          dragHourBackgroundColor: '#FFF',
          dayName: { color: 'black' },
          dayNumber: { color: 'black' },
          dayNumberContainer: { backgroundColor: 'white' },
        }}
        // End Optional
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
