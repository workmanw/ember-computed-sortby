import { module, test } from 'qunit';
import Ember from 'ember';
import sortBy from 'ember-computed-sortby/macos/sort-by';


var obj;

module('sortBy', {
  setup() {
    obj = Ember.Object.extend({
      x: sortBy()
    }).create();
  },
  teardown() {
    Ember.run(obj, 'destroy');
  }
});

test('initial test for sortby', function (assert) {
  assert.equal(obj.get('x'), 'tet');
});
