import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface CollapseProps {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    className?: string
}

export function Collapse({ title, children, defaultOpen = false, className = "" }: CollapseProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-750 transition-colors rounded-lg"
            >
                <span className="font-semibold">{title}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && <div className="px-6 pb-6">{children}</div>}
        </div>
    )
} 