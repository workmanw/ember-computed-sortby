import Ember from 'ember';

var assert = Ember.assert;
var get = Ember.get;
var compare = Ember.compare;
var computed = Ember.computed;
var isArray = Ember.isArray;


/**
  A computed property which returns a new sorted array of content from the
  first dependent array. The sort order is based on the string or array of string values
  provided as the second argument.

  The second argument, sortDefinitions, can be a string or array of string value(s)
  which indicates the item property and direction of the sort. Adding a suffix of ':desc'
  will cause the list to be sorted in descending order.

  Example:

  ```javascript
  var ToDoList = Ember.Object.extend({
    // using standard ascending sort
    sortedTodos: Ember.computed.sortBy('todos', 'name'),

    // using descending sort
    sortedTodosDesc: Ember.computed.sortBy('todos', 'name:desc'),

    // using secondary sort
    sortedPriority: Ember.computed.sortBy('todos', ['priority', 'name'])
  });

  var todoList = ToDoList.create({todos: [
    { name: 'Unit Test', priority: 2 },
    { name: 'Documentation', priority: 3 },
    { name: 'Integration Test', priority: 2 },
    { name: 'Release', priority: 1 }
  ]});

  todoList.get('sortedTodos');      // [{ name:'Documentation', priority:3 }, { name: 'Integration Test', priority: 2 }, { name:'Release', priority:1 }, { name:'Unit Test', priority:2 }]
  todoList.get('sortedTodosDesc');  // [{ name:'Unit Test', priority:2 }, { name:'Release', priority:1 }, { name: 'Integration Test', priority: 2 }, { name:'Documentation', priority:3 }]
  todoList.get('priorityTodos');    // [{ name:'Release', priority:1 }, { name: 'Integration Test', priority: 2 }, { name:'Unit Test', priority:2 }, { name:'Documentation', priority:3 }]
  ```

  @method sort
  @for Ember.computed
  @param {String} itemsKey
  @param {String or Array} sortDefinitions a string or array of strings whose value(s) are sort properties (add `:desc` to the arrays sort properties to sort descending)
  @return {Ember.ComputedProperty} computes a new sorted array based on the sort property array
  @public
*/
export default function(itemsKey, sortDefinitions) {
  if(typeof sortDefinitions === 'string') {
    sortDefinitions = Ember.A([sortDefinitions]);
  }

  // TODO: Should we validate the all array values
  assert('sortBy expects a string or array of strings for its second argument', isArray(sortDefinitions));

  // Normalize the sort properties
  var normalizedSort = sortDefinitions.map(p => {
    let [prop, direction] = p.split(':');
    direction = direction || 'asc';
    return [prop, direction];
  });

  // Map out the dependantKeys for the computed macro
  var args = normalizedSort.map(prop => {
    return `${itemsKey}.@each.${prop}`;
  });

  // Push in the actual sorting function
  args.push(function() {
    var items = itemsKey === '@this' ? this : get(this, itemsKey);
    if (items === null || typeof items !== 'object') { return Ember.A(); }

    return Ember.A(items.slice().sort((itemA, itemB) => {
      for (var i = 0; i < normalizedSort.length; ++i) {
        var [prop, direction] = normalizedSort[i];
        var result = compare(get(itemA, prop), get(itemB, prop));
        if (result !== 0) {
          return (direction === 'desc') ? (-1 * result) : result;
        }
      }
      return 0;
    }));
  });

  return computed.apply(null, args).readOnly();
}
