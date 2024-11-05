export interface Task {
	id: string
	title: string
	date: string
	startTime?: number
	duration?: number
	estimatedDuration?: number
	status: "pending" | "active" | "paused" | "completed" | "cancelled"
	priority: "low" | "medium" | "high"
	category?: string
	notes?: string
	tags: string[]
}

// src/types/task.ts
export interface Category {
	id: string
	name: string
	color: string
}
