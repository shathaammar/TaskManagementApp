import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  INITIAL_TASK_STATUS,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskModel,
  TaskStatus,
  toTranslateSuffix
} from '../../models/task.model';

/** Angular's own `required` validator accepts a whitespace-only string; this doesn't. */
function requiredNotBlank(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim().length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  isEditMode = false;
  taskForm: FormGroup = this.createForm();

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  readonly toTranslateSuffix = toTranslateSuffix;

  /** Not user-editable, so they live as plain fields instead of form controls. */
  private taskId = 0;
  private createdAt = new Date();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      return;
    }

    const taskId = Number(idParam);
    const taskToEdit = this.taskService.getAllTasks().find(t => t.id === taskId);
    if (!taskToEdit) {
      return;
    }

    this.isEditMode = true;
    this.taskId = taskToEdit.id;
    this.createdAt = taskToEdit.createdAt;
    this.taskForm.setValue({
      title: taskToEdit.title,
      description: taskToEdit.description,
      status: taskToEdit.status,
      priority: taskToEdit.priority,
      dueDate: taskToEdit.dueDate
    });
  }

  get title(): AbstractControl | null {
    return this.taskForm.get('title');
  }

  get priority(): AbstractControl | null {
    return this.taskForm.get('priority');
  }

  get status(): AbstractControl | null {
    return this.taskForm.get('status');
  }

  get description(): AbstractControl | null {
    return this.taskForm.get('description');
  }

  setStatus(status: TaskStatus): void {
    this.status?.setValue(status);
    this.status?.markAsDirty();
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.value;
    const task: TaskModel = {
      id: this.taskId,
      title: (formValue.title as string).trim(),
      description: (formValue.description as string ?? '').trim(),
      status: this.isEditMode ? formValue.status : INITIAL_TASK_STATUS,
      priority: formValue.priority,
      dueDate: formValue.dueDate ?? '',
      createdAt: this.createdAt
    };

    if (this.isEditMode) {
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }

    this.router.navigate(['/tasks']);
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  private createForm(): FormGroup {
    return new FormGroup({
      title: new FormControl('', [requiredNotBlank, Validators.maxLength(100)]),
      description: new FormControl('', Validators.maxLength(500)),
      status: new FormControl(INITIAL_TASK_STATUS, Validators.required),
      priority: new FormControl('', Validators.required),
      dueDate: new FormControl('')
    });
  }
}
