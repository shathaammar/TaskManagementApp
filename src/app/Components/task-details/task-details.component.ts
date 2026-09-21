import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskModel } from '../../Model/Task';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../Services/TaskService';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent {
  task!: TaskModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {

    const idParam = this.route.snapshot.paramMap.get('id');

    if(idParam){
      const taskId = +idParam;
      const tasks = this.taskService.getAllTasks();
      const foundTask = tasks.find(t => t.Id === taskId);

      if(foundTask){
        this.task = foundTask;
      }
    }
  }

  goBack(){
    this.router.navigate(['/tasks']);
  }
}
