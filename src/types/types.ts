export interface Task {
  id: number;
  title: string;
  details: string;
  deadline: Date;
  completed: boolean;
  marked: boolean;
  listOfTasks: ListOfTasks;
}

export interface ListOfTasks {
  id: number;
  title: string;
}

export interface NewTask {
  title: string;
  details: string;
  deadline: Date;
  completed: boolean;
  marked: boolean;
  listOfTasks: ListOfTasks;
}