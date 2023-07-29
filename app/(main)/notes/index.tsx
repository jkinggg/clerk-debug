import { Button, Card, CardProps, H2, Image, Paragraph, XStack } from 'tamagui'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react';
import { ListItem, Stack } from 'tamagui';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy groceries', done: false },
    { id: 2, text: 'Clean the house', done: false },
    { id: 3, text: 'Finish project', done: false },
  ]);

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  return (
    <Stack>
      {todos.map((todo) => (
        <ListItem
          key={todo.id}
          onPress={() => toggleTodo(todo.id)}
          icon={todo.done ? '✅' : '❌'}
        >
          <ListItem.Title>{todo.text}</ListItem.Title>
        </ListItem>
      ))}
    </Stack>
  );
};

export default TodoList;