import { YStack } from 'tamagui'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Stack } from 'tamagui'
import EditorComponent from '../../../components/editor'

const Editor = () => {

  const [editorContent, setEditorContent] = useState({
    time: 1696651795976,
    blocks: [
      {
        id: "mhTl6ghSkV",
        type: "paragraph",
        data: {
          text: "Hey. Meet the new Editor. On this picture you can see it in action. Then, try a demo 🤓",
        },
      }
    ],
  });

  return (
    <EditorComponent 
      initialContent={editorContent} 
      onContentChange={(newContent) => setEditorContent(newContent)} 
    />
  );
};

export default Editor;