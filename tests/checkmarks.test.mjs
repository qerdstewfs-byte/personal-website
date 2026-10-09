import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CheckmarkBuffer } from '../src/lib/checkmarks.ts';
import { DEFAULT_TASKS } from '../src/lib/journal.ts';
const date = '2000-02-29';
test('Rapid toggles coalesce to the last choice before a request', () => {
  const buffer = new CheckmarkBuffer();
  buffer.stage(date,'pam',true); buffer.stage(date,'pam',false); buffer.stage(date,'pam',true); buffer.stage(date,'paper',true);
  assert.deepEqual(buffer.snapshot(date).map(({taskId,checked})=>({taskId,checked})),[{taskId:'pam',checked:true},{taskId:'paper',checked:true}]);
});
test('A delayed acknowledgement cannot undo a newer click on the same task', () => {
  const buffer = new CheckmarkBuffer();
  buffer.stage(date,'pam',true); const inFlight = buffer.snapshot(date);
  buffer.stage(date,'pam',false);
  const cloud = {date,tasks:DEFAULT_TASKS,checked:{pam:true},note:'Existing note',revision:1,updatedAt:''};
  buffer.acknowledge(date,inFlight);
  assert.equal(buffer.pending,true); assert.equal(buffer.overlay(date,cloud,DEFAULT_TASKS).checked.pam,false);
  assert.equal(cloud.checked.pam,true); assert.equal(buffer.overlay(date,cloud,DEFAULT_TASKS).note,'Existing note');
  buffer.acknowledge(date,buffer.snapshot(date)); assert.equal(buffer.pending,false);
});
test('Saving one day preserves pending clicks on a different day', () => {
  const buffer = new CheckmarkBuffer();
  buffer.stage(date,'pam',true); const batch = buffer.snapshot(date);
  buffer.stage('2000-03-01','paper',true); buffer.acknowledge(date,batch);
  assert.deepEqual(buffer.dates(),['2000-03-01']);
  assert.equal(buffer.overlay('2000-03-01',undefined,DEFAULT_TASKS).checked.paper,true);
});
test('Unacknowledged clicks survive failures and never mutate the saved snapshot', () => {
  const buffer = new CheckmarkBuffer(); buffer.stage(date,'pam',true);
  const firstAttempt = buffer.snapshot(date); firstAttempt[0].checked=false;
  assert.equal(buffer.snapshot(date)[0].checked,true);
  assert.equal(buffer.overlay(date,undefined,DEFAULT_TASKS).revision,0);
  assert.equal(buffer.overlay(date,undefined,DEFAULT_TASKS).checked.pam,true);
});
