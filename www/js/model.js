/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';
function Board(name) {
  return {
    name: name,
    columns: []
  };
}

function List(name) {
  return {
    name: name,
    cards: []
  };
}


function Card(name, status, description) {
  this.name = name;
  this.status = status;
  this.description = description;
  return this;
}
