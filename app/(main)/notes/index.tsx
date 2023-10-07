import { YStack } from 'tamagui'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Stack } from 'tamagui'
import EditorComponent from '../../../components/editor'

const Editor = () => {

  return (
    <SafeAreaView style={styles.container}>
      <EditorComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

export default Editor;