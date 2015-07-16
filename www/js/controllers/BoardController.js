/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').factory('BoardSize', function() {
  return {
    optimalListWidth : 350,
    columnOffset : 20,
    listWidth : 350,
    numLists : 1
  };
});

angular.module('boards').controller('BoardController', ['$scope', 'BoardService', 'BoardDataFactory', '$ionicScrollDelegate', '$timeout','BoardSize',
function ($scope, BoardService, BoardDataFactory, $ionicScrollDelegate, $timeout, BoardSize) {
  var board = $scope.board = BoardService.kanbanBoard(BoardDataFactory.kanban);

  $scope.boardScroll = $ionicScrollDelegate.$getByHandle('board');
  $scope.boardSize = BoardSize;
  $scope.$watch("boardSize", function() {
    $scope.boardScrollStyle = {
      width:($scope.boardSize.listWidth * $scope.boardSize.numLists)+'px'
    };
    $scope.listStyle = {
      width:($scope.boardSize.listWidth)+'px'
    };
  },true);
  
  function calculateListWidth(event) {
    var screenWidth = document.body.clientWidth - (2*$scope.boardSize.columnOffset);
    var numCols = Math.round(screenWidth/$scope.boardSize.optimalListWidth);
    $scope.boardSize.listWidth = Math.floor(screenWidth/(numCols==0 ? 1 : numCols));
  }
  //ensure widgth correct when rotation & resize
  window.addEventListener('resize', function(){
    $timeout(calculateListWidth,0);
  });
  calculateListWidth();

  function updateNumLists() {
    $scope.boardSize.numLists = board.columns.length;
  }
  $scope.$watchCollection('board.columns', updateNumLists);
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
      $scope.dragging = true;
      $scope.boardScroll.freezeScroll(true);
    },
    dragEnd:function() {
      $scope.dragging = false;
      $scope.boardScroll.freezeScroll(false);
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
      $scope.boardScroll.scrollBy(scrollAmount,0,false);
      //inform the sortable that the mouse has 'moved' as the container moved underneath it
      //move the event creation out of this thread
      $timeout(function() {
        var e = document.createEvent('MouseEvent');
        e.initMouseEvent("mousemove",true,true,window,1,screenX,screenY,event.nowX, event.nowY, false, false, false, false, 0, undefined);
        document.dispatchEvent(e);
      });
    }
    if(pixels!=0)
      $scope.moveTimer = $timeout(function(){moveBy(pixels);}, 10);
  };
  $scope.stopMoving = function(){
    if($scope.moveTimer) $timeout.cancel($scope.moveTimer);
  };

  //Dragging sideways in list does not move ion-content view as event does not propagate
  $scope.dragListHorizontal = function(event){
    if(!$scope.dragging)
    {
      var gesture = event.gesture;
      //keep initial scroll position
      if(!gesture.startEvent.originalScroll)
        gesture.startEvent.originalScroll = $scope.boardScroll.getScrollPosition().left;
      //move scroller by same amount dragged
      $scope.boardScroll.scrollTo(gesture.startEvent.originalScroll-gesture.deltaX,0,false);
    }
  };

  $scope.swipeToNextList = function(right) {
    var currentColumnIndex = $scope.boardScroll.getScrollPosition().left/$scope.boardSize.listWidth;
    var newColumnIndex = right ? Math.ceil(currentColumnIndex)-1
                               : Math.floor(currentColumnIndex)+1;
    $scope.scrollToList(newColumnIndex);
  };
  $scope.scrollToList = function(index) {
    $scope.boardScroll.scrollTo(index * $scope.boardSize.listWidth - $scope.boardSize.columnOffset,0,true);
  };

  $scope.openCard = function (column, card) {
    console.log("open card");
    // BoardService.removeCard($scope.board, column, card);
  };

  $scope.addNewCard = function (column) {
    // BoardService.addNewCard($scope.board, column);
  };
}]);
