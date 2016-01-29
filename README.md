# Ember-computed-sortby

Addon to make sorting a little easier for Ember.js when the sort order is immutable. This addon was originally a proof of concept for [emberjs/rfcs#87](https://github.com/emberjs/rfcs/pull/87). However that RFC was rejected, so this will continue to live on as an addon. 

It is for that reason that this repo contains an initializer that tacks `sortBy` onto the `Ember.computed` object so it can be used as: `Ember.computed.sortBy`. Once Ember.js migrates to an addon, I'll likely follow suit and addonify this. 


## Documentation

A computed property which returns a new sorted array of content from the
a dependent array. The sort order is defined by the second, and any subsequent,
string arguments. Adding a suffix of ':desc' to any of those string arguments
will cause that order to be applied as descending.

Example:

```javascript
var ToDoList = Ember.Object.extend({
  // using standard ascending sort
  sortedTodos: Ember.computed.sortBy('todos', 'name'),

  // using descending sort
  sortedTodosDesc: Ember.computed.sortBy('todos', 'name:desc'),

  // using secondary sort
  sortedPriority: Ember.computed.sortBy('todos', 'priority', 'name')
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
Method documentation:
```
@method sort
@for Ember.computed
@param {String} itemsKey
@param {String} property name(s) to sort on. Append ':desc' to trigger sort to be applied as descending.
@return {Ember.ComputedProperty} computes a new sorted array based on the sort property array
@public
```

## Installing this addon

From within your Ember CLI project directory:
```
ember install ember-computed-sortby
```

## Running Tests

### Setup

* `git clone` this repository
* `npm install`
* `bower install`

### Testing

* `ember test`
* `ember test --server`
