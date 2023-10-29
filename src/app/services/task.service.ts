import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  [x: string]: any;
  id?: number;
  description: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any[]>('http://localhost:3000/users');
  }

  deleteTask(taskId:number){
    return this.http.delete(`http://localhost:3000/tasks/${taskId}`);
  }

  updateTask(taskId: number, task: Task){
    return this.http.put<any[]>(`http://localhost:3000/tasks/${taskId}`, task);
  }
}
