import type {
  BusinessFunction,
  Project,
  Task,
  User,
  Message,
  Event,
} from "./types";
import type { Comment } from "./types";

// Sample users
export const users: User[] = [
  {
    id: "user1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Manager",
    isAI: false,
    skills: ["Strategy", "Leadership"],
  },
  {
    id: "user2",
    name: "Jane Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Developer",
    isAI: false,
    skills: ["React", "TypeScript"],
  },
  {
    id: "ai1",
    name: "AI Assistant",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "AI Helper",
    isAI: true,
    skills: ["Research", "Documentation"],
  },
  {
    id: "user3",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Designer",
    isAI: false,
    skills: ["UI/UX", "Figma"],
  },
  {
    id: "ai2",
    name: "Code Bot",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "AI Developer",
    isAI: true,
    skills: ["Code Generation", "Debugging"],
  },
];

// Sample messages
const sampleMessages: Message[] = [
  {
    id: "msg1",
    content: "Hey team, let's discuss the new project requirements.",
    sender: users[0],
    timestamp: "2023-06-15T10:30:00Z",
  },
  {
    id: "msg2",
    content: "I've prepared some initial designs for review.",
    sender: users[2],
    timestamp: "2023-06-15T10:35:00Z",
  },
  {
    id: "msg3",
    content:
      "Based on the requirements, I suggest we use Next.js for this project.",
    sender: users[4],
    timestamp: "2023-06-15T10:40:00Z",
  },
];

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: "task1",
    title: "Design User Interface",
    description: "Create wireframes and mockups for the main dashboard",
    type: "task",
    status: "done",
    priority: "high",
    assignee: "Alex Johnson",
    dueDate: "2023-06-10",
    projectId: "project1",
  },
  {
    id: "task2",
    title: "Implement Authentication",
    description: "Set up user authentication with OAuth",
    type: "task",
    status: "in-progress",
    priority: "high",
    assignee: "Jane Smith",
    dueDate: "2023-06-20",
    epicId: "task7",
    projectId: "project1",
    isBlocked: true,
    blockedBy: "task11",
    blockedByTitle: "Research OAuth Providers",
  },
  {
    id: "task3",
    title: "Create API Documentation",
    description: "Document all API endpoints and parameters",
    type: "task",
    status: "todo",
    priority: "medium",
    assignee: "AI Assistant",
    dueDate: "2023-06-25",
    projectId: "project1",
  },
  {
    id: "task4",
    title: "Performance Testing",
    description: "Run performance tests and optimize bottlenecks",
    type: "task",
    status: "todo",
    priority: "medium",
    dueDate: "2023-06-30",
    projectId: "project1",
  },
  {
    id: "task5",
    title: "Mobile Responsiveness",
    description: "Ensure the application works well on mobile devices",
    type: "task",
    status: "review",
    priority: "high",
    assignee: "Alex Johnson",
    dueDate: "2023-06-18",
    epicId: "task8",
    projectId: "project1",
  },
  {
    id: "task6",
    title: "User Acceptance Testing",
    description: "Coordinate with stakeholders for UAT",
    type: "task",
    status: "todo",
    priority: "high",
    assignee: "John Doe",
    dueDate: "2023-07-05",
    projectId: "project1",
  },
  {
    id: "task7",
    title: "User Management Epic",
    description: "All tasks related to user management functionality",
    type: "epic",
    status: "in-progress",
    priority: "high",
    dueDate: "2023-07-10",
    projectId: "project1",
  },
  {
    id: "task8",
    title: "UI/UX Improvements",
    description: "Epic for all UI/UX related tasks",
    type: "epic",
    status: "in-progress",
    priority: "medium",
    dueDate: "2023-07-15",
    projectId: "project1",
  },
  {
    id: "task9",
    title: "As a user, I want to reset my password",
    description: "Implement password reset functionality",
    type: "story",
    status: "todo",
    priority: "medium",
    epicId: "task7",
    projectId: "project1",
  },
  {
    id: "task10",
    title: "As a user, I want to see my recent activity",
    description: "Add a recent activity section to the dashboard",
    type: "story",
    status: "todo",
    priority: "low",
    epicId: "task8",
    projectId: "project1",
  },
  {
    id: "task11",
    title: "Research OAuth Providers",
    description: "Evaluate different OAuth providers for authentication",
    type: "task",
    status: "todo",
    priority: "medium",
    assignee: "John Doe",
    dueDate: "2023-06-18",
    projectId: "project1",
    isBlocked: false,
  },
  {
    id: "task12",
    title: "Competitor Analysis",
    description: "Detailed analysis of top 5 competitors",
    type: "task",
    status: "todo",
    priority: "high",
    assignee: "AI Assistant",
    dueDate: "2023-06-28",
    projectId: "project2",
  },
];

// Sample projects
const sampleEvents: Event[] = [
  {
    id: "event1",
    description:
      "Updated the status of 'Implement Authentication' to 'In Progress'",
    timestamp: "2023-06-16T10:30:00Z",
    user: users[1],
    taskId: "task2",
  },
  {
    id: "event2",
    description: "Added a new task 'Optimize Database Queries'",
    timestamp: "2023-06-16T11:45:00Z",
    user: users[0],
    taskId: "task13",
  },
  {
    id: "event3",
    description: "Completed the 'Design User Interface' task",
    timestamp: "2023-06-16T14:20:00Z",
    user: users[2],
    taskId: "task1",
  },
];

// Sample comments
const sampleComments: Comment[] = [
  {
    id: "comment1",
    content:
      "I've started working on the authentication implementation. Will update once the basic flow is ready.",
    timestamp: "2023-06-17T09:30:00Z",
    user: users[1],
    taskId: "task2",
    taskTitle: "Implement Authentication",
  },
  {
    id: "comment2",
    content:
      "The initial wireframes for the dashboard are ready. Please review and provide feedback.",
    timestamp: "2023-06-16T14:45:00Z",
    user: users[2],
    taskId: "task1",
    taskTitle: "Design User Interface",
  },
  {
    id: "comment3",
    content:
      "I've identified some potential performance bottlenecks. We should discuss optimization strategies.",
    timestamp: "2023-06-18T11:20:00Z",
    user: users[4],
    taskId: "task4",
    taskTitle: "Performance Testing",
  },
];

export const projects: Project[] = [
  {
    id: "project1",
    name: "Website Redesign",
    description: "Redesign the company website with modern UI/UX",
    businessFunctionId: "bf1",
    taskCount: 10,
    messageCount: 24,
    lastUpdated: "2023-06-15",
    tasks: sampleTasks.filter((task) => task.projectId === "project1"),
    messages: sampleMessages,
    events: sampleEvents,
    comments: sampleComments,
  },
  {
    id: "project2",
    name: "Mobile App Development",
    description: "Develop a mobile app for iOS and Android",
    businessFunctionId: "bf1",
    taskCount: 8,
    messageCount: 16,
    lastUpdated: "2023-06-14",
    tasks: sampleTasks.filter((task) => task.projectId === "project2"),
    messages: sampleMessages,
    events: [],
    comments: [],
  },
  {
    id: "project3",
    name: "Market Research",
    description: "Research market trends and customer preferences",
    businessFunctionId: "bf2",
    taskCount: 5,
    messageCount: 10,
    lastUpdated: "2023-06-13",
    tasks: [],
    messages: [],
    events: [],
    comments: [],
  },
  {
    id: "project4",
    name: "Product Launch",
    description: "Plan and execute the launch of the new product",
    businessFunctionId: "bf2",
    taskCount: 12,
    messageCount: 30,
    lastUpdated: "2023-06-12",
    tasks: [],
    messages: [],
    events: [],
    comments: [],
  },
  {
    id: "project5",
    name: "Infrastructure Upgrade",
    description: "Upgrade the company's IT infrastructure",
    businessFunctionId: "bf3",
    taskCount: 7,
    messageCount: 15,
    lastUpdated: "2023-06-11",
    tasks: [],
    messages: [],
    events: [],
    comments: [],
  },
];

// Sample business functions
export const businessFunctions: BusinessFunction[] = [
  {
    id: "bf1",
    name: "Engineering",
    description: "Software development and technical operations",
    memberCount: 12,
    projectCount: 4,
    members: [users[1], users[2], users[4]],
    messages: sampleMessages,
  },
  {
    id: "bf2",
    name: "Marketing",
    description: "Brand management and market research",
    memberCount: 8,
    projectCount: 3,
    members: [users[0], users[3], users[4]],
    messages: [],
  },
  {
    id: "bf3",
    name: "Operations",
    description: "Business operations and infrastructure",
    memberCount: 6,
    projectCount: 2,
    members: [users[0], users[1], users[4]],
    messages: [],
  },
];

// Helper functions to get data
export function getBusinessFunctionById(
  id: string
): BusinessFunction | undefined {
  return businessFunctions.find((bf) => bf.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByBusinessFunctionId(
  businessFunctionId: string
): Project[] {
  return projects.filter(
    (project) => project.businessFunctionId === businessFunctionId
  );
}

export function getTaskById(id: string): Task | undefined {
  return sampleTasks.find((task) => task.id === id);
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id);
}
