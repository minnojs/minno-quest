define(function(require){

    var _ = require('underscore');
    var angular = require('angular');
    var canvasConstructor = require('./canvasConstructor');

    managerCanvasService.$inject = ['$rootElement', '$document'];
    function managerCanvasService($rootElement, $document){
        var $body = angular.element($document[0].body);

        var map = {
            background 			: {element: $body, property: 'backgroundColor'},
            canvasBackground	: {element: $rootElement, property:'backgroundColor'},
            fontSize 			: {element: $rootElement, property:'fontSize'},
            fontColor 			: {element: $rootElement, property:'color'}
        };

        return _.bind(canvasConstructor, null, map);
    }

    return managerCanvasService;

});