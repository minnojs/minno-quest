(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        /* global angular */
        var app = angular.module('pi', []);
        /* global angular:false */
        app.directive('piSlider', factory(root.angular));
    }
}(this, function () {
    var SLIDER_CHANGE_EVENT = 'slider:change';

    sliderDirective.$inject = ['$document', '$sce'];
    function sliderDirective($document) {
        return {
            scope: {
                options: '=piSliderOptions'
            },
            replace: true,
            require: 'ngModel',
            template: ['<div class="slider" ng-class="{\'slider-ticks\':options.showTicks}" pi-pointerdown="onSliderMouseDown($event)">',
                '<div class="slider-label-left" ng-style="options.leftLabelCss">{{options.leftLabel}}</div>',
                '<div class="slider-label-right" ng-style="options.rightLabelCss">{{options.rightLabel}}</div>',
                '<div class="slider-container">',
                '<div class="slider-bar">',
                '<div class="slider-bar-highlight" ng-style="highlightStyle"></div>',
                '</div>',
                '<div class="slider-handle" pi-pointerdown="onHandleMousedown($event)" ng-style="handleStyle"></div>',
                '</div>',
                '<ul class="slider-pips" ng-if="!options.hidePips">',
                '<li ng-repeat="i in getNumber(steps) track by $index" ng-style="{width: pipWidth + \'%\'}" ng-class="{last:$last}"></li>',
                '</ul>',
                '<ul class="slider-labels">',
                '<li ng-repeat="label in labels track by $index" ng-style="{width: labelsWidth + \'%\'}" ng-class="{first:$first, last:$last}">{{label}}</li>',
                '</ul>',
                '</div>'].join('\n'),

            link: function(scope, element, attr, ngModel) {
                var sliderHandleWidth;
                var options = scope.options || {};

                sliderHandleWidth = element[0].querySelector('.slider-handle').clientWidth;

                scope.ngModel = ngModel;

                scope.min = options.min || 0;
                scope.max = options.max || (scope.min + 100);
                scope.range = scope.max - scope.min;

                scope.steps = options.steps ? options.steps - 1 : 0;
                scope.pipWidth = options.steps && 100/scope.steps;

                scope.labels = options.labels;
                scope.labelsWidth = options.labels && 100 / options.labels.length;

                ngModel.$isEmpty = isEmpty;
                ngModel.$render = renderView;
                ngModel.$formatters.push(toPercentage);
                ngModel.$parsers.push(fromPercentage);

                scope.onHandleMousedown = onHandleMousedown;
                scope.onSliderMouseDown = onSliderMouseDown;

        // helper for ngRepeat
        // http://stackoverflow.com/questions/16824853/way-to-ng-repeat-defined-number-of-times-instead-of-repeating-over-array
                scope.getNumber = function getNumber(num){return new Array(num);};

                function setValue(percentage){
                    ngModel.$setViewValue(percentage);
                    ngModel.$render();
                }

        // limit percenatge by step size
                function steppedPercentage(percentage){
                    if (!scope.steps || ngModel.$isEmpty(percentage)){
                        return percentage;
                    }

                    return Math.round(percentage * scope.steps) / scope.steps;
                }

        // manage placing the handle as well as the highlight correctly
                function renderView() {
                    var percentage = steppedPercentage(ngModel.$viewValue);
                    var showHandle = !isNaN(percentage);
                    var handleDisplay = showHandle ? 'block' : 'none';
                    var highlightDisplay = showHandle && options.highlight ? 'block' : 'none';

                    switch (options.highlightDirection) {
                        case 'rtl':
                            scope.highlightStyle = { left: percentage * 100 + '%', display: highlightDisplay};
                            break;
                        case 'center':
                            if (percentage > 0.5) {
                                scope.highlightStyle = { left: '50%', width:100 * (percentage -0.5) + '%', display: highlightDisplay};
                            } else {
                                scope.highlightStyle = { right: '50%', width:100 * (0.5 - percentage) + '%', display: highlightDisplay};
                            }
                            break;
                        default:
                            scope.highlightStyle = { right: (100 - percentage * 100) + '%', display: highlightDisplay};
                    }

                    scope.handleStyle = { left: (percentage * 100) + '%', display: handleDisplay};
                }

        // formater model => view
                function toPercentage(modelValue){
          // if this isn't a number we can't compute percentage...
                    if (ngModel.$isEmpty(modelValue)){
                        return NaN;
                    }

          // limit model size
                    modelValue = Math.min(Math.max(modelValue, scope.min), scope.max);
                    return (modelValue - scope.min) / scope.range;
                }

        // parser view => model
                function fromPercentage(percentage){
                    return +(scope.min + (steppedPercentage(percentage) * scope.range)).toFixed(4);
                }

        // handle drag
                function onHandleMousedown(event) {
                    fixEvent(event);
                    var basePercentage, basePosition;
                    event.preventDefault();
                    event.stopPropagation(); // prevent propogation to slider so that change is fired for the beginin of a drag interaction
                    basePosition = event.pageX;
                    basePercentage = ngModel.$viewValue;

                    $document.on('mousemove touchmove', mouseMove);
                    $document.on('mouseup touchend', mouseUp);

          // drag
                    function mouseMove(event) {
                        fixEvent(event);
                        event.preventDefault();
                        var percentage = basePercentage + (event.pageX - basePosition) / (element.prop('clientWidth') - sliderHandleWidth);
            // don't allow extending beyond slider size
                        percentage = Math.min(percentage, 1);
                        percentage = Math.max(percentage, 0);

                        scope.$apply(function(){
                            setValue(percentage);
                        });
                    }

          // drop
                    function mouseUp(event) {
                        event.preventDefault();
                        $document.off('mousemove touchmove', mouseMove);
                        $document.off('mouseup touchend', mouseUp);
                        scope.$emit(SLIDER_CHANGE_EVENT, ngModel.$modelValue); // emit only on mouse drop
                    }
                }

        // slider click
                function onSliderMouseDown(event){
                    fixEvent(event);
                    event.preventDefault();
                    var sliderWidth = element.prop('clientWidth');
                    var sliderPosition = element[0].getBoundingClientRect().left;
                    var percentage = (event.pageX - sliderPosition - sliderHandleWidth/2) / (sliderWidth - sliderHandleWidth);
          // don't allow extending beyond slider size
                    percentage = Math.min(percentage, 1);
                    percentage = Math.max(percentage, 0);

          // auto "$apply" by ng-mousedown
                    setValue(percentage);
                    onHandleMousedown(event); // allow dragging after a slider click.
                }


            }
        };
    }

    return sliderDirective;


    function fixEvent(event){
        var eventDoc, doc, body;

    // fix IE8 events (missing pageX) - from jquery
    // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && event.clientX != null ) {
            eventDoc = event.target.ownerDocument || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
            event.pageY = event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

    // pageX for android multi touch screens
    // http://stackoverflow.com/questions/9585487/cant-get-coordinates-of-touchevents-in-javascript-on-android-devices
        if (event.pageX == null && event.touches){
            event.pageX = event.touches[0].pageX;
            event.pageY = event.touches[0].pageY;
        }
    }

    function isEmpty(n){
        return isNaN(parseFloat(n)) || !isFinite(n);
    }
}));
