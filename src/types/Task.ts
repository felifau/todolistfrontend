// global id for tasks
let taskId = 1;

export class Task {
  id: number;
  title: string;
  deadline: string;
  completed: boolean;

  constructor(title: string, deadline: string) {
    this.id = taskId++;
    this.title = title;
    this.deadline = deadline;
    this.completed = false;
  }
}