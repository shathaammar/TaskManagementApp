export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

/** Ordered list of the statuses a task can be in. Used to drive filters and pickers. */
export const TASK_STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

/** Ordered list of the priorities a task can have. Used to drive filters and pickers. */
export const TASK_PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High'];

/** Every new task starts here. Enforced by TaskService.addTask, not just the form. */
export const INITIAL_TASK_STATUS: TaskStatus = 'To Do';

/**
 * Converts a status/priority value into the suffix used by its translation key
 * and CSS class, e.g. "In Progress" -> "IN_PROGRESS" / "in-progress".
 * Centralized here so components and the shared badge don't each reimplement it.
 */
export function toTranslateSuffix(value: string): string {
  return value.toUpperCase().replace(/\s+/g, '_');
}

export function toCssSuffix(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-');
}

export class TaskModel {
  id = 0;
  title = '';
  description = '';
  status: TaskStatus = INITIAL_TASK_STATUS;
  priority: TaskPriority = 'Low';
  dueDate = '';
  createdAt: Date = new Date();
}
