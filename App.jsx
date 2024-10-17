import React, {useCallback, useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './src/screens/home';
import Todo from './src/screens/todo';
import Splash from './src/screens/splash';

const Stack = createNativeStackNavigator();

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = useCallback(
    async ({newTodoText, newTodoDescription = '', newTodoDateAndTime}) => {
      const updatedList = [
        ...todoList,
        {
          id: uuid.v4(),
          text: newTodoText,
          description: newTodoDescription,
          completed: false,
          dateAndTime: newTodoDateAndTime,
        },
      ];
      setTodoList(updatedList);
      try {
        await AsyncStorage.setItem('todoList', JSON.stringify(updatedList));
      } catch (error) {
        console.log('error', error);
      }
    },
    [todoList],
  );

  const deleteTodo = useCallback(
    async id => {
      const updatedList = todoList.filter(item => item.id !== id);
      setTodoList(updatedList);
      try {
        await AsyncStorage.setItem('todoList', JSON.stringify(updatedList));
      } catch (error) {
        console.log('error', error);
      }
    },
    [todoList],
  );

  const editTodo = useCallback(
    async (id, editedTodo) => {
      const updatedList = todoList.map(item => {
        if (item.id === id) {
          return {...item, ...editedTodo};
        }
        return item;
      });
      setTodoList(updatedList);
      try {
        await AsyncStorage.setItem('todoList', JSON.stringify(updatedList));
      } catch (error) {
        console.log('error', error);
      }
    },
    [todoList],
  );

  const readTodoList = async () => {
    try {
      setIsLoading(true);
      setTimeout(async () => {
        const storedTodoList = await AsyncStorage.getItem('todoList');
        if (storedTodoList !== null) {
          setTodoList(JSON.parse(storedTodoList));
        }
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    readTodoList();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" options={{headerShown: !isLoading}}>
          {props =>
            isLoading ? (
              <Splash {...props} />
            ) : (
              <Home
                {...props}
                todoList={todoList}
                addTodo={addTodo}
                editTodo={editTodo}
              />
            )
          }
        </Stack.Screen>
        <Stack.Screen name="Todo">
          {props => (
            <Todo {...props} deleteTodo={deleteTodo} editTodo={editTodo} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
