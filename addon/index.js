import Ember from 'ember';

const { assert, get, compare, computed } = Ember;
const a_slice = Array.prototype.slice;


/**
  A computed property which returns a new sorted array of content from the
  a dependent array. The sort order is defined by the second, and any subsequent,
  string arguments. Adding a suffix of ':desc' to any of those string arguments
  will cause that order to be applied as descending.

  Example:

  ```javascript
  let ToDoList = Ember.Object.extend({
    // using standard ascending sort
    sortedTodos: Ember.computed.sortBy('todos', 'name'),

    // using descending sort
    sortedTodosDesc: Ember.computed.sortBy('todos', 'name:desc'),

    // using secondary sort
    sortedPriority: Ember.computed.sortBy('todos', 'priority', 'name')
  });

  let todoList = ToDoList.create({todos: [
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
  @param {String} property name(s) to sort on. Append ':desc' to trigger sort to be applied as descending.
  @return {Ember.ComputedProperty} computes a new sorted array based on the sort property array
  @public
*/
export default function(/*itemsKey, sortDefinitions*/) {
  let sortDefinitions = a_slice.call(arguments);
  let itemsKey = sortDefinitions.shift(0);

  assert('Ember.computed.sortBy expects one or more string arguments provided as the sort definition.', sortDefinitions.length > 0);
  sortDefinitions.forEach(s => {
    assert('Ember.computed.sortBy expects one or more string arguments provided as the sort definition.', typeof s === 'string');
  });

  // Split out the sort definitions
  sortDefinitions = sortDefinitions.map(p => {
    let [prop, direction] = p.split(':');
    direction = direction || 'asc';
    return [prop, direction];
  });

  // Map out the dependantKeys for the computed macro
  let args = sortDefinitions.map(sortDefinition => {
    let prop = sortDefinition[0];
    return `${itemsKey}.@each.${prop}`;
  });

  // Push in the actual sorting function
  args.push(function() {
    let items = itemsKey === '@this' ? this : get(this, itemsKey);
    if (items === null || typeof items !== 'object') { return Ember.A(); }

    return Ember.A(items.slice().sort((itemA, itemB) => {
      for (let i = 0; i < sortDefinitions.length; ++i) {
        let [prop, direction] = sortDefinitions[i];
        let result = compare(get(itemA, prop), get(itemB, prop));
        if (result !== 0) {
          return (direction === 'desc') ? (-1 * result) : result;
        }
      }
      return 0;
    }));
  });

  return computed.apply(null, args).readOnly();
}
