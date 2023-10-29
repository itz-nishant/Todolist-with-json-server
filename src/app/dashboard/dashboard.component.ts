import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface Task {
  id: number;
  description: string;
  completed: boolean;
  userId: number;
  
  
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DialogService]
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  taskInput: string = '';
  addButtonLabel: string = 'Add Task';
  userFirstName!: string;
  editDialogVisible: boolean = false;
  editedTaskDescription: string = '';
  selectedTask: Task | null = null;
  userId: number = 0; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userFirstName = currentUser.firstName;
      this.userId = currentUser.id;
    }
    this.showTasks();
  }
  showTasks() {
    this.http.get<Task[]>(`http://localhost:3000/tasks?userId=${this.userId}`).subscribe(
      (response: Task[]) => {
        this.tasks = response;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  addTask() {
    if (this.taskInput.trim()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const newTask: Task = {
          userId: currentUser.id,
          id: 0,
          description: this.taskInput,
          completed: false
        };
        this.http.post('http://localhost:3000/tasks', newTask).subscribe(
          (response: any) => {
            newTask.id = response.id;
            this.tasks.push(newTask);
            console.log('Data added successfully:', response);
          },
          (error: HttpErrorResponse) => {
            console.error('Error adding data:', error);
          }
        );
      }
      this.clearInput();
    }
  }

  deleteTask(task: Task) {
    const taskIndex = this.tasks.indexOf(task);
    if (taskIndex !== -1) {
      this.tasks.splice(taskIndex, 1);
      this.http.delete(`http://localhost:3000/tasks/${task.id}`).subscribe(
        () => {
          console.log('Data deleted successfully');
        },
        (error: HttpErrorResponse) => {
          console.error('Error deleting data:', error);
        }
      );
      this.clearInput();
    }
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
    this.http.put(`http://localhost:3000/tasks/${task.id}`, task).subscribe(
      (response: any) => {
        console.log('Task completion updated successfully:', response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating task completion:', error);
      }
    );
  }

  isTaskCompleted(task: Task): boolean {
    return task.completed;
  }

  clearInput() {
    this.taskInput = '';
    this.addButtonLabel = 'Add Task';
  }

  showEditDialog(task: Task) {
    this.selectedTask = task;
    this.editedTaskDescription = task.description;
    this.editDialogVisible = true;
  }

  updateTask(task: Task | null) {
    if (task !== null && this.editedTaskDescription.trim()) {
      task.description = this.editedTaskDescription;
      this.http.put(`http://localhost:3000/tasks/${task.id}`, task).subscribe(
        (response: any) => {
          this.showTasks();
          console.log('Task updated successfully:', response);
        },
        (error: HttpErrorResponse) => {
          console.error('Error updating task:', error);
        }
      );
      this.clearInput();
      this.editDialogVisible = false;
    }
  }
}
