import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TASK_PRIORITIES, TASK_STATUSES, TaskModel, toTranslateSuffix } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { LanguageService } from '../../services/language.service';
import { TaskBadgeComponent } from '../task-badge/task-badge.component';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, TaskBadgeComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  taskList: TaskModel[] = [];
  searchTitle = '';
  selectedStatus = '';
  selectedPriority = '';

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  readonly toTranslateSuffix = toTranslateSuffix;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private translate: TranslateService,
    public languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskList = this.taskService.getAllTasks();
  }

  addTask(): void {
    this.router.navigate(['/tasks/new']);
  }

  onEdit(task: TaskModel): void {
    this.router.navigate(['/tasks/edit', task.id]);
  }

  onView(task: TaskModel): void {
    this.router.navigate(['/tasks', task.id]);
  }

  onDelete(id: number): void {
    const confirmDelete = confirm(this.translate.instant('TASK_LIST.CONFIRM_DELETE'));
    if (confirmDelete) {
      this.taskService.deleteTask(id);
      this.loadTasks();
    }
  }

  get filteredTasks(): TaskModel[] {
    return this.taskList.filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(this.searchTitle.toLowerCase());
      const matchesStatus = !this.selectedStatus || task.status === this.selectedStatus;
      const matchesPriority = !this.selectedPriority || task.priority === this.selectedPriority;
      return matchesTitle && matchesStatus && matchesPriority;
    });
  }
}
