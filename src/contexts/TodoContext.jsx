import React, { createContext, useContext, useState, useEffect } from "react";

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    setTodos([...todos, { ...todo, id: Date.now(), isDone: false }]);
  };

  const updateTodo = (updatedTodo) => {
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  //const toggleTodo = (id) => {
  //setTodos(todos.map((t) => (t.id === id ? { ...t, isDone: !t.isDone } : t)));
  // };
  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const newIsDone = !todo.isDone;
          return {
            ...todo,
            isDone: newIsDone,
            // Jika task utama diceklis, semua sub-task mengikuti status task utama
            subTodos: todo.subTodos
              ? todo.subTodos.map((sub) => ({
                  ...sub,
                  isDone: newIsDone,
                }))
              : [],
          };
        }
        return todo;
      }),
    );
  };
  const toggleSubTodo = (todoId, subId) => {
    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          const newSub = t.subTodos.map((s) =>
            s.id === subId ? { ...s, isDone: !s.isDone } : s,
          );
          return { ...t, subTodos: newSub };
        }
        return t;
      }),
    );
  };

  const deleteSubTodo = (todoId, subId) => {
    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          return { ...t, subTodos: t.subTodos.filter((s) => s.id !== subId) };
        }
        return t;
      }),
    );
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        toggleSubTodo,
        deleteSubTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
