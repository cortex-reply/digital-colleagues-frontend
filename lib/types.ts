import { Squad } from "@/payload-types";

export interface BusinessFunction {
  id: number;
  name: string;
  description?: string | null;
  waysOfWorking?: string;
  squad?: number | Squad | null;
  knowledgeBase?: KnowledgeBase;
  memberCount: number;
  projectCount: number;
  members: User[];
  messages: Message[];
}

// export interface Squad {
//   id: string;
//   name: string;
//   members: User[];
// }

export interface KnowledgeBase {
  id: string;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  businessFunctionId: string;
  taskCount: number;
  messageCount: number;
  lastUpdated: string;
  tasks: Task[];
  messages: Message[];
  events: Event[];
  comments: Comment[];
  workInstructions?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  type: "task" | "epic" | "story";
  status: "backlog" | "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee?: string;
  dueDate?: string;
  epicId?: string;
  projectId: string;
  isBlocked: boolean;
  blockedBy?: string;
  blockedByTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isAI: boolean;
  skills?: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
}

export interface Event {
  id: string;
  description: string;
  timestamp: string;
  user: User;
  taskId: string;
}

export interface Comment {
  id: string;
  content: string;
  timestamp: string;
  user: User;
  taskId: string;
  taskTitle: string;
}
