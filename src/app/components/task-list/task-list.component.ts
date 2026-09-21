import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TASK_PRIORITIES, TASK_STATUSES, TaskModel, toTranslateSuffix } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
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

  taskPendingDelete: TaskModel | null = null;

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  readonly toTranslateSuffix = toTranslateSuffix;

  @ViewChild('dialogCancelButton') dialogCancelButton?: ElementRef<HTMLButtonElement>;

  /** The Delete button that opened the dialog, so focus can return to it on close. */
  private deleteTriggerElement: HTMLElement | null = null;

  constructor(
    private router: Router,
    private taskService: TaskService
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

  requestDelete(task: TaskModel, event: MouseEvent): void {
    this.deleteTriggerElement = event.currentTarget as HTMLElement;
    this.taskPendingDelete = task;
    // The dialog only exists in the DOM once *ngIf renders it after this change is detected.
    setTimeout(() => this.dialogCancelButton?.nativeElement.focus());
  }

  confirmDelete(): void {
    if (!this.taskPendingDelete) {
      return;
    }
    this.taskService.deleteTask(this.taskPendingDelete.id);
    this.taskPendingDelete = null;
    this.loadTasks();
    this.restoreFocusToTrigger();
  }

  cancelDelete(): void {
    this.taskPendingDelete = null;
    this.restoreFocusToTrigger();
  }

  private restoreFocusToTrigger(): void {
    this.deleteTriggerElement?.focus();
    this.deleteTriggerElement = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.taskPendingDelete) {
      this.cancelDelete();
    }
  }

  clearFilters(): void {
    this.searchTitle = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
  }

  get hasActiveFilters(): boolean {
    return !!(this.searchTitle || this.selectedStatus || this.selectedPriority);
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
