import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TaskDetailsComponent } from './task-details.component';
import { TaskModel } from '../../models/task.model';

describe('TaskDetailsComponent', () => {
  let component: TaskDetailsComponent;
  let fixture: ComponentFixture<TaskDetailsComponent>;

  async function setup(routeId: string | null) {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(routeId ? { id: routeId } : {}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => localStorage.clear());

  it('should create', async () => {
    await setup(null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('loads the task matching the route id from storage', async () => {
    const existing: TaskModel = {
      id: 7, title: 'Existing task', description: '', status: 'Done', priority: 'High', dueDate: '', createdAt: new Date()
    };
    localStorage.setItem('TaskData', JSON.stringify([existing]));

    await setup('7');
    fixture.detectChanges();

    expect(component.task?.title).toBe('Existing task');
  });

  it('leaves task undefined when no task matches the route id', async () => {
    localStorage.setItem('TaskData', JSON.stringify([]));

    await setup('999');
    fixture.detectChanges();

    expect(component.task).toBeUndefined();
  });
});
