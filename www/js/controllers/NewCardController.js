/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */


'use strict';

angular.module('boards').controller('NewCardController', ['$scope', '$modalInstance', 'column', function ($scope, $modalInstance, column) {

  function initScope(scope) {
    scope.columnName = column.name;
    scope.column = column;
    scope.name = '';
    scope.description = '';
  }

  $scope.addNewCard = function () {
    if (!this.newCardForm.$valid) {
      return false;
    }
    $modalInstance.close({title: this.name, column: column, details: this.description});
  };

  $scope.close = function () {
    $modalInstance.close();
  };

  initScope($scope);

}]);
