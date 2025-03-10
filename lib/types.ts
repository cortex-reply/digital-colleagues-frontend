export interface BusinessFunction {
  id: string
  name: string
  description: string
  memberCount: number
  projectCount: number
  members: User[]
  messages: Message[]
}

export interface Project {
  id: string
  name: string
  description: string
  businessFunctionId: string
  taskCount: number
  messageCount: number
  lastUpdated: string
  tasks: Task[]
  messages: Message[]
  events: Event[]
  comments: Comment[]
}

export interface Task {
  id: string
  title: string
  description: string
  type: "task" | "epic" | "story"
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  assignee?: string
  dueDate?: string
  epicId?: string
  projectId: string
}

export interface User {
  id: string
  name: string
  avatar: string
  role: string
  isAI: boolean
  skills?: string[]
}

export interface Message {
  id: string
  content: string
  sender: User
  timestamp: string
}

export interface Event {
  id: string
  description: string
  timestamp: string
  user: User
  taskId: string
}

export interface Comment {
  id: string
  content: string
  timestamp: string
  user: User
  taskId: string
  taskTitle: string
}

