import { module, test } from 'qunit';
import Ember from 'ember';
import sortBy from 'ember-computed-sortby/macros/sort-by';


var obj;

module('sortBy', {
  setup() {
    obj = Ember.Object.extend({
      sortedFnameUsers: sortBy('users', 'fname'),
      sortedLnameUsers: sortBy('users', 'lname:desc'),
      sortedLnameUsers2: sortBy('users', ['lname:asc']),
      lnameThenOldest: sortBy('users', ['lname:desc', 'age'])
    }).create({
      users: Ember.A([
        { fname: 'Jaime', lname: 'Lannister', age: 34 },
        { fname: 'Robb', lname: 'Stark', age: 16 },
        { fname: 'Cersei', lname: 'Lannister', age: 32 },
        { fname: 'Bran', lname: 'Stark', age: 8 }
      ])
    });
  },
  teardown() {
    Ember.run(obj, 'destroy');
  }
});

// Test bad sortBy args
// Test null items, empty items
// Test modifying sort values

test('Single sort string property defaults to asc', function(assert) {
  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Robb'], 'array is sorted correctly');

  obj.set('users.firstObject.fname', 'Tyrion');
});

test('Single sort string property works with desc', function(assert) {
  assert.deepEqual(obj.get('sortedLnameUsers').mapBy('lname'), ['Stark', 'Stark', 'Lannister', 'Lannister'], 'array is sorted correctly');
});

test('Single valued array property', function(assert) {
  assert.deepEqual(obj.get('sortedLnameUsers2').mapBy('lname'), ['Lannister', 'Lannister', 'Stark', 'Stark'], 'array is sorted correctly');
});

test('Multi valued array property', function(assert) {
  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Robb', 'Cersei', 'Jaime'], 'array is sorted correctly');
});
