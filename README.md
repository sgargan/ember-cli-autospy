# Ember-cli-autospy

This plugin simplifies the testing of action handlers within component tests. It inspects test templates and extracts the action definitions, automatically creating a spy that will be called when the action fires.  

# Installation

This addon requires that the ember-sinon addon also be installed via ember
```bash
ember install ember-cli-autospy ember-sinon
```

# Actions

Autospy will generate spies for each of the different action types.

Classic Actions
--------------------
Say your component has the following action handler defined
```javascript
  actions: {
    aClassicAction() {
      this.sendAction('myClassicAction');
    }
  }
```
 To test this you'd setup something like the following. The withSpies call in this case will create a spy called mockedClassicAction which gets stored in the test context.
```javascript
let template = hbs `{{some-component myClassicAction='mockedClassicAction'}}`;
withSpies(this, template);
```
 Later in the test when the aClassicAction handler is triggered and the myClassicAction is sent the mockedClassicAction spy will be called and we can easily verify that our action logic fires as expected.
 ```javascript
 this.render(template);
 // trigger the action handler on the component
assertActionCalled(this, assert, 'mockedClassicAction');
 ```

Closure actions
---------------
Autospy can create spies for closure actions just as easily. Say your component expects to be passed a closure action 'someClosureAction' which it will trigger at some stage via
```javascript
this.attrs.someClosureAction();
```
withSpies can be used to generate a named spy mockedClosureAction to test this
```javascript
let template = hbs `{{some-component someClosureAction=(action mockedClosureAction)}}`;
withSpies(this, template);
this.render(template);
// trigger the action and verify the result
assertActionCalled(this, assert, 'mockedClosureAction');
});
```

Actions with Parameters
-----------------------
Both action types can potentially be fired with parameters and the generated spies will be called with these params. The assertActionCalled takes an optional list of expected params which it will compare to the params the spy received.

```javascript
  // in our component the following action is sent
  this.sendAction('someAction', 'foo', 'bar', 'baz');

  // in our test we can create spies as before,
  let template = hbs `{{some-component someAction='spyForSomeAction'}}`;
  withSpies(this, template);
   // trigger the action and verify
  assertActionCalled(this, assert, 'spyForSomeAction', 'foo', 'bar', 'baz');
```
Spycraft
--------
Out of the box the plugin will create sinon spies, but withSpies accepts a spyfactory parameter which can be used to generate spies from your mocking/spy framework of choice.

```javascript
  let customSpyFactory = () => new SpyFromMyFavoriteSpyFramework();
  ...
  withSpies(testContext, someTemplate, customSpyFactory);
```

Note `assertActionCalled` currently expects sinon mocks so if you use a custom factory you'll need to handle your own assertions. You can get access to the created spy at verification time using the `getActionSpy` call.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
