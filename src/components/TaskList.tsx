import { useState, useMemo } from "react"
import { Play, Pause, Square, Trash2, AlertCircle, CheckCircle, Clock, Ban, Search, Filter } from "lucide-react"
import { Task } from "../types/task"
import { Collapse } from "./Collapse"

interface TaskListProps {
	tasks: Task[]
	onStartTask: (id: string) => void
	onEndTask: (id: string) => void
	onDeleteTask: (id: string) => void
}

export function TaskList({ tasks, onStartTask, onEndTask, onDeleteTask }: TaskListProps) {
	const [filters, setFilters] = useState({
		search: "",
		priority: "" as Task["priority"] | "",
		category: "",
		status: "" as Task["status"] | "",
		tags: [] as string[]
	})

	// Get unique categories and tags for filter options
	const categories = useMemo(() => 
		Array.from(new Set(tasks.map(task => task.category).filter(Boolean))),
		[tasks]
	)
	
	const allTags = useMemo(() => 
		Array.from(new Set(tasks.flatMap(task => task.tags))),
		[tasks]
	)

	const filteredTasks = useMemo(() => {
		return tasks.filter(task => {
			const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
								task.notes?.toLowerCase().includes(filters.search.toLowerCase()) ||
								task.category?.toLowerCase().includes(filters.search.toLowerCase())
			
			const matchesPriority = !filters.priority || task.priority === filters.priority
			const matchesCategory = !filters.category || task.category === filters.category
			const matchesStatus = !filters.status || task.status === filters.status
			const matchesTags = filters.tags.length === 0 || 
								filters.tags.every(tag => task.tags.includes(tag))

			return matchesSearch && matchesPriority && matchesCategory && 
				   matchesStatus && matchesTags
		})
	}, [tasks, filters])

	const formatDuration = (duration: number) => {
		const days = Math.floor(duration / (24 * 3600))
		const hours = Math.floor((duration % (24 * 3600)) / 3600)
		const minutes = Math.floor((duration % 3600) / 60)
		const seconds = Math.floor(duration % 60)

		const parts = []

		if (days > 0) parts.push(`${days}d`)
		if (hours > 0) parts.push(`${hours}h`)
		if (minutes > 0) parts.push(`${minutes}m`)
		if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

		return parts.join(' ')
	}

	const getStatusColor = (status: Task["status"]) => {
		const colors = {
			pending: "text-yellow-400",
			active: "text-green-400",
			paused: "text-orange-400",
			completed: "text-blue-400",
			cancelled: "text-red-400",
		}
		return colors[status]
	}

	const getStatusIcon = (status: Task["status"]) => {
		const icons = {
			pending: <Clock className="w-5 h-5" />,
			active: <Play className="w-5 h-5" />,
			paused: <Pause className="w-5 h-5" />,
			completed: <CheckCircle className="w-5 h-5" />,
			cancelled: <Ban className="w-5 h-5" />,
		}
		return icons[status]
	}

	const getPriorityColor = (priority: Task["priority"]) => {
		const colors = {
			low: "bg-blue-400/10 text-blue-400",
			medium: "bg-yellow-400/10 text-yellow-400",
			high: "bg-red-400/10 text-red-400",
		}
		return colors[priority]
	}

	const getCompletionStatus = (task: Task) => {
		if (!task.estimatedDuration || !task.duration) return null
		
		const actualMinutes = Math.ceil(task.duration / 60)
		const percentage = Math.round((task.estimatedDuration / actualMinutes) * 100)
		
		let statusColor = "text-green-400"
		if (percentage < 80) statusColor = "text-red-400"
		else if (percentage < 100) statusColor = "text-yellow-400"
		
		return (
			<div className="flex items-center gap-2 text-sm">
				<span className="text-gray-400">Efficiency:</span>
				<span className={statusColor}>
					{percentage}% efficiency
					({formatDuration(task.duration)} / {task.estimatedDuration}min)
				</span>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			<Collapse title="Filters" defaultOpen={false}>
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="relative">
							<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search tasks..."
								value={filters.search}
								onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
								className="pl-10 w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<select
							value={filters.priority}
							onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value as Task["priority"] | "" }))}
							className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Priorities</option>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
						</select>

						<select
							value={filters.category}
							onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
							className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Categories</option>
							{categories.map(cat => (
								<option key={cat} value={cat}>{cat}</option>
							))}
						</select>

						<select
							value={filters.status}
							onChange={(e) => setFilters(f => ({ ...f, status: e.target.value as Task["status"] | "" }))}
							className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Statuses</option>
							<option value="pending">Pending</option>
							<option value="active">Active</option>
							<option value="paused">Paused</option>
							<option value="completed">Completed</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>

					<div className="flex flex-wrap gap-2">
						{allTags.map(tag => (
							<button
								key={tag}
								onClick={() => setFilters(f => ({
									...f,
									tags: f.tags.includes(tag) 
										? f.tags.filter(t => t !== tag)
										: [...f.tags, tag]
								}))}
								className={`px-3 py-1 rounded-full text-sm ${
									filters.tags.includes(tag)
										? 'bg-blue-500 text-white'
										: 'bg-gray-700 text-gray-300 hover:bg-gray-600'
								}`}
							>
								{tag}
							</button>
						))}
					</div>
				</div>
			</Collapse>

			{/* Tasks */}
			{filteredTasks.map((task) => (
				<div
					key={task.id}
					className="p-6 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors"
				>
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 space-y-3">
							<div className="flex items-center gap-3">
								<h3 className="text-lg font-semibold text-white">{task.title}</h3>
								<span
									className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
										task.priority
									)}`}
								>
									{task.priority}
								</span>
							</div>

							<div className="flex items-center gap-6 text-sm text-gray-400">
								<div className="flex items-center gap-2">
									<Clock size={16} />
									<span>{new Date(task.date).toLocaleDateString()}</span>
								</div>

								{task.duration !== undefined && (
									<div className="flex items-center gap-2">
										<AlertCircle size={16} />
										<span>{formatDuration(task.duration)}</span>
									</div>
								)}

								<div className={`flex items-center gap-2 ${getStatusColor(task.status)}`}>
									{getStatusIcon(task.status)}
									<span className="capitalize">{task.status}</span>
								</div>
							</div>

							{task.category && (
								<div className="text-sm text-gray-400">
									Category: <span className="text-gray-300">{task.category}</span>
								</div>
							)}

							{task.notes && <p className="text-sm text-gray-400 mt-2">{task.notes}</p>}

							{task.status === "completed" && getCompletionStatus(task)}
						</div>

						<div className="flex items-center gap-2">
							{task.status === "pending" && (
								<button
									onClick={() => onStartTask(task.id)}
									className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
									title="Start Task"
								>
									<Play size={20} />
								</button>
							)}
							{task.status === "active" && (
								<button
									onClick={() => onEndTask(task.id)}
									className="p-2 text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
									title="End Task"
								>
									<Square size={20} />
								</button>
							)}
							<button
								onClick={() => onDeleteTask(task.id)}
								className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
								title="Delete Task"
							>
								<Trash2 size={20} />
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
