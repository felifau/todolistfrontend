// global id for tasks
let taskId = 1;
// src/types/Task.ts

export interface Task {
  id: number;
  title: string;
  details: string;
  deadline: string;
  completed: boolean;
}

export class Task {
  id: number;
  title: string;
  deadline: string;
  details: string;
  completed: boolean;

  constructor(title: string, deadline: string, details: string) {
    this.id = taskId++;
    this.title = title;
    this.details = details;
    this.deadline = deadline;
    this.completed = false;
  }
}