import React, {useCallback, useEffect, useState} from 'react';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Home from './src/screens/home';
import Todo from './src/screens/todo';
import Splash from './src/screens/splash';

const Stack = createNativeStackNavigator();

import PushNotification, {Importance} from 'react-native-push-notification';
import {PermissionsAndroid, Platform} from 'react-native';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel(
  {
    channelId: 'notifyMe',
    channelName: 'My channel',
    channelDescription: 'A channel to categorise your notifications',
  },
  created => console.log(`createChannel returned '${created}'`),
);

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = useCallback(
    async ({
      newTodoText,
      newTodoDescription = '',
      newTodoDateAndTime,
      newTodoNotifyAt = null,
    }) => {
      const id = uuid.v4();
      const updatedList = [
        ...todoList,
        {
          id,
          text: newTodoText,
          description: newTodoDescription,
          completed: false,
          dateAndTime: newTodoDateAndTime,
          notifyAt: newTodoNotifyAt,
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

  const askForPermission = async () => {
    console.log('called askForPermission');
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (error) {}
  };

  useEffect(() => {
    askForPermission();
    readTodoList();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" options={{headerShown: false}}>
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
            <Stack.Screen name="Todo" options={{headerShown: false}}>
              {props => (
                <Todo {...props} deleteTodo={deleteTodo} editTodo={editTodo} />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
