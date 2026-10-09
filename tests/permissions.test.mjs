import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PermissionState } from '../src/lib/permissions.ts';

test('A delayed initial session response cannot revoke a completed login', () => {
  const permissions = new PermissionState();
  const initialRequest = permissions.revision;
  const login = permissions.beginAction();
  assert.equal(permissions.finishAction(true, login), true);
  assert.equal(permissions.applyRead(false, initialRequest, 'session'), false);
  assert.equal(permissions.editing, true);
});

test('A delayed journal response cannot restore editing after logout starts', () => {
  const permissions = new PermissionState();
  permissions.applyRead(true, permissions.revision, 'journal');
  const request = permissions.revision;
  const logout = permissions.beginAction();
  assert.equal(permissions.applyRead(true, request, 'journal'), false);
  permissions.finishAction(false, logout);
  assert.equal(permissions.applyRead(true, request, 'journal'), false);
  assert.equal(permissions.editing, false);
});

test('A read started during login cannot overwrite its successful response', () => {
  const permissions = new PermissionState();
  const login = permissions.beginAction();
  const readDuringLogin = permissions.revision;
  permissions.finishAction(true, login);
  assert.equal(permissions.applyRead(false, readDuringLogin, 'journal'), false);
  assert.equal(permissions.editing, true);
});

test('Journal bootstrap is shared with late header subscribers without an action event', () => {
  const permissions = new PermissionState();
  const actionRefreshes = [];
  permissions.subscribe(update => { if (update.source === 'action') actionRefreshes.push(update.editing); });
  permissions.applyRead(true, permissions.revision, 'journal');
  const header = [];
  const unsubscribe = permissions.subscribe(update => header.push(update));
  assert.deepEqual(header, [{ editing: true, source: 'journal' }]);
  assert.deepEqual(actionRefreshes, []);
  permissions.finishAction(false, permissions.beginAction());
  assert.deepEqual(actionRefreshes, [false]);
  unsubscribe();
  permissions.applyRead(false, permissions.revision, 'journal');
  assert.equal(header.length, 2);
});

test('A rejected write from the current session invalidates its outstanding reads', () => {
  const permissions = new PermissionState();
  permissions.applyRead(true, permissions.revision, 'journal');
  const pendingWrite = permissions.revision;
  assert.equal(permissions.deny(pendingWrite), true);
  assert.equal(permissions.applyRead(true, pendingWrite, 'journal'), false);
  assert.equal(permissions.editing, false);
});

test('An old write rejection cannot cancel a login started after logout', () => {
  const permissions = new PermissionState();
  permissions.applyRead(true, permissions.revision, 'journal');
  const oldWrite = permissions.revision;
  permissions.finishAction(false, permissions.beginAction());
  const newLogin = permissions.beginAction();
  assert.equal(permissions.deny(oldWrite), false);
  assert.equal(permissions.finishAction(true, newLogin), true);
  assert.equal(permissions.editing, true);
  assert.equal(permissions.deny(oldWrite), false);
  assert.equal(permissions.editing, true);
});
