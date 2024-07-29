export enum TaskStatus {
    TO_DO = "TO_DO",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
    DONE_AFTER_DEADLINE = "DONE_AFTER_DEADLINE",
    CANCELLED = "CANCELLED"
}

export const taskStatusFriendlyName: { [key in TaskStatus]: string } = {
    [TaskStatus.TO_DO]: "To do",
    [TaskStatus.IN_PROGRESS]: "In progress",
    [TaskStatus.DONE]: "Done",
    [TaskStatus.DONE_AFTER_DEADLINE]: "Done after deadline",
    [TaskStatus.CANCELLED]: "Cancelled"
};

export const taskStatusColor: { [key in TaskStatus]: string } = {
    [TaskStatus.TO_DO]: "bg-secondary text-dark",
    [TaskStatus.IN_PROGRESS]: "bg-blue-400 text-white",
    [TaskStatus.DONE]: "bg-primary text-white",
    [TaskStatus.DONE_AFTER_DEADLINE]: "bg-red-500 text-white",
    [TaskStatus.CANCELLED]: "bg-yellow-500 text-white"
};

export enum TaskTag {
    SCHOOL = "SCHOOL",
    JOB = "JOB",
    FREE_TIME = "FREE_TIME",
    CLEANING = "CLEANING",
    GROCERY = "GROCERY"
}

export const taskTagFriendlyNames: { [key in TaskTag]: string } = {
    [TaskTag.SCHOOL]: "School Work",
    [TaskTag.JOB]: "Job Related",
    [TaskTag.FREE_TIME]: "Free Time Activities",
    [TaskTag.CLEANING]: "Cleaning Tasks",
    [TaskTag.GROCERY]: "Grocery Shopping"
};

export const taskTagColor: { [key in TaskTag]: string } = {
    [TaskTag.SCHOOL]: "bg-yellow-300 text-dark",
    [TaskTag.JOB]: "bg-red-300 text-dark",
    [TaskTag.FREE_TIME]: "bg-blue-300 text-dark",
    [TaskTag.CLEANING]: "bg-purple-300 text-dark",
    [TaskTag.GROCERY]: "bg-primary text-white"
};

// Define the shape of the data
export type Task = {
    id: number;
    username: string;
    title: string;
    description: string;
    tags: TaskTag[];
    status: TaskStatus;
    deadline: string;
    createdAt: string;
    updatedAt: string;
};