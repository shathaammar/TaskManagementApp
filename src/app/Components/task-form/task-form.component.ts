import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskModel } from '../../Model/Task';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../Services/TaskService';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  isEditMode: boolean = false;
  TaskForm: FormGroup = new FormGroup({});
  taskList: TaskModel[] = [];

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private taskService: TaskService) {
    this.createForm();
    this.taskList = this.taskService.getAllTasks();
    
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam) {
      const taskId = +idParam; 
      const taskToEdit = this.taskList.find(t => t.Id === taskId);
      if(taskToEdit) {
        this.isEditMode = true;
        this.TaskForm.setValue({
          Id: taskToEdit.Id,
          title: taskToEdit.title,
          description: taskToEdit.description,
          status: taskToEdit.status,
          priority: taskToEdit.priority,
          dueDate: taskToEdit.dueDate,
          createdAt: taskToEdit.createdAt
        });
      }
    }
  }

  createForm() {
    this.TaskForm = new FormGroup({
      Id: new FormControl(0),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      status: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required),
      dueDate: new FormControl(''),
      createdAt: new FormControl(new Date())
    });
  }

  onSave() {
  const taskValue: TaskModel = this.TaskForm.value;

  if(this.isEditMode) {
    this.taskService.updateTask(taskValue);
    this.isEditMode = false;
  } else {
    this.taskService.addTask(taskValue);
  }

  this.TaskForm.reset({
    Id: 0,
    createdAt: new Date()
  });

  this.router.navigate(['/tasks']);
}

  onCancel() {
    this.router.navigate(['/tasks']);
  }
}