import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  task = '';
  taskList: { id: number; task: string }[] = [];

  private http = inject(HttpClient); // ✅ Inject HttpClient

  constructor() {
    this.fetchTasks(); // ✅ Fetch tasks on component load
  }

  fetchTasks() {
    this.http.get<{ id: number; title: string }[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .subscribe(
        (data) => {
          console.log('API Response:', data); // ✅ Log the response
          this.taskList = data.map(task => ({ id: task.id, task: task.title })); // ✅ Map `title` to `task`
        },
        (error) => console.error('Error fetching tasks:', error)
      );
  }
  
  

  addTask() {
    if (!this.task.trim()) return;
    const newTask = { id: this.taskList.length + 1, title: this.task.trim() };
  
    this.http.post('https://jsonplaceholder.typicode.com/todos', newTask)
      .subscribe(
        (response: any) => {
          this.taskList.push({ id: response.id, task: response.title });
          this.task = '';
        },
        (error) => console.error('Error adding task:', error)
      );
  }
  

  deleteTask(taskId: number) {
    this.http.delete(`https://jsonplaceholder.typicode.com/todos/${taskId}`)
      .subscribe(
        () => (this.taskList = this.taskList.filter((task) => task.id !== taskId)),
        (error) => console.error('Error deleting task:', error)
      );
  }

  trackByTask(index: number, task: { id: number; task: string }) {
    return task.id;
  }
}

