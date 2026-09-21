import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: TaskService;

  async function setup(routeId: string | null) {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(routeId ? { id: routeId } : {}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
  }

  afterEach(() => localStorage.clear());

  describe('create mode', () => {
    beforeEach(async () => {
      localStorage.clear();
      await setup(null);
      fixture.detectChanges();
    });

    it('does not enter edit mode, so no status field is offered on create', () => {
      expect(component.isEditMode).toBeFalse();
    });

    it('rejects a whitespace-only title', () => {
      component.taskForm.get('title')?.setValue('   ');
      component.taskForm.get('priority')?.setValue('Low');
      expect(component.taskForm.invalid).toBeTrue();
      expect(component.title?.errors?.['required']).toBeTrue();
    });

    it('saves a new task with the initial status regardless of form state', () => {
      spyOn(taskService, 'addTask');
      component.taskForm.setValue({ title: 'New task', description: '', status: 'Done', priority: 'Medium', dueDate: '' });

      component.onSave();

      expect(taskService.addTask).toHaveBeenCalled();
      const savedTask: TaskModel = (taskService.addTask as jasmine.Spy).calls.mostRecent().args[0];
      expect(savedTask.status).toBe('To Do');
      expect(savedTask.title).toBe('New task');
    });

    it('does not save when the form is invalid', () => {
      spyOn(taskService, 'addTask');
      component.taskForm.get('priority')?.setValue('');

      component.onSave();

      expect(taskService.addTask).not.toHaveBeenCalled();
    });
  });

  describe('edit mode', () => {
    beforeEach(async () => {
      localStorage.clear();
      const existing: TaskModel = {
        id: 5, title: 'Existing', description: '', status: 'To Do', priority: 'Low', dueDate: '', createdAt: new Date()
      };
      localStorage.setItem('TaskData', JSON.stringify([existing]));

      await setup('5');
      fixture.detectChanges();
    });

    it('loads the existing task into the form', () => {
      expect(component.isEditMode).toBeTrue();
      expect(component.taskForm.value.title).toBe('Existing');
      expect(component.status?.value).toBe('To Do');
    });

    it('allows moving freely between all three statuses, with no restricted transitions', () => {
      component.setStatus('Done');
      expect(component.status?.value).toBe('Done');

      component.setStatus('To Do');
      expect(component.status?.value).toBe('To Do');

      component.setStatus('In Progress');
      expect(component.status?.value).toBe('In Progress');
    });
  });
});
