/*jshint undef: false, unused: false, indent: 2*/
/*global angular: false */

'use strict';

angular.module('boards').service('BoardDataFactory', function () {

  return {
    kanban: {
      "id":"0",
      "name": "Kanban Board",
      "commonType":"board",
      "childNodes": [
        {
          "id":"1",
          "name": "Ideas",
          "commonType":"section",
          "childNodes": [
            {"id":"a","name": "Come up with a POC for new Project. Very good idea. Process control application",
                "description":"hello world","commonType":"todo","completed":1},
            {"id":"b","name": "Design new framework for reporting module",
                "description":"hello world","commonType":"entry"},
            {"id":"c","name": "Design new work for reporting module",
                "description":"hello world","commonType":"entry"},
            {"id":"d","name": "Design new UI for reporting module",
                "description":"hello world","commonType":"todo","completed":1},
            {"id":"e","name": "Design new work for reporting module",
                "description":"hello world","commonType":"entry"},
            {"id":"f","name": "Design new UI for reporting module",
                "description":"hello world","commonType":"todo","completed":1},
            {"id":"g","name": "Design new work for reporting module",
                "description":"hello world","commonType":"todo","completed":0},
            {"id":"h","name": "Design new UI for reporting module",
                "description":"hello world","commonType":"entry"},
            {"id":"i","name": "Design new stub for reporting module",
                "description":"hello world","commonType":"todo","completed":0},
            {"id":"j","name": "Design factory for reporting module",
                "description":"hello world","commonType":"todo","completed":1},
            {"id":"k","name": "Resolve framework",
                "description":"hello world","commonType":"entry"}
          ]
        },
        {
          "id":"2",
          "name": "Not started",
          "commonType":"section",
          "childNodes": [
            {"id":"2a","name": "Explore new IDE for Development","description": "Testing Card Details","commonType":"todo","completed":0},
            {"id":"2b","name": "Get new resource for new Project","description": "Testing Card Details","commonType":"todo","completed":1}
          ]
        },
        {
          "id":"3",
          "name": "In progress",
          "commonType":"section",
          "childNodes": [
            {"id":"3a","name": "Develop ui for tracker module","description": "Testing Card Details","commonType":"entry"},
            {"id":"3b","name": "Develop backend for plan module","description": "Testing Card Details","commonType":"entry"}
          ]
        },
        {
          "id":"4",
          "name": "Done",
          "commonType":"section",
          "childNodes": [
            {"id":"4a","name": "Test user module","description": "Testing Card Details","commonType":"todo","completed":0},
            {"id":"4b","name": "End to End Testing for user group module","description": "Testing Card Details","commonType":"entry"},
            {"id":"4c","name": "CI for user module","description": "Testing Card Details","commonType":"todo","completed":0}
          ]
        }
      ]
    }
  };
});
