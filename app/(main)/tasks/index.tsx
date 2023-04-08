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
import { tasksCollectionName } from "../../../data/initialize";

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

export default function Tasks() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(0);
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('')

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

  const tasksCollection = useRxCollection(tasksCollectionName);

  const createTask = async () => {
    setStatus('submitting');
    const randomId = Math.random().toString(36).slice(2, 10);
    const newTask = {
      id: randomId,
      title: taskTitle,
      description: taskDescription
    };
    await tasksCollection.upsert(newTask);
    setStatus('off');
    setOpen(false);
  };

  return (
      <YStack paddingTop={insets.top} paddingBottom={insets.bottom} flex={1}>
        <FlashList
          data={DATA}
          renderItem={({ item }) => 
            <>
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
            <Separator />
            </>
          }
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