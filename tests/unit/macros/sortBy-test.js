import { module, test } from 'qunit';
import Ember from 'ember';
import sortBy from 'ember-computed-sortby/macros/sort-by';

var set = Ember.set;
var isArray = Ember.isArray;

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
        { fname: 'Jaime',  lname: 'Lannister', age: 34 },
        { fname: 'Robb',   lname: 'Stark',     age: 16 },
        { fname: 'Cersei', lname: 'Lannister', age: 32 },
        { fname: 'Bran',   lname: 'Stark',     age:  8 }
      ])
    });
  },
  teardown() {
    Ember.run(obj, 'destroy');
  }
});

test('Single sort string property defaults to asc', function(assert) {
  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Robb'], 'list is sorted correctly');

  obj.set('users.firstObject.fname', 'Tyrion');

  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Cersei', 'Robb', 'Tyrion'], 'updating sort property resorts the list');
});

test('Single sort string property works with desc', function(assert) {
  assert.deepEqual(obj.get('sortedLnameUsers').mapBy('lname'), ['Stark', 'Stark', 'Lannister', 'Lannister'], 'list is sorted correctly');

  obj.set('users.lastObject.lname', 'Baratheon');

  assert.deepEqual(obj.get('sortedLnameUsers').mapBy('lname'), ['Stark', 'Lannister', 'Lannister', 'Baratheon'], 'updating sort property resorts the list');
});

test('Single valued array property', function(assert) {
  assert.deepEqual(obj.get('sortedLnameUsers2').mapBy('lname'), ['Lannister', 'Lannister', 'Stark', 'Stark'], 'list is sorted correctly');

  obj.set('users.firstObject.lname', 'Baratheon');

  assert.deepEqual(obj.get('sortedLnameUsers2').mapBy('lname'), ['Baratheon', 'Lannister', 'Stark', 'Stark'], 'updating sort property resorts the list');
});

test('Multi valued array property', function(assert) {
  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Robb', 'Cersei', 'Jaime'], 'list is sorted correctly');

  var jamie = obj.get('users').objectAt(0);
  set(jamie, 'age', 26);

  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Robb', 'Jaime', 'Cersei'], 'updating the secondary sort property resorts list');

  var robb = obj.get('users').objectAt(1);
  set(robb, 'lname', 'Baratheon');

  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Jaime', 'Cersei', 'Robb'], 'updating the primary sort property resorts list');
});

test('Add / Remove items from the sorted array', function(assert) {
  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Robb'], 'list is sorted correctly');
  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Robb', 'Cersei', 'Jaime'], 'list is sorted correctly');

  obj.get('users').pushObject({ fname: 'Joffrey', lname: 'Baratheon', age: 15 });
  obj.get('users').pushObject({ fname: 'Ned', lname: 'Stark', age: 54 });

  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Joffrey', 'Ned', 'Robb'], 'adding items to the list should have trigger resort');
  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Robb', 'Ned', 'Cersei', 'Jaime', 'Joffrey'], 'adding items to the list should have trigger resort');

  obj.get('users').removeAt(1);
  obj.get('users').removeAt(1);

  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Jaime', 'Joffrey', 'Ned'], 'removing items to the list should have trigger resort');
  assert.deepEqual(obj.get('lnameThenOldest').mapBy('fname'), ['Bran', 'Ned', 'Jaime', 'Joffrey'], 'removing items to the list should have trigger resort');
});

test('Change the entire sorted array', function(assert) {
  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Bran', 'Cersei', 'Jaime', 'Robb'], 'list is sorted correctly');

  obj.set('users', [
    { fname: 'Daenerys', lname: 'Targaryen', age: 23 },
    { fname: 'Margaery', lname: 'Tyrell',    age:  25 },
    { fname: 'Jon',      lname: 'Snow',      age: 28 }
  ]);

  assert.deepEqual(obj.get('sortedFnameUsers').mapBy('fname'), ['Daenerys', 'Jon', 'Margaery'], 'list should resort after being completely swapped');
});

test('Check null and empty sorting array', function(assert) {
  obj.set('users', []);
  var sortedList = obj.get('sortedFnameUsers');
  assert.ok((isArray(sortedList) && sortedList.length === 0), 'an empty items list should return an empty array');

  obj.set('users', null);
  sortedList = obj.get('sortedFnameUsers');
  assert.ok((isArray(sortedList) && sortedList.length === 0), 'a null list should return an empty array');
});

test('Bad args', function(assert) {
  assert.throws(function() {
    Ember.Object.extend({
      sortedUsers: sortBy('users')
    }).create().get('sortedUsers');
  }, 'Asserted when second argument was missing.');

  assert.throws(function() {
    Ember.Object.extend({
      sortedUsers: sortBy('users', function() {})
    }).create().get('sortedUsers');
  }, 'Asserted when second argument was incorrect.');

  assert.throws(function() {
    Ember.Object.extend({
      sortedUsers: sortBy('users', {})
    }).create().get('sortedUsers');
  }, 'Asserted when second argument was incorrect.');
});

test('Setting sortBy property', function(assert) {
  assert.throws(function() {
    obj.set('sortedFnameUsers', Ember.A([]));
  }, 'Asserted when trying set read-only list.');
});
