import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  function makeTask(overrides: Partial<TaskModel>): TaskModel {
    return { id: 0, title: '', description: '', status: 'To Do', priority: 'Low', dueDate: '', createdAt: new Date(), ...overrides };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    // detectChanges triggers ngOnInit (loadTasks from the real TaskService),
    // so the fixture data is set afterwards or ngOnInit would overwrite it.
    fixture.detectChanges();
    component.taskList = [
      makeTask({ id: 1, title: 'Write report', status: 'To Do', priority: 'High' }),
      makeTask({ id: 2, title: 'Review PR', status: 'In Progress', priority: 'Medium' }),
      makeTask({ id: 3, title: 'Deploy release', status: 'Done', priority: 'Low' })
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters by title case-insensitively', () => {
    component.searchTitle = 'report';
    expect(component.filteredTasks.map(t => t.id)).toEqual([1]);
  });

  it('filters by status and priority together', () => {
    component.selectedStatus = 'In Progress';
    expect(component.filteredTasks.map(t => t.id)).toEqual([2]);

    component.selectedStatus = '';
    component.selectedPriority = 'Low';
    expect(component.filteredTasks.map(t => t.id)).toEqual([3]);
  });

  it('loadTasks reads the current tasks from TaskService', () => {
    const taskService = TestBed.inject(TaskService);
    spyOn(taskService, 'getAllTasks').and.returnValue([makeTask({ id: 9, title: 'From service' })]);

    component.loadTasks();

    expect(component.taskList.map(t => t.id)).toEqual([9]);
  });

  it('only deletes the task once the delete dialog is confirmed', () => {
    const taskService = TestBed.inject(TaskService);
    spyOn(taskService, 'deleteTask');
    const [target] = component.taskList;

    component.requestDelete(target);
    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(component.taskPendingDelete).toBe(target);

    component.confirmDelete();
    expect(taskService.deleteTask).toHaveBeenCalledWith(target.id);
    expect(component.taskPendingDelete).toBeNull();
  });

  it('cancelling the delete dialog leaves the task untouched', () => {
    const taskService = TestBed.inject(TaskService);
    spyOn(taskService, 'deleteTask');

    component.requestDelete(component.taskList[0]);
    component.cancelDelete();

    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(component.taskPendingDelete).toBeNull();
  });
});
