import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nestedAction() {
      this.attrs.nestedAction();
    }
  }
});
