import React, { useState, useContext, useRef } from "react";

const getTasks = () => {
  const tasks = localStorage.getItem("tasks");
  return tasks ? JSON.parse(tasks) : [];
};

const AppContext = React.createContext(null);

const AppProvider = ({ children }) => {
  const inputRef = useRef(null);
  const [tasks, setTasks] = useState(getTasks());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [filter, setFilter] = useState("all");
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [location, setLocation] = useState({});
  const refContainer = useRef(null);

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id) => {
    const { name } = tasks.find((task) => task.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(name);
    inputRef.current.focus();
  };

  const showColors = (e, id) => {
    const { top, right } = e.target.getBoundingClientRect();
    setLocation({ top, right, id });
    setIsColorsOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        removeTask,
        refContainer,
        isEditing,
        setIsEditing,
        editId,
        setEditId,
        editTask,
        name,
        setName,
        getTasks,
        filter,
        setFilter,
        inputRef,
        location,
        setLocation,
        isColorsOpen,
        setIsColorsOpen,
        showColors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider, useGlobalContext };