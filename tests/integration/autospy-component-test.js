import Em from 'ember';
import { test, moduleForComponent } from 'ember-qunit';
import { withSpies, assertActionCalled, ActionAlreadyRegistered } from 'ember-cli-autospy';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

moduleForComponent('pretty-color', 'Integration | Component | pretty color', {
  integration: true
});

test('should spy on classic actions', function(assert) {
  var template = hbs `{{some-component classicAction='mockedClassicAction'}}`;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_classic');
  assertActionCalled(this, assert, 'mockedClassicAction');
});

test('should spy on classic actions with params', function(assert) {
  var template = hbs `{{some-component classicActionWithParams='mockedClassicActionWithParams'}}`;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_classic_with_params');
  assertActionCalled(this, assert, 'mockedClassicActionWithParams', 1, [1, 2, {three: 'three'}]);
});

test('should spy on closure actions', function(assert) {
  var template = hbs `{{some-component closureAction=(action mockedClosureAction)}}`;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_closure');
  assertActionCalled(this, assert, 'mockedClosureAction');
});

test('should spy on closure actions with params', function(assert) {
  var template = hbs `{{some-component closureActionWithParams=(action mockedClosureActionWithParams)}}`;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_closure_with_params');
  assertActionCalled(this, assert, 'mockedClosureActionWithParams', 1, [1, 2, {three: 'three'}]);
});

test('should spy on closure actions and allow stubbed return value', function(assert) {
  var template = hbs `{{some-component closureActionWithReturn=(action mockedClosureActionWithReturn)}}`;
  withSpies(this, template, function() {
    return sinon.stub();
  });
  this.render(template);

  this.actionSpies['mockedClosureActionWithReturn'].returns('somevalue');
  trigger(assert, '.js_closure_with_return');
  assert.equal(Em.$('.js_returned').text(), 'somevalue');
});

test('should spy on closure actions with params', function(assert) {
  var template = hbs `{{some-component closureActionWithParams=(action mockedClosureActionWithParams)}}`;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_closure_with_params');
  assertActionCalled(this, assert, 'mockedClosureActionWithParams', 1, [1, 2, {three: 'three'}]);
});

test('should spy on multiple actions', function(assert) {
  var template = hbs `{{some-component closureAction=(action mockAction1) classicAction='mockAction2'}}`;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_closure');
  trigger(assert, '.js_classic');
  assertActionCalled(this, assert, 'mockAction1');
  assertActionCalled(this, assert, 'mockAction2');
});

test('should spy on multiple actions in nested components', function(assert) {
  var template = hbs `
  {{#some-nesting-component nestedAction=(action mockAction1)}}
    {{some-component classicAction='mockAction2'}}
  {{/some-nesting-component}}
  `;
  withSpies(this, template);
  this.render(template);
  trigger(assert, '.js_nested');
  trigger(assert, '.js_classic');
  assertActionCalled(this, assert, 'mockAction1');
  assertActionCalled(this, assert, 'mockAction2');
});

test('should ignore actions that directly mutate component properties', function(assert) {
  var template = hbs `{{some-component closureAction=(action (mut someProperty) false)}}`;
  withSpies(this, template);
  assert.equal(0, Object.keys(this.actionSpies).length);
});

test('should fail if two actions are registered with the same name', function(assert) {
  var template = hbs `{{some-component closureAction=(action sameName) classicAction='sameName'}}`;

  try {
    withSpies(this, template);
    assert.ok(false, "should have failed");
  } catch(e) {
    assert.ok(e instanceof ActionAlreadyRegistered);
    assert.equal(e.actionName, 'sameName');
  }
});

function trigger(assert, selector) {
  var element = Em.$(selector);
  assert.ok(element, `Element with selector '${selector}' not found`);
  element.click();
}
