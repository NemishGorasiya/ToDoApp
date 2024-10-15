import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import uuid from 'react-native-uuid';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import CheckListImage from './src/assets/images/checklist.png';
import AddIcon from './src/assets/icons/add.svg';
import TimerIcon from './src/assets/icons/timer.svg';
import SendIcon from './src/assets/icons/send.svg';

import TodoList from './src/components/todoList';

const App = () => {
  const [todoList, setTodoList] = useState([
    {
      id: '1',
      text: 'todo 1',
      description: 'description 1',
      completed: false,
      dateAndTime: new Date(),
    },
    {
      id: '2',
      text: 'todo 2',
      description: 'description 2',
      completed: false,
      dateAndTime: new Date(),
    },
    {
      id: '3',
      text: 'todo 3',
      description: 'description 3',
      completed: false,
      dateAndTime: new Date(),
    },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDateAndTime, setNewTodoDateAndTime] = useState('');
  const [isShownDatePicker, setIsShownDatePicker] = useState(false);

  const bottomSheetRef = useRef(null);

  const addTodo = useCallback(() => {
    setTodoList(prevList => [
      ...prevList,
      {
        id: uuid.v4(),
        text: newTodo,
        description: newTodoDescription,
        completed: false,
        dateAndTime: newTodoDateAndTime,
      },
    ]);
    setNewTodo('');
    bottomSheetRef.current.close();
  }, [newTodo, newTodoDateAndTime, newTodoDescription]);

  const deleteTodo = id => {
    setTodoList(prevList => prevList.filter(item => item.id !== id));
  };

  const updateTodoStatus = useCallback((id, newStatus) => {
    setTodoList(prevList =>
      prevList.map(item => {
        if (item.id === id) {
          return {...item, completed: newStatus};
        }
        return item;
      }),
    );
  }, []);

  const onNewTodoChange = value => {
    setNewTodo(value);
  };

  const onNewTodoDescriptionChange = value => {
    setNewTodoDescription(value);
  };

  const onNewTodoDateAndTimeChange = value => {
    setNewTodoDateAndTime(value);
  };

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const openDatePicker = () => {
    setIsShownDatePicker(true);
  };

  const closeDatePicker = () => {
    setIsShownDatePicker(false);
  };

  const {inCompleteTodos, completedTodos} = todoList.reduce(
    (acc, todo) => {
      if (todo.completed) {
        acc.completedTodos.push(todo);
      } else {
        acc.inCompleteTodos.push(todo);
      }
      return acc;
    },
    {
      inCompleteTodos: [],
      completedTodos: [],
    },
  );

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        {todoList.length === 0 ? (
          <View style={styles.fallbackContainer}>
            <Image source={CheckListImage} />
            <Text style={styles.fallbackText}>
              What do you want to do today?
            </Text>
            <Text style={styles.fallbackSubText}>Tap + to add your tasks</Text>
          </View>
        ) : (
          <View style={styles.todoListWrapper}>
            <TodoList
              list={inCompleteTodos}
              updateTodoStatus={updateTodoStatus}
              listTitle="Todo List"
            />
            <TodoList
              list={completedTodos}
              updateTodoStatus={updateTodoStatus}
              listTitle="Completed"
            />
          </View>
        )}
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.openBottomSheetButton}
          onPress={openBottomSheet}>
          <AddIcon height={32} width={32} />
        </TouchableOpacity>
      </View>
      <RBSheet ref={bottomSheetRef}>
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.bottomSheetTitle}>Add Task</Text>
          <TextInput
            style={styles.newTodoInput}
            onChangeText={onNewTodoChange}
            value={newTodo}
            placeholder="Task Name"
            placeholderTextColor="#AFAFAF"
          />
          <TextInput
            style={styles.newTodoDescriptionInput}
            value={newTodoDescription}
            onChangeText={onNewTodoDescriptionChange}
            placeholder="Description"
            placeholderTextColor="#AFAFAF"
          />
          <View style={styles.actionIconsWrapper}>
            <TouchableOpacity onPress={openDatePicker}>
              <TimerIcon height={24} width={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={addTodo}>
              <SendIcon height={24} width={24} />
            </TouchableOpacity>
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isShownDatePicker}
          mode="datetime"
          onConfirm={onNewTodoDateAndTimeChange}
          onCancel={closeDatePicker}
        />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 24,
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 10,
  },
  fallbackSubText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  todoListWrapper: {
    rowGap: 16,
  },
  newTodoInput: {
    borderWidth: 1,
    borderColor: '#979797',
    color: '#fff',
    borderRadius: 4,
    paddingLeft: 16,
    fontSize: 18,
    lineHeight: 24,
  },
  newTodoDescriptionInput: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
  },
  todoDetailsWrapper: {
    flex: 1,
  },
  bottomSheetContainer: {
    padding: 16,
    backgroundColor: '#363636',
  },
  bottomSheetTitle: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 14,
  },
  actionIconsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  openBottomSheetButton: {
    backgroundColor: '#8687E7',
    borderRadius: 32,
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    top: '-50%',
    transform: [{translateX: -32}],
  },
  bottomBar: {
    backgroundColor: '#363636',
    position: 'relative',
    height: 64,
  },
});

export default App;
