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
  ZStack,
  Card,
  Form,
  Square,
} from 'tamagui'
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react'
import { Link } from 'expo-router';
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRxData, useRxCollection, useRxQuery } from 'rxdb-hooks';
import { tasksCollectionName } from "../../data/initialize";
import Task from "./task";
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useDragTaskContext } from '../../hooks/useDragTaskContext';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, runOnJS, useDerivedValue, useAnimatedReaction } from 'react-native-reanimated';
import { View } from 'react-native';

const DATA = [
  {
    id: 1,
    title: "First Item",
    isCompleted: false
  },
  {
    id: 2,
    title: "Second Item",
    isCompleted: true
  },
];

const ClonedTask = () => {
  const {
    isTaskBeingDragged,
    taskBeingDraggedId,
    taskDropX,
    taskDropY,
  } = useDragTaskContext();

  console.log({
    isTaskBeingDragged,
    taskBeingDraggedId,
    taskDropX,
    taskDropY,
  });

  if (!isTaskBeingDragged) {
    return null;
  }

  const task = {
    id: 1,
    title: "Dragging Item",
    isCompleted: false
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: taskDropX.value },
        { translateY: taskDropY.value },
      ],
    };
  });

  return (
      <Animated.View style={animatedStyle}>
        <Task item={task} />
      </Animated.View>
  );
};

const TaskItem = ({ item, setOpen }) => {
  const {
    isTaskBeingDragged, // get this from context
    setTaskBeingDraggedId,
    taskDropX,
    taskDropY,
  } = useDragTaskContext();

  console.log("isTaskBeingDragged: ", isTaskBeingDragged.value);

  const onDragStart = (id) => {
    setTaskBeingDraggedId(id);
    console.log("onDragStart: ", id)
  };

  const onDragEnd = () => {
    setTaskBeingDraggedId(null);
    console.log("onDragEnd");
  };

  const panGestureHandler = React.useCallback(
    useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = taskDropX.value;
        ctx.startY = taskDropY.value;
        isTaskBeingDragged.value = true;
        runOnJS(onDragStart)(item.id);
        console.log(`onStart: taskDropX = ${taskDropX.value}, taskDropY = ${taskDropY.value}`);
      },
      onActive: (event, ctx) => {
        if(isTaskBeingDragged.value) {
          taskDropX.value = ctx.startX + event.translationX;
          taskDropY.value = ctx.startY + event.translationY;
          console.log(`onActive: taskDropX = ${taskDropX.value}, taskDropY = ${taskDropY.value}`);
        }
      },
      onEnd: () => {
        isTaskBeingDragged.value = false;
        runOnJS(onDragEnd)();
        taskDropX.value = 0;  // reset taskDropX
        taskDropY.value = 0;  // reset taskDropY
        console.log(`onEnd: taskDropX = ${taskDropX.value}, taskDropY = ${taskDropY.value}`);
      },
    }),
    [item.id]
  );

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Animated.View>
        <Task item={item} />
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

const TasksWrapper = () => {
  const { isTaskBeingDragged } = useDragTaskContext();
  const [isDragging, setIsDragging] = useState(false);
  useDerivedValue(() => {
    runOnJS(setIsDragging)(isTaskBeingDragged.value);
  });

  return (
    <ZStack flex={1}>
      <YStack flex={1}>
        <Tasks />
      </YStack>
      {isDragging &&
        <YStack flex={1}>
          <ClonedTask />
        </YStack>
      }
    </ZStack>
  );
};

export default TasksWrapper;