const todoList = [];

const reducer = (state = todoList, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'UPDATE_TODO_STATUS':
      return state.map(todo => {
        if (todo.id === action.payload) {
          return {...todo, completed: !todo.completed};
        }
        return todo;
      });
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};
