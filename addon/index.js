/**
 * examine each of the statements defined in an inline template and automatically
 * creates and registers spies for each of the actions discovered. The spies are
 * stored in the test context as 'actionSpies' for use later in verifying action calls.
 *
 * By default sinon spies are created for each action but the type of spy can be changed
 * by supplying a spyFactory function which will be called to create a custom spy for
 * each action. e.g. function() { return myMockLib.spy(); }
 */
export function withSpies(context, template, spyFactory = null) {
  let statements = extractStatements(template);
  spyFactory = createSpyFactory(spyFactory);
  context.actionSpies = context.actionSpies ? context.actionSpies : {};
  statements.forEach((statement) => {
    Object.keys(statement).forEach(function(key) {
      let value = statement[key];
      if (typeof(value) === 'string') {
        __createActionSpy(context, spyFactory, value, true);
      } else if (value.length > 2 && value[1] == 'action') {
        let actionName = value[2][0][1];
        if(actionName != 'mut') {
          __createActionSpy(context, spyFactory, actionName, false);
        }
      }
    });
  });
}

function __createActionSpy(context, spyFactory, actionName, classic) {
  if(actionName in context.actionSpies){
    throw new ActionAlreadyRegistered(actionName);
  }
  context.actionSpies[actionName] = spyFactory.call();
  if(classic){
    context.on(actionName, context.actionSpies[actionName]);
  } else {
    context.set(actionName, context.actionSpies[actionName]);
  }
}

export function ActionAlreadyRegistered(actionName) {
  this.actionName = actionName;
  this.toString = function() {
    return `action '${this.actionName}' is already registered`;
  };
}

function extractStatements(compiledTemplate) {
  if (compiledTemplate && compiledTemplate.raw) {
    return __extractStatements([], compiledTemplate.raw);
  }
  return [];
}

function __extractStatements(statements, template) {
  if(template.statements) {
    template.statements.forEach(function(statement) {
      let statementArgs = statement[3];
      let s = {};
      for (let x = 0; x < statementArgs.length; x += 2) {
        s[statementArgs[x]] = statementArgs[x + 1];
      }
      statements.push(s);
    });
  }
  if(template.templates && template.templates.length > 0) {
    template.templates.forEach(function(nestedTemplate) {
      __extractStatements(statements, nestedTemplate);
    });
  }
  return statements;
}

function createSpyFactory(spyFactory) {
  return spyFactory ? spyFactory : function() {
    return sinon.spy();
  };
}

function getActionSpy(context, assert, actionName) {
  assert.ok(actionName in context.actionSpies, `expected to find a spy '${actionName}' check your component definition e.g. {{some-component someAction=(action ${actionName})}}`);
  return context.actionSpies[actionName];
}

/**
 * Verifies that the named action was called. The number of calls and the expected
 * arguments to each call can be controlled by supplying the following args.
 *
 * calls: the number of calls expected to the action defaults to 1.
 * actionArgs: the args that the action is expected to be called with.
 */
export function assertActionCalled(context, assert, actionName, calls = 1, actionArgs = []) {
  let actionSpy = getActionSpy(context, assert, actionName);
  assert.equal(calls, actionSpy.callCount, `expected ${calls} to action ${actionName}`);
  if (actionArgs && actionArgs.length > 0) {
    assert.ok(actionSpy.calledWithMatch(...actionArgs), `expected ${calls} calls to action '${actionName}' with ${actionArgs}  call ${actionSpy.getCall(0).args}`);
  }
}
