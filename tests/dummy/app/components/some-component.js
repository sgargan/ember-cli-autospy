import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    classicAction() {
      this.sendAction('classicAction');
    },
    classicActionWithParams() {
      this.sendAction('classicActionWithParams', '1', 2, { three: 'three' });
    },
    closureAction() {
      this.attrs.closureAction();
    },
    closureActionWithParams() {
      this.attrs.closureActionWithParams('1', 2, { three: 'three' });
    },
    closureActionWithReturn() {
      var result = this.attrs.closureActionWithReturn();
      this.set('actionResult', result);
    }
  }
});
