import { Injectable } from '@angular/core';
import { TaskModel } from '../Model/Task';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
    private storagekey = 'TaskData';

    getAllTasks() : TaskModel[] {
        const data = localStorage.getItem(this.storagekey);
        return data ? JSON.parse(data) : [];
    }

    saveTasks(taskList: TaskModel[]) {
        localStorage.setItem(this.storagekey, JSON.stringify(taskList));
    }

    addTask(task: TaskModel) {
        const tasks = this.getAllTasks();
        task.Id = tasks.length + 1;
        task.createdAt = new Date();
        tasks.unshift(task);
        this.saveTasks(tasks);
    }

    updateTask(updatedTask: TaskModel) {
        const tasks = this.getAllTasks();
        const index = tasks.findIndex(t => t.Id === updatedTask.Id);
        if (index !== -1) tasks[index] = updatedTask;
        this.saveTasks(tasks);
    }

    deleteTask(id: number) {
    const tasks = this.getAllTasks();
    const index = tasks.findIndex(t => t.Id === id);
    if (index !== -1) tasks.splice(index, 1);
    tasks.forEach((t, i) => t.Id = i + 1);
    this.saveTasks(tasks);
    }
}