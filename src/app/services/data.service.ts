import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../models/todo';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TodoDataService {
  private readonly API_URL = 'https://api.github.com/repos/angular/angular/issues';

  dataChange: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private httpClient: HttpClient) { }

  get data(): Todo[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllTodosList(): void {
    this.httpClient.get<Todo[]>(this.API_URL).subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  updateTodo(todo: Todo): void {
    this.dialogData = todo;
  }

  deleteTodo(id: number): void {
    console.log(id);
  }
}

