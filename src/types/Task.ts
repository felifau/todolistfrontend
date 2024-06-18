// global id for tasks
let taskId = 1;
// src/types/Task.ts

export interface Task {
  id: number;
  title: string;
  details: string;
  deadline: Date;
  completed: boolean;
}

export class Task {
  id: number;
  title: string;
  deadline: Date;
  details: string;
  completed: boolean;

  constructor(title: string, deadline: Date, details: string) {
    this.id = taskId++;
    this.title = title;
    this.details = details;
    this.deadline = deadline;
    this.completed = false;
  }
}