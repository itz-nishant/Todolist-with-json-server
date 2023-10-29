import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

interface User {
  email: string;
  password: string;

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private taskService: TaskService,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.taskService.getUsers().subscribe(
        (users: User[]) => {
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            console.log('Login successful:', user);
            this.authService.login(user);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login successful!' });
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Invalid credentials', user);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials' });
          }
        },
        (error) => {  
          console.error('Login failed:', error);
        }
      );
    }
  }
}
