import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskModel } from '../../models/task.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TranslateModule } from '@ngx-translate/core';
import { TaskBadgeComponent } from '../task-badge/task-badge.component';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, TranslateModule, TaskBadgeComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  task?: TaskModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const taskId = Number(idParam);
      this.task = this.taskService.getAllTasks().find(t => t.id === taskId);
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }
}
