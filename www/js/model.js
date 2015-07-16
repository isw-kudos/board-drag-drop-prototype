/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';
function Board(id, name) {
  return {
    id: id,
    name: name,
    columns: []
  };
}

function List(id,name) {
  return {
    id: id,
    name: name,
    cards: []
  };
}


function Card(id, name, status, description) {
  this.id = id;
  this.name = name;
  this.status = status;
  this.description = description;
  return this;
}
