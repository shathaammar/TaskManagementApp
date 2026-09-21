import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./Components/task-list/task-list.component').then(m => m.TaskListComponent)
    },
    {
        path: 'tasks',
        loadComponent: () => import('./Components/task-list/task-list.component').then(m => m.TaskListComponent)
    },
    {
        path: 'tasks/new',
        loadComponent: () => import('./Components/task-form/task-form.component').then(m => m.TaskFormComponent)
    },
    {
        path: 'tasks/edit/:id',
        loadComponent: () => import('./Components/task-form/task-form.component').then(m => m.TaskFormComponent)
    },
    {
        path: 'tasks/:id',
        loadComponent: () => import('./Components/task-details/task-details.component')
        .then(m => m.TaskDetailsComponent)
    }
];
