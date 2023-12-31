import React, { useEffect, useRef, useState } from "react";
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdDeleteOutline,
} from "react-icons/md";
import { FiEdit } from "react-icons/fi";

function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}

function Todo(props) {
    const [isEditing, setEditing] = useState(false);
    const [newName, setNewName] = useState("");

    const editFieldRef = useRef(null);
    const editButtonRef = useRef(null);
    
    const wasEditing = usePrevious(isEditing);

    function handleChange(e) {
        setNewName(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.editTask(props.id, newName);
        setNewName("");
        setEditing(false);
    }

    const editingTemplate = (
        <form className="stack-small" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="todo-label" htmlFor={props.id}>
              New name for {props.name}    
            </label>
            <input 
                id={props.id} 
                className="todo-text" 
                type="text" 
                value={newName}
                placeholder="New name"
                onChange={handleChange}
                ref={editFieldRef}
            />
          </div>
          <div className="btn-group">
            <button 
                type="button" 
                className="btn todo-cancel"
                onClick={() => setEditing(false)}>
                Cancel
                <span className="visually-hidden"> renaming {props.name}</span>
            </button>
            <button 
              type="submit" 
              className="btn btn__primary todo-edit">
              Save
              <span className="visually-hidden"> new name for {props.name}</span>
            </button>
          </div>
        </form>
    );
      const viewTemplate = (
        <div className={`task ${props.completed && "task-done"}`}>
          <button onClick={() => props.toggleTaskCompleted(props.id)}>
            {props.completed ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          </button>
            <p>{props.name}</p>
          <button 
              onClick={() => setEditing(true)}
              ref={editButtonRef}>
              <FiEdit />
          </button>
          <button
            onClick={() => props.deleteTask(props.id)}
            style={{ marginLeft: "auto" }}>
            <MdDeleteOutline />
          </button>
        </div>
    );

    useEffect(() => {
        if (!wasEditing && isEditing) {
          editFieldRef.current.focus();
        }
        if (wasEditing && !isEditing) {
          editButtonRef.current.focus();
        }
    }, [wasEditing, isEditing]);
      
    return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
  }
  
  export default Todo;