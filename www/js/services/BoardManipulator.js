/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */


'use strict';

angular.module('boards').factory('BoardManipulator', function () {
  return {

    addColumn: function (board, columnName) {
      board.columns.push(new List(columnName));
    },

    addCardToColumn: function (board, column, name, description) {
      angular.forEach(board.columns, function (col) {
        if (col.name === column.name) {
          col.cards.push(new Card(name, column.name, description));
        }
      });
    },
    removeCardFromColumn: function (board, column, card) {
      angular.forEach(board.columns, function (col) {
        if (col.name === column.name) {
          col.cards.splice(col.cards.indexOf(card), 1);
        }
      });
    }
  };
});
