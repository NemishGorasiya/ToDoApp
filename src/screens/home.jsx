import React, {useRef, useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import TodoList from '../components/todoList';

import CheckListImage from '../assets/images/checklist.png';
import AddIcon from '../assets/icons/add.svg';
import TimerIcon from '../assets/icons/timer.svg';
import SendIcon from '../assets/icons/send.svg';

const Home = ({navigation, route, todoList, editTodo, addTodo}) => {
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDateAndTime, setNewTodoDateAndTime] = useState(null);
  const [isShownDatePicker, setIsShownDatePicker] = useState(false);

  const bottomSheetRef = useRef(null);

  const onAddNewTodo = () => {
    addTodo({newTodoText: newTodo, newTodoDescription, newTodoDateAndTime});
    setNewTodo('');
    setNewTodoDescription('');
    setNewTodoDateAndTime(null);
    bottomSheetRef.current.close();
  };

  const onNewTodoChange = value => {
    setNewTodo(value);
  };

  const onNewTodoDescriptionChange = value => {
    setNewTodoDescription(value);
  };

  const openDatePicker = () => {
    setIsShownDatePicker(true);
  };

  const closeDatePicker = () => {
    setIsShownDatePicker(false);
  };

  const onNewTodoDateAndTimeChange = date => {
    setNewTodoDateAndTime(date);
    closeDatePicker();
  };

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
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

  const isNewTodoValid =
    newTodo.trim().length > 0 && newTodoDateAndTime !== null;

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
              editTodo={editTodo}
              listTitle="Todo List"
              navigation={navigation}
            />
            <TodoList
              list={completedTodos}
              editTodo={editTodo}
              listTitle="Completed"
              navigation={navigation}
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
            <TouchableOpacity onPress={onAddNewTodo} disabled={!isNewTodoValid}>
              <SendIcon
                height={24}
                width={24}
                color={isNewTodoValid ? '#8687E7' : '#888888'}
              />
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

export default Home;
