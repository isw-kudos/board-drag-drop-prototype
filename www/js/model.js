/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';
function Board(id,name) {
  return {
    id: id,
    name: name,
    type: "board",
    childNodes: []
  };
}

function List(id,type,name) {
  return {
    id: id,
    type: type,
    name: name,
    childNodes: []
  };
}

function Card(id,type,completed,name,description,status) {
  this.id = id;
  this.type = type;
  this.completed = completed;
  this.name = name;
  this.description = description;
  this.status = status;
  this.childNodes = [];

  this.isTodo = function() {
    return this.type=="todo";
  }

  this.isComplete = function() {
    return typeof this.completed=="boolean" && this.completed;
  }

  return this;
}
