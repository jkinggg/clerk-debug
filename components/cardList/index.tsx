import { useState } from 'react';
import { View } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { YStack, Card, Text, Image, XStack } from 'tamagui';

export default function CardList({ data, columns, cardHeight, estimatedSize, onSelectCard }) {

    const handleSelectCard = (card) => {
        onSelectCard(card);
    };

    return (
        <XStack backgroundColor={'white'} opacity={1}>
        <FlashList
            numColumns={columns}
            data={data}
            renderItem={({ item }) =>
                <Card
                    key={item.id}
                    elevate size="$4"
                    bordered
                    flex={1}
                    height={cardHeight}
                    margin={10}
                    onPress={() => handleSelectCard(item.id)}
                >
                    <XStack>
                        <YStack flex={2} overflow='hidden'>
                            <Image
                                source={{ uri: item.image_url }}
                                resizeMode='cover'
                                height={100 + '%'}
                                width={100 + '%'}
                            />
                        </YStack>
                        <YStack flex={4}>
                            <Text>{item.description}</Text>
                        </YStack>
                    </XStack>
                </Card>
            }
            estimatedItemSize={estimatedSize}
        />
        </XStack>
    );
}