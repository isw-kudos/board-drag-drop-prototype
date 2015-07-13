// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('boards', ['ionic','ui.sortable','ui.bootstrap'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .config(function($stateProvider,$urlRouterProvider) {
    $stateProvider
    .state('board', {
      url: '/board',
      templateUrl: 'views/board.html',
      controller: 'BoardController'
    });
    $urlRouterProvider.otherwise('/board');
  })
  .controller('demoController', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
      var active = false;
      if ($location.path().indexOf(viewLocation) !== -1) {
        active = true;
      }
      return active;
    };
  }]);
