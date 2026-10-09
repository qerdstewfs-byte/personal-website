import type { DayRecord, Task } from './journal';

export type CheckIntent = { taskId: string; checked: boolean; version: number };

// Keep unacknowledged clicks separate from the last cloud record. An older
// response must never undo a newer click, even on the same checkbox.
export class CheckmarkBuffer {
  private sequence = 0;
  private days = new Map<string, Map<string, CheckIntent>>();
  stage(date: string, taskId: string, checked: boolean) {
    let day = this.days.get(date);
    if (!day) { day = new Map(); this.days.set(date, day); }
    day.set(taskId, { taskId, checked, version: ++this.sequence });
  }
  dates() { return [...this.days.keys()]; }
  get pending() { return this.days.size > 0; }
  snapshot(date: string) { return [...(this.days.get(date)?.values() ?? [])].map(intent => ({ ...intent })); }
  acknowledge(date: string, sent: CheckIntent[]) {
    const day = this.days.get(date);
    for (const intent of sent) if (day?.get(intent.taskId)?.version === intent.version) day.delete(intent.taskId);
    if (!day?.size) this.days.delete(date);
  }
  overlay(date: string, saved: DayRecord | undefined, template: Task[]): DayRecord | undefined {
    const intents = this.days.get(date);
    if (!intents?.size) return saved;
    const day = saved ?? { date, tasks: template, checked: {}, note: '', revision: 0, updatedAt: '' };
    const checked = { ...day.checked };
    for (const intent of intents.values()) if (day.tasks.some(task => task.id === intent.taskId)) checked[intent.taskId] = intent.checked;
    return { ...day, checked };
  }
}
