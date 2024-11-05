export interface Task {
	id: string
	title: string
	description: string
	dueDate: string
	estimatedDuration: number // in minutes
	status: "pending" | "in-progress" | "completed"
	startTime?: number
	actualDuration?: number // in seconds
	createdAt: number
}

export type TaskContextType = {
	tasks: Task[]
	addTask: (task: Omit<Task, "id" | "createdAt">) => void
	startTask: (id: string) => void
	endTask: (id: string) => void
	deleteTask: (id: string) => void
}
