import React, { createContext, useContext, useEffect, useState } from "react"
import { Task, TaskContextType } from "../types"
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
	const [tasks, setTasks] = useState<Task[]>(() => {
		const saved = localStorage.getItem("tasks")
		return saved ? JSON.parse(saved) : []
	})

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks))
	}, [tasks])

	const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
		const newTask: Task = {
			...taskData,
			id: uuidv4(),
			createdAt: Date.now(),
		}
		setTasks((prev) => [...prev, newTask])
	}

	const startTask = (id: string) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...task, status: "in-progress", startTime: Date.now() } : task))
		)
	}

	const endTask = (id: string) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id && task.startTime
					? {
							...task,
							status: "completed",
							actualDuration: (Date.now() - task.startTime) / 1000, // Store in seconds
					  }
					: task
			)
		)
	}

	const deleteTask = (id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id))
	}

	return (
		<TaskContext.Provider value={{ tasks, addTask, startTask, endTask, deleteTask }}>
			{children}
		</TaskContext.Provider>
	)
}

export function useTaskContext() {
	const context = useContext(TaskContext)
	if (!context) {
		throw new Error("useTaskContext must be used within a TaskProvider")
	}
	return context
}
