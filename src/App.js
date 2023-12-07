import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
// import { nanoid } from "nanoid";
import {FaGithub} from 'react-icons/fa'
import { v4 as uuid } from "uuid";
import Colors from "./Colors";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// adding outside App() function so they aren't recalculated every time the App componenent re-renders
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const [isColorsOpen, setIsColorsOpen] = useState(false);

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem("localTasks", JSON.stringify(updatedTasks));
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    localStorage.setItem("localTasks", JSON.stringify(remainingTasks));
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
    localStorage.setItem("localTasks", JSON.stringify(editedTaskList));
  }

  function addTask(name) {
    const newTask = { id: uuid().slice(0, 8), name, completed: false, color: "#009688", };
    setTasks([...tasks, newTask]);
    localStorage.setItem("localTasks", JSON.stringify([...tasks, newTask]));

  }

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
      key={name} 
      name={name}
      isPressed={name === filter}
      setFilter={setFilter} 
    />
  ));

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  useEffect(()=>{
    if(localStorage.getItem("localTasks")){
        const storedList = JSON.parse(localStorage.getItem("localTasks"));
        setTasks(storedList);
    }
  },[])

  const hideColorsContainer = (e) => {
    //   body.
    if (e.target.classList.contains("btn-colors")) return;
    setIsColorsOpen(false);
  };

  return (
    <div className='container' onClick={hideColorsContainer}>
      {isColorsOpen && <Colors />}
      <h1>To Do!</h1>
      <Form addTask={addTask}/>
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
      <div class="footer">
		    <a href='https://github.com/hello-sora' target='_blank' rel="noopener noreferrer"><FaGithub className='github'/></a>
	    </div>
    </div>    
  );
}

export default App;