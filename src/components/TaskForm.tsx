import React, { useState } from "react"
import { PlusCircle, X } from "lucide-react"
import { Task } from "../types/task"

interface TaskFormProps {
	onAddTask: (task: Omit<Task, "id" | "status">) => void
}

export function TaskForm({ onAddTask }: TaskFormProps) {
	const [title, setTitle] = useState("")
	const [date, setDate] = useState(new Date().toISOString().split("T")[0])
	const [priority, setPriority] = useState<Task["priority"]>("medium")
	const [category, setCategory] = useState("")
	const [notes, setNotes] = useState("")
	const [estimatedDuration, setEstimatedDuration] = useState("")
	const [tagInput, setTagInput] = useState("")
	const [tags, setTags] = useState<string[]>([])

	const handleAddTag = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && tagInput.trim()) {
			e.preventDefault()
			const newTag = tagInput.trim().toLowerCase()
			if (!tags.includes(newTag)) {
				setTags([...tags, newTag])
			}
			setTagInput("")
		}
	}

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter(tag => tag !== tagToRemove))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!title.trim() || !date) return

		onAddTask({
			title: title.trim(),
			date,
			priority,
			category: category.trim() || undefined,
			notes: notes.trim() || undefined,
			estimatedDuration: estimatedDuration ? parseInt(estimatedDuration) : undefined,
			tags
		})

		setTitle("")
		setDate(new Date().toISOString().split("T")[0])
		setPriority("medium")
		setCategory("")
		setNotes("")
		setEstimatedDuration("")
		setTags([])
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Task title"
					className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<input
					type="date"
					value={date}
					onChange={(e) => setDate(e.target.value)}
					className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					required
				/>
				<select
					value={priority}
					onChange={(e) => setPriority(e.target.value as Task["priority"])}
					className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="low">Low Priority</option>
					<option value="medium">Medium Priority</option>
					<option value="high">High Priority</option>
				</select>
				<input
					type="text"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					placeholder="Category (optional)"
					className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="number"
					value={estimatedDuration}
					onChange={(e) => setEstimatedDuration(e.target.value)}
					placeholder="Estimated duration (minutes)"
					className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<div className="col-span-full">
					<div className="flex flex-wrap gap-2 mb-2">
						{tags.map(tag => (
							<span 
								key={tag} 
								className="px-2 py-1 rounded-full bg-gray-700 text-sm flex items-center gap-1"
							>
								{tag}
								<button
									type="button"
									onClick={() => removeTag(tag)}
									className="hover:text-red-400"
								>
									<X size={14} />
								</button>
							</span>
						))}
					</div>
					<input
						type="text"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={handleAddTag}
						placeholder="Add tags (press Enter)"
						className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
			<textarea
				value={notes}
				onChange={(e) => setNotes(e.target.value)}
				placeholder="Additional notes (optional)"
				className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
			/>
			<div className="flex justify-end">
				<button
					type="submit"
					className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
				>
					<PlusCircle size={20} />
					Add Task
				</button>
			</div>
		</form>
	)
}
