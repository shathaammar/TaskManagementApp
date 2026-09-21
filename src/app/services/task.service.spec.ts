import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TaskService } from './task.service';
import { TaskModel } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  function makeTask(overrides: Partial<TaskModel> = {}): TaskModel {
    return { id: 0, title: 'Task', description: '', status: 'Done', priority: 'Low', dueDate: '', createdAt: new Date(), ...overrides };
  }

  it('always creates a new task with the initial status, even if a different one was passed in', () => {
    service.addTask(makeTask({ status: 'Done' }));
    const [saved] = service.getAllTasks();
    expect(saved.status).toBe('To Do');
  });

  it('assigns stable, unique ids and does not renumber tasks after a delete', () => {
    service.addTask(makeTask({ title: 'First' }));
    service.addTask(makeTask({ title: 'Second' }));
    service.addTask(makeTask({ title: 'Third' }));

    const [third, second, first] = service.getAllTasks();
    service.deleteTask(second.id);

    const remaining = service.getAllTasks();
    expect(remaining.map(t => t.id).sort()).toEqual([first.id, third.id].sort());
    expect(remaining.find(t => t.id === first.id)?.title).toBe('First');

    service.addTask(makeTask({ title: 'Fourth' }));
    const ids = service.getAllTasks().map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('updateTask only changes the matching task and leaves others untouched', () => {
    service.addTask(makeTask({ title: 'Keep me' }));
    service.addTask(makeTask({ title: 'Change me' }));
    const [toChange, toKeep] = service.getAllTasks();

    service.updateTask({ ...toChange, title: 'Changed', status: 'In Progress' });

    const tasks = service.getAllTasks();
    expect(tasks.find(t => t.id === toChange.id)?.title).toBe('Changed');
    expect(tasks.find(t => t.id === toKeep.id)?.title).toBe('Keep me');
  });

  it('returns an empty list and does not throw when there is no browser storage (SSR)', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }]
    });
    const serverService = TestBed.inject(TaskService);

    expect(serverService.getAllTasks()).toEqual([]);
    expect(() => serverService.addTask(makeTask())).not.toThrow();
  });

  it('recovers instead of throwing when local storage holds corrupted data', () => {
    localStorage.setItem('TaskData', '{not valid json');
    expect(service.getAllTasks()).toEqual([]);
  });

  it('derives the next id from existing tasks when upgrading from data saved before TaskIdCounter existed', () => {
    // Simulate a pre-existing installation: tasks were saved by an older version
    // of the app that had no id-counter key at all.
    localStorage.setItem('TaskData', JSON.stringify([
      makeTask({ id: 5, title: 'Old task' }),
      makeTask({ id: 2, title: 'Older task' })
    ]));

    service.addTask(makeTask({ title: 'New task' }));

    const [newest] = service.getAllTasks();
    expect(newest.title).toBe('New task');
    expect(newest.id).toBe(6);
  });
});
