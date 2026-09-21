export class TaskModel {
  Id: number = 0;
  title: string = '';
  description: string = '';
  status: 'To Do' | 'In Progress' | 'Done' = 'To Do';
  priority: 'Low' | 'Medium' | 'High' = 'Low';  
  dueDate: string = '';        
  createdAt: Date = new Date();     
}