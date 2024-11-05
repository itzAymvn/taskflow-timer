import { Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { TaskForm } from "./components/TaskForm"
import { TaskList } from "./components/TaskList"
import { Task } from "./types/task"
import { ExportTasks } from "./components/ExportTasks"
import { Collapse } from "./components/Collapse"

function App() {
	const [tasks, setTasks] = useState<Task[]>(() => {
		const saved = localStorage.getItem("tasks")
		const savedTasks = saved ? JSON.parse(saved) : []
		return savedTasks.map((task: Task) => ({
			...task,
			tags: task.tags || [],
		}))
	})

	useEffect(() => {
		localStorage.setItem("tasks", JSON.stringify(tasks))
	}, [tasks])

	const addTask = (taskData: Omit<Task, "id" | "status">) => {
		const newTask: Task = {
			...taskData,
			id: crypto.randomUUID(),
			status: "pending",
		}
		setTasks((prev) => [...prev, newTask])
	}

	const startTask = (id: string) => {
		setTasks((prev) =>
			prev.map((task) => (task.id === id ? { ...task, status: "active", startTime: Date.now() } : task))
		)
	}

	const endTask = (id: string) => {
		setTasks((prev) =>
			prev.map((task) =>
				task.id === id && task.startTime
					? {
							...task,
							status: "completed",
							duration: Math.round((Date.now() - task.startTime) / 1000),
					  }
					: task
			)
		)
	}

	const deleteTask = (id: string) => {
		setTasks((prev) => prev.filter((task) => task.id !== id))
	}

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				<div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
					<div className="flex items-center gap-3">
						<Clock size={32} className="text-blue-500" />
						<h1 className="text-3xl font-bold">Task Timer</h1>
					</div>
					<div className="w-full sm:w-auto sm:ml-auto">
						<ExportTasks tasks={tasks} />
					</div>
				</div>

				<div className="space-y-6">
					<Collapse title="Add New Task" defaultOpen={true}>
						<TaskForm onAddTask={addTask} />
					</Collapse>

					<div className="space-y-8">
						{["active", "pending", "paused", "completed", "cancelled"].map((status) => {
							const filteredTasks = tasks.filter((task) => task.status === status)
							if (filteredTasks.length === 0) return null

							return (
								<div key={status}>
									<h2 className="text-xl font-semibold mb-4 capitalize flex items-center gap-2">
										<span
											className={`w-2 h-2 rounded-full ${
												status === "active"
													? "bg-green-400"
													: status === "pending"
													? "bg-yellow-400"
													: status === "paused"
													? "bg-orange-400"
													: status === "completed"
													? "bg-blue-400"
													: "bg-red-400"
											}`}
										/>
										{status} Tasks
									</h2>
									<TaskList
										tasks={filteredTasks}
										onStartTask={startTask}
										onEndTask={endTask}
										onDeleteTask={deleteTask}
									/>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
