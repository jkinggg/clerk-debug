import React from 'react';
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

const Task = ({ item, positionX, positionY }) => {
  return (
    <Card size="$2" elevate x={positionX} y={positionY}>
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
  );
};

export default Task;