import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatRelative} from 'date-fns';

import TimerIcon from '../assets/icons/timer.svg';
import TrashIcon from '../assets/icons/trash.svg';
import {useFocusEffect} from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';

const Todo = ({navigation, route, editTodo, deleteTodo}) => {
  const {todo} = route.params;
  const {id, text, description, dateAndTime, completed} = todo;

  const [todoText, setTodoText] = useState(text);
  const todoTextRef = useRef(text);
  const [todoDescription, setTodoDescription] = useState(description);
  const todoDescriptionRef = useRef(description);
  const [todoDateAndTime, setTodoDateAndTime] = useState(dateAndTime);
  const todoDateAndTimeRef = useRef(dateAndTime);
  const [isTodoCompleted, setIsTodoCompleted] = useState(completed);
  const isTodoCompletedRef = useRef(completed);
  const [isShownDatePicker, setIsShownDatePicker] = useState(false);

  const actionSheetRef = useRef(null);

  const openDatePicker = () => {
    setIsShownDatePicker(true);
  };

  const closeDatePicker = () => {
    setIsShownDatePicker(false);
  };

  const onTodoDateAndTimeChange = date => {
    setTodoDateAndTime(date);
    closeDatePicker();
  };

  const onEditTodoStatus = isChecked => {
    setIsTodoCompleted(isChecked);
  };

  const onDeleteTodo = () => {
    deleteTodo(id);
    navigation.navigate('Home');
    ToastAndroid.show('Todo deleted', ToastAndroid.SHORT);
  };

  const formattedTime = formatRelative(todoDateAndTime, new Date());

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (
          todoTextRef.current !== text ||
          todoDescriptionRef.current !== description ||
          isTodoCompletedRef.current !== completed ||
          todoDateAndTimeRef.current !== dateAndTime
        ) {
          editTodo(id, {
            text: todoTextRef.current === '' ? text : todoTextRef.current,
            description: todoDescriptionRef.current,
            dateAndTime: todoDateAndTimeRef.current,
            completed: isTodoCompletedRef.current,
          });
        }
      };
    }, [completed, dateAndTime, description, editTodo, id, text]),
  );

  useEffect(() => {
    todoTextRef.current = todoText;
    todoDescriptionRef.current = todoDescription;
    todoDateAndTimeRef.current = todoDateAndTime;
    isTodoCompletedRef.current = isTodoCompleted;
  }, [isTodoCompleted, todoDateAndTime, todoDescription, todoText]);

  return (
    <View style={styles.container}>
      <View style={styles.todoMainRow}>
        <View>
          <BouncyCheckbox
            isChecked={completed}
            onPress={isChecked => onEditTodoStatus(isChecked)}
            size={16}
            style={styles.checkbox}
          />
        </View>
        <View style={styles.todoTextContainer}>
          <TextInput
            style={styles.todoTextInput}
            value={todoText}
            onChangeText={setTodoText}
            underlineColor="blue"
          />
          <TextInput
            style={styles.todoDescriptionInput}
            value={todoDescription}
            onChangeText={setTodoDescription}
            placeholder="Task Description"
            placeholderTextColor="#AFAFAF"
          />
        </View>
      </View>
      <View style={styles.todoRow}>
        <View style={styles.todoRowLeft}>
          <TimerIcon height={24} width={24} />
          <Text style={[styles.todoSubText, styles.whiteText]}>Task Time:</Text>
        </View>
        <TouchableOpacity style={styles.todoRowRight} onPress={openDatePicker}>
          <Text style={styles.whiteText}>{formattedTime}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.todoRow}>
        <TouchableOpacity
          onPress={() => {
            actionSheetRef.current.show();
          }}
          style={styles.todoRowLeft}>
          <TrashIcon height={24} width={24} />
          <Text style={[styles.todoSubText, styles.deleteText]}>
            Delete Task
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isShownDatePicker}
        mode="datetime"
        onConfirm={onTodoDateAndTimeChange}
        onCancel={closeDatePicker}
      />
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetMessage}>Are you sure?</Text>
          <View style={styles.actionSheetButtonsWrapper}>
            <TouchableOpacity
              style={[styles.actionSheetButton, styles.actionSheetCancelButton]}
              onPress={() => actionSheetRef.current.hide()}>
              <Text
                style={[
                  styles.actionSheetButtonText,
                  styles.actionSheetCancelButtonText,
                ]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionSheetButton, styles.actionSheetDeleteButton]}
              onPress={onDeleteTodo}>
              <Text style={styles.actionSheetButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#121212',
    gap: 24,
  },
  todoTextInput: {
    color: '#fff',
    fontSize: 20,
    padding: 0,
    lineHeight: 20,
  },
  todoDescriptionInput: {
    color: '#AFAFAF',
    fontSize: 16,
    padding: 0,
    lineHeight: 16,
  },
  todoSubText: {
    color: '#AFAFAF',
    fontSize: 16,
  },
  todoTextContainer: {
    gap: 16,
  },
  checkbox: {
    width: 16,
    marginLeft: 4,
  },
  whiteText: {
    color: '#fff',
  },
  deleteText: {
    color: '#FF4949',
  },
  todoMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  todoRowRight: {
    backgroundColor: '#444444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  todoRowLeft: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionSheetContent: {
    padding: 24,
    gap: 16,
  },
  actionSheetMessage: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  actionSheetButtonsWrapper: {
    flexDirection: 'row',
    gap: 16,
  },
  actionSheetButton: {
    backgroundColor: '#444444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
  },
  actionSheetCancelButton: {
    backgroundColor: 'transparent',
  },
  actionSheetDeleteButton: {
    backgroundColor: '#FF4949',
  },
  actionSheetButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  actionSheetCancelButtonText: {
    color: '#000',
    textAlign: 'center',
  },
});

export default Todo;
