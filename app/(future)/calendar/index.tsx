import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import TimelineCalendar from '../../../components/calendar/TimelineCalendar';
import { RangeTime } from '../../../components/calendar/types';
import { useRouter } from "expo-router";
import { useRxData, useRxCollection, useRxQuery } from 'rxdb-hooks';
import { AppContext } from "../../../data/context";
import { eventsCollectionName } from "../../../data/initialize";
import { XStack, YStack, useMedia } from 'tamagui'
import TaskWrapper from '../../../components/tasks/taskList';
import useScreenDimensions from '../../../hooks/screenDimensions';
import DragTaskProvider from '../../../contexts/dragTaskProvider';

export default function CalendarScreen() {
  
  const { width, height } = useScreenDimensions();
  const isLandscape = width > height;
  const isIpad = width > 700;
  const sidebarWidth = isIpad && isLandscape ? width / 5 : 0;
  const calendarWidth = width - sidebarWidth;

  const { result: calendarEvents, isFetching } = useRxData(
		eventsCollectionName,
		collection =>
			collection?.find()
	);
  console.log("Calendar is fetching: " && isFetching);

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

  return (
    <SafeAreaView style={styles.container}>
      <DragTaskProvider>
        <XStack
          flex={1}
        >
          <YStack>
            <TimelineCalendar
              viewMode="week"
              calendarWidth={calendarWidth}
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
          </YStack>
          <YStack width={sidebarWidth}>
            <TaskWrapper />
          </YStack>
        </XStack>
      </DragTaskProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
