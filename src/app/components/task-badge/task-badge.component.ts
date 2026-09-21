import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { toCssSuffix, toTranslateSuffix } from '../../models/task.model';

export type TaskBadgeKind = 'status' | 'priority';
export type TaskBadgeVariant = 'solid' | 'pill';

/**
 * Renders a translated status/priority badge. Both the task list and the task
 * details page used to duplicate this class-name + translation-key logic
 * inline in their templates - this is the single source of truth for it now.
 * `variant` keeps each page's existing look (list = solid, details = pill).
 */
@Component({
  selector: 'app-task-badge',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './task-badge.component.html',
  styleUrl: './task-badge.component.scss'
})
export class TaskBadgeComponent {
  @Input({ required: true }) kind!: TaskBadgeKind;
  @Input({ required: true }) value!: string;
  @Input() variant: TaskBadgeVariant = 'pill';

  get cssClass(): string {
    return toCssSuffix(this.value);
  }

  get translateKey(): string {
    const prefix = this.kind === 'status' ? 'STATUS' : 'PRIORITY';
    return `${prefix}.${toTranslateSuffix(this.value)}`;
  }
}
