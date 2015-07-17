/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').factory('BoardSize', function() {
  return {
    optimalListWidth : 350,
    listOffset : 20,
    listWidth : 350,
    numLists : 1
  };
});

angular.module('boards').controller('BoardController', ['$scope','BoardService','$ionicScrollDelegate','$timeout','BoardSize','$ionicModal',
function ($scope, BoardService, $ionicScrollDelegate, $timeout, BoardSize, $ionicModal) {
  var board = $scope.board = BoardService.getBoard("kanban");

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
    var screenWidth = document.body.clientWidth - (2*$scope.boardSize.listOffset);
    var numCols = Math.round(screenWidth/$scope.boardSize.optimalListWidth);
    $scope.boardSize.listWidth = Math.floor(screenWidth/(numCols==0 ? 1 : numCols));
  }
  //ensure widgth correct when rotation & resize
  window.addEventListener('resize', function(){
    $timeout(calculateListWidth,0);
  });
  calculateListWidth();

  function updateNumLists() {
    $scope.boardSize.numLists = board.childNodes.length;
  }
  $scope.$watchCollection('board.childNodes', updateNumLists);
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
      event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.list.name;
    },
    orderChanged: function (event) {},
    dragStart:function(event) {
      $scope.dragging = true;
      $ionicScrollDelegate.freezeAllScrolls(true);
    },
    dragEnd:function() {
      $scope.dragging = false;
      $scope.dragTarget = null;
      $ionicScrollDelegate.freezeAllScrolls(false);
      $scope.stopMoving();
    },
    dragMove:function(event){
      $scope.stopMoving();

      function getScrollInfo(distToPosLimit,distToNegLimit,options) {
        var maxScrollPixels = 5;
        var distance = (distToPosLimit < options.tollerance)
                          ? options.tollerance - distToPosLimit
                          : (distToNegLimit < options.tollerance)
                            ? distToNegLimit - options.tollerance
                            : 0;
        return {
          distance:distance,
          pixels:distance/options.tollerance * maxScrollPixels * options.speed
        }
      }

      var distToLeftEdge = event.nowX;
      var distToRightEdge = document.body.clientWidth - distToLeftEdge;
      var xScroll = getScrollInfo(distToRightEdge,distToLeftEdge,{
        tollerance:150,
        speed:2
      });

      var scrollAmounts = {
        x:xScroll.pixels,
        y:0
      };
      var scroller = $scope.boardScroll;

      //Dragging in list. Check if should scroll
      if($scope.dragTarget)
      {
        //Get Scroll container for determining where mouse is relative to it
        var listEl = $scope.dragTarget.element.parent().parent();
        var distToTopEdge = event.nowY - listEl.offset().top;
        var distToBottomEdge = listEl[0].clientHeight - distToTopEdge;
        var yScroll = getScrollInfo(distToBottomEdge,distToTopEdge,{
          tollerance:50,
          speed:2
        });

        //Check which direction of scroll is more necessary
        if(Math.abs(yScroll.distance) > Math.abs(xScroll.distance))
        {
          scrollAmounts.x = 0;
          scrollAmounts.y = yScroll.pixels;
          scroller = $ionicScrollDelegate.$getByHandle('list'+$scope.dragTarget.$parent.modelValue.id);
        }
      }
      //Start the scroll
      $scope.startMoving(scroller,scrollAmounts,event);
    }
  };

  $scope.cardSortOptions = angular.extend({}, $scope.listSortOptions, {
    accept: function (sourceItemHandleScope, destSortableScope) {
      var accept = (sourceItemHandleScope.$parent.modelValue instanceof Card);
      if(accept)
        $scope.dragTarget = destSortableScope;
      return accept;
    }
  });

  $scope.moveTimer = null;
  $scope.startMoving = function(scroller,pixels,event) {
    function moveBy(pixels) {
      scroller.scrollBy(pixels.x,pixels.y,false);
      //inform the sortable that the mouse has 'moved' as the container moved underneath it
      //move the event creation out of this thread
      $timeout(function() {
        var e = document.createEvent('MouseEvent');
        e.initMouseEvent("mousemove",true,true,window,1,screenX,screenY,event.nowX, event.nowY, false, false, false, false, 0, undefined);
        document.dispatchEvent(e);
      });
    }
    if(pixels.x!=0 || pixels.y!=0)
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
    var currentListIndex = $scope.boardScroll.getScrollPosition().left/$scope.boardSize.listWidth;
    var newListIndex = right ? Math.ceil(currentListIndex)-1
                               : Math.floor(currentListIndex)+1;
    $scope.scrollToList(newListIndex);
  };
  $scope.scrollToList = function(index) {
    $scope.boardScroll.scrollTo(index * $scope.boardSize.listWidth - $scope.boardSize.listOffset,0,true);
  };

  $scope.openCard = function (list, card) {
    console.log("open card");
    $scope.currentCard = card;
    // BoardService.removeCard($scope.board, list, card);
    $scope.modal.show();
  };

  $scope.addNewCard = function (list) {
    // BoardService.addNewCard($scope.board, list);
  };

  //Create the modal to show card content
  $ionicModal.fromTemplateUrl('views/card-modal.html', {
    scope: $scope,
    animation:'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
}]);
