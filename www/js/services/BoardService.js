/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').service('BoardService', ['$modal', 'BoardManipulator', function ($modal, BoardManipulator) {

  return {
    removeCard: function (board, column, card) {
      if (confirm('Are You sure to Delete?')) {
        BoardManipulator.removeCardFromColumn(board, column, card);
      }
    },

    addNewCard: function (board, column) {
      var modalInstance = $modal.open({
        templateUrl: 'views/partials/newCard.html',
        controller: 'NewCardController',
        backdrop: 'static',
        resolve: {
          column: function () {
            return column;
          }
        }
      });
      modalInstance.result.then(function (cardDetails) {
        if (cardDetails) {
          BoardManipulator.addCardToColumn(board, cardDetails.column, "", cardDetails.title, cardDetails.details);
        }
      });
    },
    kanbanBoard: function (board) {
      var kanbanBoard = new Board(board.id, board.name);
      angular.forEach(board.childNodes, function (node) {
        BoardManipulator.addColumn(kanbanBoard, node.id, node.name);
        angular.forEach(node.childNodes, function (card) {
          BoardManipulator.addCardToColumn(kanbanBoard, node, card.name, card.description);
        });
      });
      return kanbanBoard;
    }
  };
}]);
