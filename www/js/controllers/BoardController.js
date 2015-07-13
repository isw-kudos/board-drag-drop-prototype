/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').controller('BoardController', ['$scope', 'BoardService', 'BoardDataFactory', '$ionicScrollDelegate', '$interval',
function ($scope, BoardService, BoardDataFactory, $ionicScrollDelegate, $interval) {
  var board = $scope.board = BoardService.kanbanBoard(BoardDataFactory.kanban);

  function calculateListWidth() {
    var optimalWidth = 400;
    var screenWidth = document.body.clientWidth - 40;
    $scope.listWidth = screenWidth > optimalWidth ? optimalWidth : screenWidth;
  }
  calculateListWidth();
  function updateNumLists() {
    $scope.numLists = board.columns.length;
  }
  $scope.$watchCollection('board.columns', function() {
    updateNumLists();
  });
  updateNumLists();

  $scope.listSortOptions = {
    //this is the container to attach the element when dragging
    containment: '#columns',
    //this is position type used on the dragging element (relative works with scrolled view)
    containerPositioning:"relative",
    //scrollableContainer:"#columns",//used to calculate position of drag item
    accept: function (sourceItemHandleScope, destSortableScope) {
     return !(sourceItemHandleScope.$parent.modelValue instanceof Card);
    },
    itemMoved: function (event) {
      event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
    },
    orderChanged: function (event) {},
    dragStart:function(event) {
      if($ionicScrollDelegate) $ionicScrollDelegate.freezeScroll(true);
    },
    dragEnd:function() {
      if($ionicScrollDelegate) $ionicScrollDelegate.freezeScroll(false);
      $scope.stopScrolling();
    },
    dragMove:function(event){
      // console.log("pos",event);
      // console.log("page",document.body.clientWidth);
      var distToLeftEdge = event.nowX;
      var distToRightEdge = document.body.clientWidth - event.nowX;
      var tollerance=150, scrollOffset=0, speed=2;
      var scrollDistance = (distToRightEdge < tollerance)
                              ? tollerance - distToRightEdge + scrollOffset
                              : (distToLeftEdge < tollerance)
                                  ? distToLeftEdge - tollerance - scrollOffset
                                  : 0;
      $scope.stopScrolling();
      $scope.startScrolling(scrollDistance,speed,tollerance);
    }
  };
  $scope.cardSortOptions = angular.extend({}, $scope.listSortOptions, {
    accept: function (sourceItemHandleScope, destSortableScope) {
     return (sourceItemHandleScope.$parent.modelValue instanceof Card);
    }
  });
  $scope.scrollInterval = null;
  $scope.startScrolling = function(scrollDistance,speed,tollerance) {
    if(scrollDistance!=0)
    {
      var scroll = scrollDistance/tollerance * 5 * speed;
      $ionicScrollDelegate.scrollBy(scroll,0,false);
      $scope.scrollInterval = $interval(function(){
        $ionicScrollDelegate.scrollBy(scroll,0,false);
      }, 20);
    }
  };
  $scope.stopScrolling = function(){
    if($scope.scrollInterval) $interval.cancel($scope.scrollInterval);
  };

  $scope.removeCard = function (column, card) {
    BoardService.removeCard($scope.board, column, card);
  };

  $scope.addNewCard = function (column) {
    // BoardService.addNewCard($scope.board, column);
  };

	$scope.dragScrollSections = function(event){
    console.log("dragScrollSections");
		event.preventDefault();
    event.stopPropagation();
		var delta = 0;
		this.previousXPosition && (delta = event.clientX - this.previousXPosition);
		this.previousXPosition = event.clientX;
    console.log("dragScrollSections",delta);
  		// var currentScroll = this.ui.sectionScroller.scrollLeft();
		// this.ui.sectionScroller.scrollLeft(Math.ceil(currentScroll-delta));
	};
}]);
