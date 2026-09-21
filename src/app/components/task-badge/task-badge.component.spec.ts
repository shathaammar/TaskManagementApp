import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TaskBadgeComponent } from './task-badge.component';

describe('TaskBadgeComponent', () => {
  let component: TaskBadgeComponent;
  let fixture: ComponentFixture<TaskBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBadgeComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.kind = 'status';
    component.value = 'To Do';
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('derives a dash-separated css class from a multi-word value', () => {
    component.kind = 'status';
    component.value = 'In Progress';
    expect(component.cssClass).toBe('in-progress');
  });

  it('builds the translation key from the badge kind and value', () => {
    component.kind = 'priority';
    component.value = 'High';
    expect(component.translateKey).toBe('PRIORITY.HIGH');
  });
});
