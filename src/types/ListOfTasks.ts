export class ListOfTasks {
  id: number;
  title: string;

  constructor(title: string, id?: number) {
    this.id = id !== undefined ? id : 0;
    this.title = title;
  }
}