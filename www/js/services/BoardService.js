/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').service('BoardService', ['BoardDataFactory', 'BoardManipulator', function (BoardDataFactory, BoardManipulator) {

  return {
    removeCard: function (board, column, card) {
      if (confirm('Are You sure to Delete?')) {
        BoardManipulator.removeCardFromColumn(board, column, card);
      }
    },

    addNewCard: function (board, type, card, list) {
      //open modal
      BoardManipulator.addCardToList(board, type, card.name, list);
    },
    getBoard: function (boardId) {
      var boardData = BoardDataFactory[boardId];
      return BoardManipulator.buildNodes(boardData);
    }
  };
}]);
