/*jshint node:true, undef: false, unused: false, indent: 2 */
/*global angular: false, Board, List, Card */
'use strict';

angular.module('boards')

.factory('BoardManipulator', function () {
  function getNodeByType(node,parent) {
    var model = null;
    if(node.commonType=="board")
      model = new Board(node.id, node.name);
    else if(node.commonType=="section")
      model = new List(node.id, node.commonType, node.name);
    else if (node.commonType=="entry")
      model = new Card(node.id, node.commonType, null, node.name, node.description);
    else if (node.commonType=="todo")
      model = new Card(node.id, node.commonType, node.completed==1, node.name, node.description);
    return model;
  }

  function buildNodes(node) {
    var model = getNodeByType(node);
    if(model===null)
      console.log("cannot determine node",node);
    else
      angular.forEach(node.childNodes, function (childNode) {
        var child = buildNodes(childNode);
        if(child!==null)
          model.childNodes.push(child);
      });
    return model;
  }

  return {
    buildNodes:buildNodes,

    addColumn: function (board, id, columnName) {
      board.childNodes.push(new List(id, columnName));
    },

    addCardToList: function (board, type, name, list) {
      angular.forEach(board.childNodes, function (col) {
        if (col.id === list.id) {
          col.childNodes.push(new Card("", type, false, name, ""));
        }
      });
    },
    removeCardFromColumn: function (board, list, card) {
      angular.forEach(board.childNodes, function (col) {
        if (col.id === list.id) {
          col.childNodes.splice(col.cards.indexOf(card), 1);
        }
      });
    }
  };
});
