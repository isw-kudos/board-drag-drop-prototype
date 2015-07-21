/*jshint node:true, undef: false, unused: false, indent: 2 */
/*global angular: false */

'use strict';

function Node(data, attrs) {
  this.id = data.id;
  this.parentId = data.parentId;
  this.commonType = data.commonType;
  this.name = data.name;
  this.childNodes = [];

  //Store all extra attributes as requested
  var self = this;
  angular.forEach(attrs, function (attr) {
    self[attr] = data[attr];
  });

  this.toString = function() {
    // return "[id:"+this.id+", commonType:"+this.commonType+", name:"+this.name+", childNodes:"+this.childNodes+"]";
    var thisStr = "";
    for(var prop in this) {
      if(typeof this[prop]!="function")
      {
        if(thisStr.length>0) thisStr += ", ";
        thisStr += prop+":"+this[prop];
      }
    }
    return "["+thisStr+"]";
  };

  this.addChild = function(child) {
    this.childNodes.push(child);
  };
}

function Board(data) {
  var attrs = [];
  angular.extend(this, new Node(data,attrs));
}

function List(data) {
  var attrs = [];
  angular.extend(this, new Node(data,attrs));
}

function Card(data) {
  var attrs = ['description'];
  angular.extend(this, new Node(data,attrs));
  this.completed = data.completed===1;

  this.isTodo = function() {
    return this.commonType=="todo";
  };
  this.isCompleted = function() {
    return typeof this.completed=="boolean" && this.completed;
  };
}
