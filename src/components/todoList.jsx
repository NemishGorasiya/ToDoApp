import {formatRelative} from 'date-fns';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const TodoList = ({navigation, list, listTitle, editTodo}) => {
  return (
    <View style={styles.todoListContainer}>
      <Text style={styles.todoListTitle}>{listTitle}</Text>
      {list.map(item => {
        const formattedTime = formatRelative(item.dateAndTime, new Date());
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.todoItem}
            onPress={() => navigation.navigate('Todo', {todo: item})}>
            <View>
              <BouncyCheckbox
                isChecked={item.completed}
                onPress={isChecked => editTodo(item.id, {completed: isChecked})}
                size={16}
                style={styles.checkbox}
              />
            </View>
            <View style={styles.todoTextContainer}>
              <Text
                style={[
                  styles.todoText,
                  item.completed && styles.todoTextCompleted,
                ]}
                numberOfLines={2}>
                {item.text}
              </Text>
              <Text style={styles.todoSubText} numberOfLines={1}>
                {formattedTime}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  todoListContainer: {
    rowGap: 16,
  },
  todoListTitle: {
    color: '#fff',
  },
  todoItem: {
    backgroundColor: '#363636',
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  checkbox: {
    width: 16,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 21,
  },
  todoSubText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#AFAFAF',
    textTransform: 'capitalize',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
  },
});

export default TodoList;
