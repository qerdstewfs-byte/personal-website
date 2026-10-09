export type PermissionSource = 'journal' | 'session' | 'action' | 'denied';
export type PermissionUpdate = { editing: boolean; source: PermissionSource };

/** Shares permission reads while preventing pre-login responses from undoing an action. */
export class PermissionState {
  private version = 0;
  private snapshot: PermissionUpdate = { editing: false, source: 'session' };
  private listeners = new Set<(update: PermissionUpdate) => void>();

  get revision() { return this.version; }
  get editing() { return this.snapshot.editing; }

  subscribe(listener: (update: PermissionUpdate) => void) {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => { this.listeners.delete(listener); };
  }

  beginAction() { return ++this.version; }

  applyRead(editing: boolean, revision: number, source: 'journal' | 'session') {
    if (revision !== this.version) return false;
    this.publish(editing, source);
    return true;
  }

  finishAction(editing: boolean, revision: number) {
    if (revision !== this.version) return false;
    // Reads may also start while the login/logout request is in flight.
    this.version++;
    this.publish(editing, 'action');
    return true;
  }

  deny(revision: number) {
    if (revision !== this.version) return false;
    this.version++;
    this.publish(false, 'denied');
    return true;
  }

  private publish(editing: boolean, source: PermissionSource) {
    this.snapshot = { editing, source };
    for (const listener of this.listeners) listener(this.snapshot);
  }
}

export const journalPermissions = new PermissionState();
