import Ember from 'ember';
import sortBy from 'ember-computed-sortby/macros/sort-by';

export default {
  name: 'sortBy',
  initialize: function() {
    Ember.computed.sortBy = sortBy;
  }
};
