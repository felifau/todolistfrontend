export interface Task {
  id: number;
  title: string;
  details: string;
  deadline: Date;
  completed: boolean;
}

export interface ListOfTasks {
  id: number;
  name: string;
}