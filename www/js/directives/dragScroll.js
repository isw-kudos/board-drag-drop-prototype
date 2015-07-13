/**
 * Controller for Sortable.
 * @param $scope - the sortable scope.
 */
app.controller('kudos.dragScrollController', ['$scope', function ($scope) {
  this.scope = $scope;
  $scope.modelValue = null; // sortable list.
  $scope.options = {};
}]);

app.directive('kDragScroll',
  function () {
    console.log("kDragScroll");
    return {
      restrict: 'A',
      scope: true,
      controller: 'kudos.dragScrollController',
      link: function (scope, element, attrs) {
        //set the element in scope to be accessed by its sub scope.
        scope.element = element;
        element.data('_scope',scope); // #144, work with angular debugInfoEnabled(false)
      }
    };
  });

app.directive('kDragScrollItem', ['$helper', '$window', '$document',
  function ($helper, $window, $document) {
    console.log("kDragScrollItem");
    return {
      require: '^kDragScroll',
      scope: true,
      restrict: 'A',
      controller: 'kudos.dragScrollController',
      link: function (scope, element, attrs, itemController) {

        var dragElement, //drag item element.
          placeHolder, //place holder class element.
          placeElement,//hidden place element.
          itemPosition, //drag item element position.
          dragItemInfo, //drag item data.
          containment,//the drag container.
          containerPositioning, // absolute or relative positioning.
          dragListen,// drag listen event.
          scrollableContainer, //the scrollable container
          dragStart,// drag start event.
          dragMove,//drag move event.
          dragEnd,//drag end event.
          dragCancel,//drag cancel event.
          isDraggable,//is element draggable.
          placeHolderIndex,//placeholder index in items elements.
          bindDrag,//bind drag events.
          unbindDrag,//unbind drag events.
          bindEvents,//bind the drag events.
          unBindEvents,//unbind the drag events.
          hasTouch,// has touch support.
          dragHandled, //drag handled.
          createPlaceholder,
          isDisabled = false; // drag enabled

        hasTouch = $window.hasOwnProperty('ontouchstart');

        scope.itemScope = itemController.scope;
        element.data('_scope', scope); // #144, work with angular debugInfoEnabled(false)

        /**
         * Listens for a 10px movement before
         * dragStart is called to allow for
         * a click event on the element.
         *
         * @param event - the event object.
         */
        dragListen = function (event) {

          var unbindMoveListen = function () {
            angular.element($document).unbind('mousemove', moveListen);
            angular.element($document).unbind('touchmove', moveListen);
            element.unbind('mouseup', unbindMoveListen);
            element.unbind('touchend', unbindMoveListen);
            element.unbind('touchcancel', unbindMoveListen);
          };

          var startPosition;
          var moveListen = function (e) {
            e.preventDefault();
            var eventObj = $helper.eventObj(e);
            if (!startPosition) {
              startPosition = { clientX: eventObj.clientX, clientY: eventObj.clientY };
            }
            if (Math.abs(eventObj.clientX - startPosition.clientX) + Math.abs(eventObj.clientY - startPosition.clientY) > 10) {
              unbindMoveListen();
              dragStart(event);
            }
          };

          angular.element($document).bind('mousemove', moveListen);
          angular.element($document).bind('touchmove', moveListen);
          element.bind('mouseup', unbindMoveListen);
          element.bind('touchend', unbindMoveListen);
          element.bind('touchcancel', unbindMoveListen);
        };

        /**
         * Triggered when drag event starts.
         *
         * @param event the event object.
         */
        dragStart = function (event) {
          console.log("dragStart");
          var eventObj, tagName;

          if (!hasTouch && (event.button === 2 || event.which === 3)) {
            // disable right click
            return;
          }
          if (hasTouch && $helper.isTouchInvalid(event)) {
            return;
          }
          event.preventDefault();

          // (optional) Scrollable container as reference for top & left offset calculations, defaults to Document
          // scrollableContainer = angular.element($document[0].querySelector(scope.sortableScope.options.scrollableContainer)).length > 0 ?
            // $document[0].querySelector(scope.sortableScope.options.scrollableContainer) : $document[0].documentElement;

          // containment = angular.element($document[0].querySelector(scope.sortableScope.options.containment)).length > 0 ?
            // angular.element($document[0].querySelector(scope.sortableScope.options.containment)) : angular.element($document[0].body);
          //capture mouse move on containment.
          // containment.css('cursor', 'move');
          // containment.addClass('as-sortable-un-selectable');

          // dragItemInfo = $helper.dragItem(scope);
          // tagName = scope.itemScope.element.prop('tagName');
        };

        /**
         * Triggered when drag is moving.
         *
         * @param event - the event object.
         */
        dragMove = function (event) {

          var eventObj, targetX, targetY, targetScope, targetElement;

          if (hasTouch && $helper.isTouchInvalid(event)) {
            return;
          }
          // Ignore event if not handled
          if (!dragHandled) {
            return;
          }
          if (dragElement) {

            event.preventDefault();

            eventObj = $helper.eventObj(event);
            scope.sortableScope.$apply(function () {
              scope.callbacks.dragMove(itemPosition, containment);
            });

            targetX = eventObj.pageX - $document[0].documentElement.scrollLeft;
            targetY = eventObj.pageY - ($window.pageYOffset || $document[0].documentElement.scrollTop);

            //IE fixes: hide show element, call element from point twice to return pick correct element.
            dragElement.addClass(sortableConfig.hiddenClass);
            $document[0].elementFromPoint(targetX, targetY);
            targetElement = angular.element($document[0].elementFromPoint(targetX, targetY));
            dragElement.removeClass(sortableConfig.hiddenClass);

            //Set Class as dragging starts
            dragElement.addClass(sortableConfig.dragging);
          }
        };

        /**
         * triggered while drag ends.
         *
         * @param event - the event object.
         */
        dragEnd = function (event) {
          // Ignore event if not handled
          if (!dragHandled) {
            return;
          }
          event.preventDefault();
          unBindEvents();
        };

        /**
         * Binds the drag start events.
         */
        bindDrag = function () {
          element.bind('touchstart', dragListen);
          element.bind('mousedown', dragListen);
        };

        /**
         * Unbinds the drag start events.
         */
        unbindDrag = function () {
          element.unbind('touchstart', dragListen);
          element.unbind('mousedown', dragListen);
        };

        //bind drag start events.
        bindDrag();

        /**
         * Binds the events based on the actions.
         */
        bindEvents = function () {
          angular.element($document).bind('touchmove', dragMove);
          angular.element($document).bind('touchend', dragEnd);
          angular.element($document).bind('mousemove', dragMove);
          angular.element($document).bind('mouseup', dragEnd);
        };

        /**
         * Un binds the events for drag support.
         */
        unBindEvents = function () {
          angular.element($document).unbind('touchend', dragEnd);
          angular.element($document).unbind('touchmove', dragMove);
          angular.element($document).unbind('mouseup', dragEnd);
          angular.element($document).unbind('mousemove', dragMove);
        };
      }
    };
  }
]);
