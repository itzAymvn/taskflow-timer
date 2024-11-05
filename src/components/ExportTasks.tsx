import { FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { Task } from "../types/task"

interface ExportTasksProps {
	tasks: Task[]
}

export function ExportTasks({ tasks }: ExportTasksProps) {
	const sanitizedTasks = tasks.map((task) => ({
		...task,
		tags: task.tags || [],
	}))

	const exportToJson = () => {
		const dataStr = JSON.stringify(sanitizedTasks, null, 2)
		downloadFile(dataStr, "tasks.json", "application/json")
	}

	const exportToCsv = () => {
		const headers = [
			"Title",
			"Date",
			"Status",
			"Priority",
			"Category",
			"Tags",
			"Estimated Duration",
			"Actual Duration",
			"Notes",
		]

		const rows = sanitizedTasks.map((task) => [
			task.title,
			task.date,
			task.status,
			task.priority,
			task.category || "",
			(task.tags || []).join(", "),
			task.estimatedDuration?.toString() || "",
			task.duration ? Math.ceil(task.duration / 60).toString() : "",
			task.notes?.replace(/\n/g, " ") || "",
		])

		const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
			"\n"
		)

		downloadFile(csvContent, "tasks.csv", "text/csv")
	}

	const exportToText = () => {
		const content = sanitizedTasks
			.map((task) => {
				const duration = task.duration ? Math.ceil(task.duration / 60) : null
				const efficiency =
					task.duration && task.estimatedDuration
						? Math.round((task.estimatedDuration / Math.ceil(task.duration / 60)) * 100)
						: null

				return [
					`Title: ${task.title}`,
					`Date: ${task.date}`,
					`Status: ${task.status}`,
					`Priority: ${task.priority}`,
					task.category && `Category: ${task.category}`,
					(task.tags || []).length > 0 && `Tags: ${task.tags.join(", ")}`,
					task.estimatedDuration && `Estimated Duration: ${task.estimatedDuration} minutes`,
					duration && `Actual Duration: ${duration} minutes`,
					efficiency && `Efficiency: ${efficiency}%`,
					task.notes && `Notes: ${task.notes}`,
					"----------------------------------------",
				]
					.filter(Boolean)
					.join("\n")
			})
			.join("\n\n")

		downloadFile(content, "tasks.txt", "text/plain")
	}

	const downloadFile = (content: string, fileName: string, contentType: string) => {
		const blob = new Blob([content], { type: contentType })
		const url = URL.createObjectURL(blob)
		const link = document.createElement("a")
		link.href = url
		link.download = fileName
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	return (
		<div className="flex flex-wrap gap-2">
			<button
				onClick={exportToJson}
				className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
				title="Export as JSON"
			>
				<FileJson size={20} />
				<span className="sm:inline">JSON</span>
			</button>
			<button
				onClick={exportToCsv}
				className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
				title="Export as CSV (Excel)"
			>
				<FileSpreadsheet size={20} />
				<span className="sm:inline">CSV</span>
			</button>
			<button
				onClick={exportToText}
				className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
				title="Export as Text"
			>
				<FileText size={20} />
				<span className="sm:inline">Text</span>
			</button>
		</div>
	)
}
