import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent)
    },
    {
        path: 'tasks',
        loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent)
    },
    {
        path: 'tasks/new',
        loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent)
    },
    {
        path: 'tasks/edit/:id',
        loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent)
    },
    {
        path: 'tasks/:id',
        loadComponent: () => import('./components/task-details/task-details.component')
        .then(m => m.TaskDetailsComponent)
    },
    {
        // Any unmatched URL (typo, stale bookmark) lands back on the task list
        // instead of rendering a blank page under the header.
        path: '**',
        redirectTo: 'tasks'
    }
];
