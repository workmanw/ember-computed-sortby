import Ember from 'ember';

var assert = Ember.assert;
var get = Ember.get;
var compare = Ember.compare;
var computed = Ember.computed;
var isArray = Ember.isArray;


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

  return computed.apply(null, args);
}
