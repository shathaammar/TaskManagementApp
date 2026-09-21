import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TaskModel } from '../../Model/Task';
import { TaskService } from '../../Services/TaskService';
import { LanguageService } from '../../Services/language.service';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  taskList: TaskModel[] = [];
  searchTitle = '';
  selectedStatus = '';
  selectedPriority = '';

  constructor(
    private router: Router,
    private taskService: TaskService,
    private translate: TranslateService,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskList = this.taskService.getAllTasks();
  }

  addTask() {
    this.router.navigate(['/tasks/new']);
  }

  onEdit(task: TaskModel) {
    this.router.navigate(['/tasks/edit', task.Id]);
  }

  onView(task: TaskModel) {
    this.router.navigate(['/tasks', task.Id]);
  }

  onDelete(id: number) {
    const confirmDelete = confirm(this.translate.instant('TASK_LIST.CONFIRM_DELETE'));
    if (confirmDelete) {
      this.taskService.deleteTask(id);
      this.loadTasks();
    }
  }

  get filteredTasks() {
    return this.taskList.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesStatus = !this.selectedStatus || task.status === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || task.priority === this.selectedPriority;
      return matchesTitle && matchesStatus && matchesPriority;
    });
  }
}