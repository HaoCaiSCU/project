import React, { useState, useEffect } from "react";
import * as client from "./client";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { FaPencil, FaExclamation } from "react-icons/fa6";

export default function WorkingWithArraysAsynchronously() {
    const [todos, setTodos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const editTodo = (todo: any, field: string) => {
        const updatedTodos = todos.map((t) =>
            t.id === todo.id ? { ...todo, editingField: field } : t
        );
        setTodos(updatedTodos);
    };

    const updateTodo = async (todo: any) => {
        try {
            await client.updateTodo(todo);
            setTodos(todos.map((t) => (t.id === todo.id ? todo : t)));
            setErrorMessage(null); 
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "An error occurred");
        }
    };

    const createTodo = async () => {
        try {
            const todos = await client.createTodo();
            setTodos(todos);
            setErrorMessage(null); 
        } catch (error: any) {
            setErrorMessage("Failed to create a new Todo");
        }
    };

    const postTodo = async () => {
        const newTodo = await client.postTodo({
            title: "New Posted Todo",
            completed: false,
            description: "",
            important: false,
        });
        setTodos([...todos, newTodo]);
    };

    const fetchTodos = async () => {
        const todos = await client.fetchTodos();
        setTodos(todos);
    };

    const removeTodo = async (todo: any) => {
        const updatedTodos = await client.removeTodo(todo);
        setTodos(updatedTodos);
    };

    const deleteTodo = async (todo: any) => {
        try {
            await client.deleteTodo(todo);
            const newTodos = todos.filter((t) => t.id !== todo.id);
            setTodos(newTodos);
            setErrorMessage(null); 
        } catch (error: any) {
            setErrorMessage(error.response?.data?.message || "An error occurred");
        }
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const todos = await client.fetchTodos();
                setTodos(todos);
            } catch (error: any) {
                setErrorMessage("Failed to fetch Todos");
            }
        };
        fetchTodos();
    }, []);

    return (
        <div id="wd-asynchronous-arrays">
            <h3>Working with Arrays Asynchronously</h3>
            {errorMessage && (<div id="wd-todo-error-message" className="alert alert-danger mb-2 mt-2">{errorMessage}</div>)}
            <h4>
                Todos
                <FaPlusCircle
                    onClick={createTodo}
                    className="text-success float-end fs-3"
                    id="wd-create-todo"
                />
                <FaPlusCircle
                    onClick={postTodo}
                    className="text-primary float-end fs-3 me-3"
                    id="wd-post-todo"
                />
            </h4>
            <ul className="list-group">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`list-group-item ${todo.important ? "bg-warning" : ""
                            }`}
                    >
                        <FaTrash
                            onClick={() => removeTodo(todo)}
                            className="text-danger float-end mt-1"
                            id="wd-remove-todo"
                        />
                        <TiDelete
                            onClick={() => deleteTodo(todo)}
                            className="text-danger float-end me-2 fs-3"
                            id="wd-delete-todo"
                        />
                        <FaPencil
                            onClick={() => editTodo(todo, "title")}
                            className="text-primary float-end me-2 mt-1"
                        />


                        <input
                            type="checkbox"
                            defaultChecked={todo.completed}
                            className="form-check-input me-2 float-start"
                            onChange={(e) =>
                                updateTodo({ ...todo, completed: e.target.checked })
                            }
                        />

                        {todo.editingField === "title" ? (
                            <input
                                className="form-control w-50 float-start"
                                defaultValue={todo.title}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        updateTodo({
                                            ...todo,
                                            editingField: null,
                                            title: (e.target as HTMLInputElement).value,
                                        });
                                    }
                                }}
                                onChange={(e) =>
                                    setTodos(
                                        todos.map((t) =>
                                            t.id === todo.id
                                                ? { ...todo, title: e.target.value }
                                                : t
                                        )
                                    )
                                }
                            />
                        ) : (
                            <span
                                style={{
                                    textDecoration: todo.completed
                                        ? "line-through"
                                        : "none",
                                }}
                            >
                                {todo.title}
                            </span>
                        )}


                    </li>
                ))}
            </ul>
            <hr />
        </div>
    );
}
