import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { INITIAL_TASK_STATUS, TaskModel } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly storageKey = 'TaskData';
  private readonly idCounterKey = 'TaskIdCounter';
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    // localStorage doesn't exist during server-side rendering / prerendering,
    // so every storage access is guarded behind this check.
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getAllTasks(): TaskModel[] {
    if (!this.isBrowser) {
      return [];
    }

    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Could not read tasks from local storage:', error);
      return [];
    }
  }

  addTask(task: TaskModel): void {
    const tasks = this.getAllTasks();
    task.id = this.getNextId();
    // A new task always starts at the initial status, regardless of what
    // the caller passed in - enforced here, not just in the form.
    task.status = INITIAL_TASK_STATUS;
    task.createdAt = new Date();
    tasks.unshift(task);
    this.saveTasks(tasks);
  }

  updateTask(updatedTask: TaskModel): void {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index === -1) {
      return;
    }
    tasks[index] = updatedTask;
    this.saveTasks(tasks);
  }

  deleteTask(id: number): void {
    // Tasks keep their id after a delete - no more renumbering the whole list.
    const tasks = this.getAllTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  private saveTasks(tasks: TaskModel[]): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Could not save tasks to local storage:', error);
    }
  }

  /** Returns an ever-increasing id, stable across deletes, backed by its own storage key. */
  private getNextId(): number {
    if (!this.isBrowser) {
      return 0;
    }

    try {
      const stored = Number(localStorage.getItem(this.idCounterKey));
      const nextId = Number.isInteger(stored) && stored > 0
        ? stored
        : this.getAllTasks().reduce((max, t) => Math.max(max, t.id), 0) + 1;

      localStorage.setItem(this.idCounterKey, String(nextId + 1));
      return nextId;
    } catch (error) {
      console.error('Could not generate a task id:', error);
      return Date.now();
    }
  }
}
