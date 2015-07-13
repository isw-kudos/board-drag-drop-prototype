/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').service('BoardDataFactory', function () {

  return {
    kanban: {
      "name": "Kanban Board",
      "childNodes": [
        {
          "name": "Ideas",
          "childNodes": [
            {"name": "Come up with a POC for new Project"},
            {"name": "Design new framework for reporting module"}
          ]
        },
        {
          "name": "Not started",
          "childNodes": [
            {"name": "Explore new IDE for Development","description": "Testing Card Details"},
            {"name": "Get new resource for new Project","description": "Testing Card Details"}
          ]
        },
        {
          "name": "In progress",
          "childNodes": [
            {"name": "Develop ui for tracker module","description": "Testing Card Details"},
            {"name": "Develop backend for plan module","description": "Testing Card Details"}
          ]
        },
        {
          "name": "Done",
          "childNodes": [
            {"name": "Test user module","description": "Testing Card Details"},
            {"name": "End to End Testing for user group module","description": "Testing Card Details"},
            {"name": "CI for user module","description": "Testing Card Details"}
          ]
        }
      ]
    }
  };
});
