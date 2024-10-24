import React, {useRef, useState} from 'react';
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification, {Importance} from 'react-native-push-notification';

import TodoList from '../components/todoList';

import CheckListImage from '../assets/images/checklist.png';
import AddIcon from '../assets/icons/add.svg';
import TimerIcon from '../assets/icons/timer.svg';
import SendIcon from '../assets/icons/send.svg';
import CrossIcon from '../assets/icons/cross.svg';
import ActionSheet from 'react-native-actions-sheet';
import {
  formatRelative,
  isFuture,
  nextSunday,
  setHours,
  setMinutes,
  setSeconds,
  startOfTomorrow,
} from 'date-fns';
import RemindMeDropdown from '../components/remindMeDropdown';

const Home = ({navigation, todoList, editTodo, addTodo}) => {
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoDateAndTime, setNewTodoDateAndTime] = useState(null);
  const [newTodoNotifyAtLabel, setNewTodoNotifyAtLabel] = useState('');
  const [notifyAt, setNotifyAt] = useState('');
  const [isShownDatePicker, setIsShownDatePicker] = useState(false);
  const [isShownNotifyAtDatePicker, setIsShownNotifyAtDatePicker] =
    useState(false);

  const actionSheetRef = useRef(null);

  const scheduleNotification = (date, message) => {
    PushNotification.localNotificationSchedule({
      channelId: 'notifyMe',
      title: 'My Notification Title',
      message: message,
      date,
      allowWhileIdle: true,
      playSound: true,
      soundName: 'default',
      vibrate: true,
      importance: Importance.HIGH,
    });
  };

  const onAddNewTodo = () => {
    addTodo({
      newTodoText: newTodo,
      newTodoDescription,
      newTodoDateAndTime: newTodoDateAndTime.toString(),
      newTodoNotifyAt: notifyAt?.toString() || '',
    });
    if (notifyAt) {
      scheduleNotification(notifyAt, newTodo);
    }
    setNewTodo('');
    setNewTodoDescription('');
    setNewTodoDateAndTime(null);
    setNotifyAt(null);
    setNewTodoNotifyAtLabel('');
    actionSheetRef.current.hide();
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

  const openNotifyAtPicker = () => {
    setIsShownNotifyAtDatePicker(true);
  };

  const closeNotifyAtPicker = () => {
    setIsShownNotifyAtDatePicker(false);
  };

  const onNewTodoDateAndTimeChange = date => {
    setNewTodoDateAndTime(date);
    closeDatePicker();
  };

  const openActionSheet = () => {
    actionSheetRef.current.show();
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

  const onRemindMeDropdownChange = item => {
    switch (item.value) {
      case 'laterTodayEvening':
        const calculatedTime = setSeconds(
          setMinutes(setHours(new Date(), 20), 0),
          0,
        );
        if (isFuture(calculatedTime)) {
          setNotifyAt(calculatedTime);
          setNewTodoNotifyAtLabel(formatRelative(calculatedTime, new Date()));
        } else {
          ToastAndroid.show('Time cannot be in the past', ToastAndroid.SHORT);
        }
        break;
      case 'tomorrowMorning':
        const calculatedTime2 = setHours(startOfTomorrow(), 9);
        setNotifyAt(calculatedTime2);
        setNewTodoNotifyAtLabel(formatRelative(calculatedTime2, new Date()));
        break;
      case 'onNextSunday':
        const calculatedTime3 = setSeconds(
          setMinutes(setHours(nextSunday(new Date()), 9), 0),
          0,
        );
        setNotifyAt(calculatedTime3);
        setNewTodoNotifyAtLabel(formatRelative(calculatedTime3, new Date()));
        break;
      case 'pickDateAndTime':
        console.log('pickDateAndTime', notifyAt);
        openNotifyAtPicker();
        break;
      default:
        break;
    }
  };

  const isNewTodoValid =
    newTodo.trim().length > 0 && newTodoDateAndTime !== null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.hero}
        contentContainerStyle={styles.heroContent}>
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
            {inCompleteTodos.length > 0 && (
              <TodoList
                list={inCompleteTodos}
                editTodo={editTodo}
                listTitle="Todo List"
                navigation={navigation}
              />
            )}
            {completedTodos.length > 0 && (
              <TodoList
                list={completedTodos}
                editTodo={editTodo}
                listTitle="Completed"
                navigation={navigation}
              />
            )}
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.openActionSheetButton}
          onPress={openActionSheet}>
          <AddIcon height={32} width={32} />
        </TouchableOpacity>
      </View>
      <ActionSheet
        containerStyle={styles.actionSheet}
        ref={actionSheetRef}
        gestureEnabled={true}
        indicatorStyle={styles.actionSheetIndicator}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Add Task</Text>
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
              <TimerIcon height={24} width={24} color="#fff" />
            </TouchableOpacity>
            <RemindMeDropdown
              onChange={onRemindMeDropdownChange}
              notifyAtTime={notifyAt}
              notifyAtLabel={newTodoNotifyAtLabel}
            />

            {notifyAt && (
              <TouchableOpacity
                onPress={() => {
                  setNotifyAt(null);
                }}>
                <CrossIcon height={24} width={24} color="#fff" />
              </TouchableOpacity>
            )}

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
        <DateTimePickerModal
          isVisible={isShownNotifyAtDatePicker}
          mode="datetime"
          onConfirm={date => {
            setNotifyAt(date);
            setNewTodoNotifyAtLabel(formatRelative(date, new Date()));
            closeNotifyAtPicker();
          }}
          onCancel={closeNotifyAtPicker}
        />
      </ActionSheet>
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
  },
  heroContent: {
    flexGrow: 1,
  },
  fallbackContainer: {
    flexGrow: 1,
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
    padding: 24,
    flexGrow: 1,
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
  actionSheet: {
    backgroundColor: '#363636',
  },
  actionSheetIndicator: {
    backgroundColor: '#979797',
    width: 100,
  },
  actionSheetContent: {
    padding: 16,
  },
  actionSheetTitle: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 14,
  },
  actionIconsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  openActionSheetButton: {
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
