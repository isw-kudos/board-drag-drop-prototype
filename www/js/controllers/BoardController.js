/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').controller('BoardController', ['$scope', 'BoardService', 'BoardDataFactory', '$ionicScrollDelegate', '$timeout',
function ($scope, BoardService, BoardDataFactory, $ionicScrollDelegate, $timeout) {
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
      $scope.stopMoving();
    },
    dragMove:function(event){
      // console.log("pos",event);
      // console.log("page",document.body.clientWidth);
      var distToLeftEdge = event.nowX;
      var distToRightEdge = document.body.clientWidth - event.nowX;
      var tollerance=150, scrollOffset=0, maxScrollPixels=5, speed=2;
      var scrollDistance = (distToRightEdge < tollerance)
                              ? tollerance - distToRightEdge + scrollOffset
                              : (distToLeftEdge < tollerance)
                                  ? distToLeftEdge - tollerance - scrollOffset
                                  : 0;
      $scope.stopMoving();
      var scrollAmount = scrollDistance/tollerance * maxScrollPixels * speed;
      $scope.startMoving(scrollAmount,event);
    }
  };
  $scope.cardSortOptions = angular.extend({}, $scope.listSortOptions, {
    accept: function (sourceItemHandleScope, destSortableScope) {
     return (sourceItemHandleScope.$parent.modelValue instanceof Card);
    }
  });
  $scope.moveTimer = null;
  $scope.startMoving = function(pixels,event) {
    function moveBy(scrollAmount) {
      $ionicScrollDelegate.scrollBy(scrollAmount,0,false);
      //inform the sortable that the mouse has 'moved' as the container moved underneath it
      //move the event creation out of this thread
      $timeout(function() {
        var e = document.createEvent('MouseEvent');
        e.initMouseEvent("mousemove",true,true,window,1,screenX,screenY,event.nowX, event.nowY, false, false, false, false, 0, undefined);
        document.dispatchEvent(e);
      });
    }
    if(pixels!=0)
    {
      // moveBy(scrollAmount);
      $scope.moveTimer = $timeout(function(){moveBy(pixels);}, 10);
    }
  };
  $scope.stopMoving = function(){
    if($scope.moveTimer) $timeout.cancel($scope.moveTimer);
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
