import Ember from 'ember';
import sortBy from 'ember-computed-sortby';

export default {
  name: 'sortBy',
  initialize: function() {
    Ember.computed.sortBy = function() {
      Ember.deprecate('Using `Ember.computed.sortBy` is deprecated. Instead, import it directly using `import sortBy from \'ember-computed-sortby\'`.', false, {
        id: 'ember-computed-sortby.global-import',
        until: '1.0.0'
      });
      return sortBy.apply(null, arguments);
    };
  }
};
