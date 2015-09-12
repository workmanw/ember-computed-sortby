import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../../tests/helpers/start-app';
import sortBy from 'ember-computed-sortby/macros/sort-by';

module('Acceptance | initializer', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('Ensure `sortBy` is tacked onto `Ember.computed.sortBy`', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(Ember.computed.sortBy, sortBy);
  });
});
