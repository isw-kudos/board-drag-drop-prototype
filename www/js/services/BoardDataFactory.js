/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').service('BoardDataFactory', function () {

  return {
    kanban: {
      "id":"0",
      "name": "Kanban Board",
      "childNodes": [
        {
          "id":"1",
          "name": "Ideas",
          "childNodes": [
            {"id":"a","name": "Come up with a POC for new Project"},
            {"id":"b","name": "Design new framework for reporting module"},
            {"id":"c","name": "Design new work for reporting module"},
            {"id":"d","name": "Design new UI for reporting module"},
            {"id":"e","name": "Design new work for reporting module"},
            {"id":"f","name": "Design new UI for reporting module"},
            {"id":"g","name": "Design new work for reporting module"},
            {"id":"h","name": "Design new UI for reporting module"},
            {"id":"i","name": "Design new stub for reporting module"},
            {"id":"j","name": "Design factory for reporting module"},
            {"id":"k","name": "Resolve framework"}
          ]
        },
        {
          "id":"2",
          "name": "Not started",
          "childNodes": [
            {"id":"2a","name": "Explore new IDE for Development","description": "Testing Card Details"},
            {"id":"2b","name": "Get new resource for new Project","description": "Testing Card Details"}
          ]
        },
        {
          "id":"3",
          "name": "In progress",
          "childNodes": [
            {"id":"3a","name": "Develop ui for tracker module","description": "Testing Card Details"},
            {"id":"3b","name": "Develop backend for plan module","description": "Testing Card Details"}
          ]
        },
        {
          "id":"4",
          "name": "Done",
          "childNodes": [
            {"id":"4a","name": "Test user module","description": "Testing Card Details"},
            {"id":"4b","name": "End to End Testing for user group module","description": "Testing Card Details"},
            {"id":"4c","name": "CI for user module","description": "Testing Card Details"}
          ]
        }
      ]
    }
  };
});
