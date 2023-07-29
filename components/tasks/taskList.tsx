import {
  Text,
  Anchor,
  Button,
  Checkbox,
  H1,
  Input,
  Paragraph,
  Separator,
  Sheet,
  Spinner,
  TextArea,
  XStack,
  YStack,
  Card,
  Form,
} from 'tamagui'
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'
import { Link } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRxData, useRxCollection, useRxQuery } from 'rxdb-hooks';
import { tasksCollectionName } from "../../data/initialize";
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useDragTaskContext } from '../../hooks/useDragTaskContext';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, runOnJS, useSharedValue } from 'react-native-reanimated';

const DATA = [
  {
    title: "First Item",
    isCompleted: false
  },
  {
    title: "Second Item",
    isCompleted: true
  },
];

const TaskItem = ({ item, setOpen }) => {
  const {
    isTaskBeingDragged,
    taskBeingDraggedId,
    setIsTaskBeingDragged,
    taskDropX,
    taskDropY,
    setTaskDropX,
    setTaskDropY,
  } = useDragTaskContext();

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (!isTaskBeingDragged.value) {
        isTaskBeingDragged.value = true;
        taskBeingDraggedId.value = item.id;
      }
    },
    onActive: (event, ctx) => {
      taskDropX.value = event.translationX;
      taskDropY.value = event.translationY;
    },
    onEnd: () => {
      // Reset the shared values
      taskDropX.value = 0;
      taskDropY.value = 0;
      isTaskBeingDragged.value = false;
      taskBeingDraggedId.value = null;  // Reset the task id
      
      // Update the context values
      runOnJS(setIsTaskBeingDragged)(isTaskBeingDragged.value);
      runOnJS(setTaskDropX)(taskDropX.value);
      runOnJS(setTaskDropY)(taskDropY.value);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    if (taskBeingDraggedId.value === item.id) {
      return {
        transform: [
          { translateX: taskDropX.value },
          { translateY: taskDropY.value },
        ],
      };
    } else {
      return {};
    }
  });

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View style={animatedStyle}>
        <Card size="$2" elevate onPress={() => setOpen(true)}>
          <XStack>
            <YStack alignItems='center' justifyContent='center' flex={2}>
              <Checkbox size="$4">
                <Checkbox.Indicator>
                  <Ionicons name="checkmark" size={12} color="black" />
                </Checkbox.Indicator>
              </Checkbox>
            </YStack>
            <YStack flex={10}>
              <Card.Header>
                <Text>{item.title}</Text>
              </Card.Header>
              <Card.Footer>
                <Button size="$1" borderRadius="$10">Purchase</Button>
              </Card.Footer>
            </YStack>
          </XStack>
        </Card>
      </Animated.View>
    </PanGestureHandler>
  );
};

const Tasks = () => {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('')

  const tasksCollection = useRxCollection(tasksCollectionName);
  const { result: tasks, isFetching } = useRxData(
		tasksCollectionName,
		collection =>
			collection?.find()
	);
  console.log(isFetching);
  if (isFetching) {
		return <Text>Loading...</Text>;
	}
  console.log(tasks);

  // useEffect(() => {
  //   const createTask = async () => {
  //     setStatus('submitting');
  //     const randomId = Math.random().toString(36).slice(2, 10);
  //     const newTask = {
  //       id: randomId,
  //       title: taskTitle,
  //       description: taskDescription
  //     };
  //     await tasksCollection.upsert(newTask);
  //     setStatus('off');
  //     setOpen(false);
  //   };
  
  //   if (taskTitle && taskDescription) {
  //     createTask();
  //   }
  // }, [taskTitle, taskDescription]);

  return (
      <YStack paddingTop={insets.top} paddingBottom={insets.bottom} flex={1}>
        <FlashList
          data={DATA}
          renderItem={({ item }) => <TaskItem item={item} setOpen={setOpen} />}
          estimatedItemSize={2}
        />
        <Sheet
          forceRemoveScrollEnabled={open}
          modal={true}
          open={open}
          onOpenChange={setOpen}
          snapPoints={[75, 50, 25]}
          dismissOnSnapToBottom
          position={position}
          onPositionChange={setPosition}
          zIndex={100_000}
          animation="bouncy" // for the css driver
        >
          <Sheet.Overlay />
          <Sheet.Handle />
          <Sheet.Frame flex={1} padding="$4" justifyContent="center" alignItems="center" space="$5">
            <YStack flex={1} alignSelf='stretch'>
              <Form onSubmit={() => createTask()}>
                <Input value={taskTitle} onChangeText={setTaskTitle} placeholder="Title" borderWidth={2} />
                <TextArea value={taskDescription} onChangeText={setTaskDescription} minHeight={140} placeholder="Description" numberOfLines={4} />
                <Form.Trigger asChild disabled={status !== 'off'}>
                <Button icon={status === 'submitting' ? () => <Spinner /> : undefined}>
                  Add
                </Button>
                </Form.Trigger>
              </Form>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </YStack>
  )
}

export default Tasks;