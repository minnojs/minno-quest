/*!
 * PIQuest v0.0.7
 *  License
 */
/**
 * a stopper
 */

define('utils/timer/timerStopper',[],function(){

	stopperProvider.$inject = ['timerNow'];
	function stopperProvider(now){
		function Stopper(){
			this.startTime = now();
		}

		Stopper.prototype.now = function(){
			return now() - this.startTime;
		};

		return Stopper;
	}

	return stopperProvider;

});
/* global performance */

/**
 * Returns current time (uses performance if possible).
 * Notably, this function return either time since epoch or since startup. It is useful only for latency calculations.
 * @return {integer} [Time in ms]
 */
define('utils/timer/timerNow',[],function(){

	var nowFn;

	// if performance is set, look for the now function
	if (!!window.performance) {
		nowFn = performance.now ||
		performance.mozNow ||
		performance.webkitNow ||
		performance.msNow ||
		performance.oNow;
	}

	// if we have now proxy it (so it uses perfomance as "this")
	// otherwise use regular date/time
	return nowFn ?
		function now(){return nowFn.apply(performance);}
		: function now(){ return +new Date();};

});
define('utils/timer/timer-module',['require','angular','./timerStopper','./timerNow'],function(require){
	var angular = require('angular');
	var module = angular.module('timer',[]);

	module.service('timerStopper', require('./timerStopper'));
	module.value('timerNow', require('./timerNow'));

	return module;
});
define('quest/directives/buttons/buttons',['require','angular'],function(require){
	var angular = require('angular');
	return angular

	.module('ui.bootstrap.buttons', [])

	.constant('buttonConfig', {
		activeClass: 'active',
		toggleEvent: 'click'
	})

	.controller('ButtonsController', ['buttonConfig', function(buttonConfig) {
		this.activeClass = buttonConfig.activeClass || 'active';
		this.toggleEvent = buttonConfig.toggleEvent || 'click';
	}])

	.directive('btnRadio', function () {
		return {
			require: ['btnRadio', 'ngModel'],
			controller: 'ButtonsController',
			link: function (scope, element, attrs, ctrls) {
				var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				//model -> UI
				ngModelCtrl.$render = function () {
					element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
				};

				//ui->model
				element.bind(buttonsCtrl.toggleEvent, function () {
					var isActive = element.hasClass(buttonsCtrl.activeClass);

					if (!isActive || angular.isDefined(attrs.uncheckable)) {
						scope.$apply(function () {
							ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.btnRadio));
							ngModelCtrl.$render();
						});
					}
				});
			}
		};
	})

	.directive('btnCheckbox', function () {
		return {
			require: ['btnCheckbox', 'ngModel'],
			controller: 'ButtonsController',
			link: function (scope, element, attrs, ctrls) {
				var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

				function getTrueValue() {
					return getCheckboxValue(attrs.btnCheckboxTrue, true);
				}

				function getFalseValue() {
					return getCheckboxValue(attrs.btnCheckboxFalse, false);
				}

				function getCheckboxValue(attributeValue, defaultValue) {
					var val = scope.$eval(attributeValue);
					return angular.isDefined(val) ? val : defaultValue;
				}

				//model -> UI
				ngModelCtrl.$render = function () {
					element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
				};

				//ui->model
				element.bind(buttonsCtrl.toggleEvent, function () {
					scope.$apply(function () {
						ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
						ngModelCtrl.$render();
					});
				});
			}
		};
	});
});
define('utils/template/templateFilter',['require','underscore'],function(require){
	var _ = require('underscore');

	templateFilter.$inject = ['$rootScope','$log','templateDefaultContext'];
	function templateFilter($rootScope, $log, defaultContext){

		function template(input, context){

			// if there is no template just return the string
			if (!~input.indexOf('<%')){
				return input;
			}

			// build context (extend it with the default context)
			context = _.extend(context || {}, defaultContext);

			// filters don't throw errors when used from within templates
			// therefore we need catch any errors here... (we may decide to drop this if it hits performance too mutch...)
			try{
				return _.template(input, context);
			} catch(e){
				$log.error("ERROR: \"" + e.message + "\" in the following template: ", input);
				return "";
			}

		}

		return template;

	}

	return templateFilter;
});
define('utils/template/templateObjProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	templateObjProvider.$inject = ['$filter'];
	function templateObjProvider($filter){
		var filter = $filter('template');

		function templateObj(obj, context){
			_.forIn(obj, function(value,key,obj){
				_.isString(value) && (obj[key] = filter(value, context));
			});

			return obj;
		}

		return templateObj;
	}

	return templateObjProvider;
});
define('utils/template/templateModule',['require','angular','./templateFilter','./templateObjProvider'],function(require){
	var angular = require('angular');

	var module = angular.module('template', []);

	module.filter('template', require('./templateFilter'));
	module.service('templateObj', require('./templateObjProvider'));
	module.constant('templateDefaultContext',{});

	return module;
});
/**
 * This is the default controller for all questions.
 * It exposes the local scope, and a `value` method that the harvester can use.
 */

define('quest/directives/questController',['require','underscore'],function(require){
	var _ = require('underscore');

	questController.$inject = ['$scope', 'timerStopper', '$parse', '$attrs','$log'];
	function questController($scope, Stopper, $parse, $attr, $log){
		var self = this;
		var log;
		var data = $scope.data;
		var defaults = {
			dflt: NaN
		};

		this.scope = $scope;
		this.stopper = new Stopper();


		this.registerModel = function(ngModel, options){

			options = _.defaults(options || {}, defaults);

			var ngModelGet = $parse($attr.ngModel);
			var dfltValue = ("dflt" in data) ? data.dflt : options.dflt; // use "in" to cover cases where dflt is set to "" or explicitly undefined

			// make model accesable from within scope
			$scope.model = ngModel;

			// set log and module
			if (_.isUndefined(ngModelGet($scope.$parent))){
				self.log = ngModel.$modelValue = log = {
					name: data.name,
					response: dfltValue,
					// @TODO: this is a bit fragile and primitive.
					// we should probably create a unique ID service of some sort...
					serial: _.size($parse('current.questions')($scope.$parent))
				};
				$scope.response = ngModel.$viewValue = dfltValue;

				ngModelGet.assign($scope.$parent, log);
			} else {
				log = self.log = ngModelGet($scope.$parent);
				$scope.response = ngModel.$viewValue = log.response;
				data.DEBUG && $log.warn('DEBUG: this question has already been in use: "' + log.name + '"');
			}


			// model --> view
			// should probably never be called (since our model is an object and not a primitive)
			ngModel.$formatters.push(function(modelValue) {
				return modelValue.response;
			});

			// view --> model
			ngModel.$parsers.push(function(viewValue){
				// don't know exactly why this is needed!
				// probably has to do with our use of nested ng-module
				if (_.isUndefined(viewValue)){
					return log;
				}
				var latency = self.stopper.now();

				log.response = viewValue;
				log.latency = latency;

				// if this is the first change
				if (!log.pristineLatency){
					log.pristineLatency = latency;
				}

				return log;
			});

			// make the model work with a custom event, so that it doesn't get confused with inner modules
			// note: this is a problem caused by nesting ngModule...
			ngModel.$options = _.defaults(ngModel.$options || {}, {updateOn: "quest"});

			$scope.$watch('response',function(newValue, oldValue /*, scope*/){
				newValue !== oldValue && ngModel.$setViewValue(newValue, 'quest');
			});

			var correctValidator = function(value) {
				var response = value.response;
				var correctValue = data.correctValue;

				// make sure numbers are always treated as strings
				_.isNumber(correctValue) && (correctValue+="");
				_.isNumber(response) && (response+="");

				if (_.isEqual(correctValue, response)) {
					ngModel.$setValidity('correct', true);
				} else {
					ngModel.$setValidity('correct', false);
					//value.response = dfltValue;
				}

				return value;
			};

			if (data.correct) {
				ngModel.$parsers.push(correctValidator);
				data.response = correctValidator(this.log);
			}
		};

		$scope.$on('quest:decline', function(event){
			event.preventDefault();
			log.declined = true;
			log.submitLatency = self.stopper.now();
		});

		$scope.$on('quest:submit', function(event){
			event.preventDefault();
			log.declined = undefined;
			log.submitLatency = self.stopper.now();
		});

		// $scope.$on('$destroy', function(a,b){
		// })
	}

	return questController;
});

define('text!quest/directives/piQuest/piQuest.html',[],function () { return '<div>\n\t<div piq-page ng-module="page"></div>\n</div>';});

/**
 * Main tag for piQuest component.
 * All you need in order to use it is set a script in the $rootScope and insert the tag.
 *
 * This directive is responsible for:
 *		1. Creating the task object.
 *		2. Relaying pages from the sequence to piqPage.
 *		3. For now, deal with the end of a task (redirect, callback, broadcast etc. - later this should move into the task)
 *
 * @name piQuest
  */
define('quest/directives/piQuest/piQuest-directive',['underscore', 'text!./piQuest.html'], function (_, template) {

	piQuestCtrl.$inject = ['$scope','$rootScope','Task','templateDefaultContext', 'mixerDefaultContext'];
	function piQuestCtrl($scope, $rootScope, Task, templateDefaultContext, mixerDefaultContext){
		var self = this;
		var task = self.task = new Task($scope.script);
		var defaultContext;


		var global = $rootScope.global;
		var script = $scope.script;

		// create the "current" object and expose "questions"
		var current = $rootScope.global[script.name || 'current'] = $rootScope.current = {questions: {}};

		// extend global and current with settings...
		if (script.current) {
			_.extend(current, script.current);
		}

		if (script.global) {
			_.extend(global, script.global);
		}

		this.init = next;

		// create default context
		defaultContext = {
			global: global,
			current: current,
			questions: $scope.current.questions
		};

		// set default contexts
		_.extend(templateDefaultContext,defaultContext);
		_.extend(mixerDefaultContext,defaultContext);

		$scope.$on('quest:next', next);
		$scope.$on('quest:prev', prev);
		$scope.$on('quest:refresh', refresh);

		$scope.$on('quest:log', function(event, log, pageData){
			task.log(log, pageData, $scope.global);
		});

		function next(event, target){
			task.next(target);
			refresh();
		}

		function prev(event, target){
			task.prev(target);
			refresh();
		}

		function refresh(){
			var page = task.current();

			if (page) {
				$scope.page = page;
			}
		}
	}

	function directive(){
		return {
			replace: true,
			controller: piQuestCtrl,
			template:template,
			link: function(scope, element, attr, ctrl) {
				// initiate controller
				ctrl.init();
			}
		};
	}

	return directive;
});

define('text!quest/directives/piQuest/piqPage.html',[],function () { return '<div ng-form name="pageForm">\n\t<div ng-if="page.progressBar" class="text-center" ng-bind-html="page.progressBar"></div>\n\t<h3 ng-if="page.header" ng-bind-html="page.header" ng-style="page.headerStyle"></h3>\n\t<ol ng-class="{\'list-unstyled\':!page.numbered}" start="{{page.numberStart}}">\n\t\t<li ng-repeat="quest in page.questions">\n\t\t\t<div quest-wrapper quest-data="quest" quest-current="current"></div>\n\t\t</li>\n\t</ol>\n\n\t<div class="btn-group pull-right">\n\t\t<button\n\t\t\tng-click="prev()"\n\t\t\tdata-role="submit"\n\t\t\tclass="btn"\n\t\t\tng-class="form"\n\t\t\tng-if="page.prev && page.$meta.number > 1"\n\t\t>{{page.prevText || "Go Back"}}</button>\n\n\t\t<button\n\t\t\tng-click="submit()"\n\t\t\tdata-role="submit"\n\t\t\tclass="btn btn-primary"\n\t\t\tng-class="form"\n\t\t\tng-disabled="pageForm.$invalid"\n\t\t\tng-if="!page.noSubmit"\n\t\t>{{page.submitText || "Submit"}}</button>\n\n\t\t<button\n\t\t\tng-click="decline()"\n\t\t\tdata-role="submit"\n\t\t\tclass="btn btn-warning"\n\t\t\tng-class="form"\n\t\t\tng-if="page.decline"\n\t\t>{{page.declineText || "Decline to Answer"}}</button>\n\t</div>\n\n\n</div>';});

/**
 * Main tag for piqPage component.
 * Used automaticaly from within the piQuest directive.
 *
 * This directive is responsible for:
 * 1. Displaying page questions.
 * 2. Detecting the end of a page (submit, TO).
 * 3. Harvesting information from the questions.
 * 4. Suplying information to the logger.
 *
 * @name piqPage
  */
define('quest/directives/piQuest/piqPage-directive',['require','text!./piqPage.html','underscore'],function (require) {
	var template = require('text!./piqPage.html');
	var _ = require('underscore');

	piqPageCtrl.$inject = ['$scope','$timeout', '$rootScope'];
	function piqPageCtrl($scope,$timeout, $rootScope){
		var self = this;

		$scope.global = $rootScope.global;
		$scope.current = $rootScope.current;

		/**
		 * Harvest piqPage questions, and log them.
		 */
		this.harvest = function(lognow){
			var questions = $scope.current.questions;

			_.each($scope.page.questions, function(q){
				// don't log if we don't have a name or if lognow is'nt true
				if (!q.name || !(lognow || q.lognow)){return;}

				// get the appropriate log
				var log = questions[q.name];

				// don't log if this has already been logged
				if (log.$logged){return;}

				// emit to quest directive
				$scope.$emit('quest:log', log, self.log);
				log.$logged = true;
			});
		};

		/**
		 * Proceed to next page.
		 *
		 * @name submit
		 * @param  {Boolean} skipValidation [Should skip validation of the form before submitting?]
		 */
		$scope.submit = function(skipValidation){
			var valid = $scope.pageForm.$valid;

			if (!valid && skipValidation !== true){
				return true;
			}

			// broadcast to the quest controller
			$scope.$broadcast('quest:submit');

			self.proceed();
			$scope.$emit('quest:next');
		};

		/**
		 * Decline to answer. mark all questions on this page as declined
		 */
		$scope.decline = function(){
			// broadcast to the quest controller
			$scope.$broadcast('quest:decline');

			self.proceed();
			$scope.$emit('quest:next');
		};

		/**
		 * Go back to previous page.
		 */
		$scope.prev = function(){
			// broadcast to the quest controller
			self.proceed();
			$scope.$broadcast('quest:prev');
		};


		/**
		 * Proceed to the next page.
		 * After canceling timeout, and harvesting.
		 * @todo: optional harvesting
		 */
		this.proceed = function(){

			// remove timeout if needed
			if (self.timeoutDeferred){
				$timeout.cancel(self.timeoutDeferred);
				delete(self.timeoutDeferred);
			}

			// by default, harvest after every page..
			self.harvest($scope.page.lognow);
		};

		// setup page on page refresh
		$scope.$watch('page', pageSetup);

		// refresh page on question change
		$scope.$watch('current.questions', pageRefresh, true);

		// listen for auto submit calls
		$scope.$on('quest:submit:now', function(){
			$scope.submit();
		});

		// change $scope.page
		// indirectly triggers pageSetup
		function pageRefresh(){
			$scope.$emit('quest:refresh');
		}

		function pageSetup(newPage, oldValue, scope){
			// set the page log object
			// @TODO: make sure log stays constant per page (or something... maybe move the startime into question. makes more sense.)
			self.log = {
				name: newPage.name,
				startTime: +new Date()
			};

			// If there is a timeout set, submit when it runs out.
			if (newPage.timeout){
				self.timeoutDeferred = $timeout(function(){
					self.log.timeout = true;
					scope.submit(true);
					/* global alert */
					newPage.timeoutMessage && alert(newPage.timeoutMessage);
				}, newPage.timeout);
			}
		}
	}

	function directive(){
		return {
			replace: true,
			controller: piqPageCtrl,
			template:template
		};
	}

	return directive;
});

define('text!quest/directives/wrapper/wrapper.html',[],function () { return '<div class="form-group">\n\t<label for="{{data.name}}" ng-bind-html="data.stem"></label>\n\t<div quest-data="data" ng-model="current.questions[data.name]"></div>\n\t<p class="help-block" ng-if="data.help" ng-bind-html="data.helpText"></p>\n</div>';});

/*
 * The directive for creating the generic question layout (stub, surrounding etc.).
 */
define('quest/directives/wrapper/wrapper-directive',['require','text!./wrapper.html'],function (require) {

	var prefix = 'quest';
	var template = require('text!./wrapper.html');

	function capitaliseFirstLetter(string){
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	directive.$inject = ['$compile', '$injector'];
	function directive($compile, $injector){
		return {
			replace: true,
			template:template,
			priority: 5, // Allows the wrapper to use the same scope as the questions
			scope:{
				data: '=questData',
				current: '=questCurrent'
			},
			link: function(scope,element) {
				var type = scope.data.type || 'text';
				var questElement = element.children().eq(1);
				var SNAKE_CASE_REGEXP = /[A-Z]/g;
				var attrName = prefix + capitaliseFirstLetter(type);

				// Make sure that this directive exists
				if (!$injector.has(attrName + 'Directive')){
					throw new Error ('Unknown question type: "' + type + '"');
				}

				// snake case the attr name
				attrName = attrName.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
					return (pos ? '-' : '') + letter.toLowerCase();
				});

				// add the appropriate attribute to the directive and compile it
				questElement.attr(attrName,true);
				$compile(questElement)(scope);
			}

		};
	}

	return directive;
});

define('text!quest/directives/text/text.html',[],function () { return '<div ng-form>\n\t<input\n\t \ttype="text"\n\t\tng-model="response"\n\t\tng-minlength="{{data.minlength}}"\n\t\tng-maxlength="{{data.maxlength}}"\n\t\tng-pattern="{{data.pattern}}"\n\t\tng-required="{{data.required}}"\n\t>\n\t<p class="error" ng-show="form.$error.minlength">{{data.errorMsg.minlength || "Too short!"}}</p>\n\t<p class="error" ng-show="form.$error.maxlength">{{data.errorMsg.maxlength || "Too long!"}}</p>\n\t<p class="error" ng-show="form.$error.pattern">{{data.errorMsg.pattern || "wrong pattern!"}}</p>\n\t<p class="error" ng-show="form.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n\t<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>';});

/*
 * The directive for creating text inputs.
 */
define('quest/directives/text/text-directive',['require','text!./text.html'],function (require) {
	// This is the only way to get a non js file relatively
	var template = require('text!./text.html');

	var directive = function(){
		return {
			replace: true,
			template:template,
			require: ['form', 'ngModel', '^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var form = ctrls[0];
				var ngModel = ctrls[1];

				scope.form = form;

				scope.ctrl.registerModel(ngModel, {
					dflt: ""
				});

				scope.data.autoSubmit && element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function(){
							scope.$emit('quest:submit:now');
						});
						event.preventDefault();
					}
				});
			}
		};
	};

	return directive;
});

define('text!quest/directives/text/text-number.html',[],function () { return '<div ng-form name="name{{$id}}">\n\t<input\n\t \ttype="number"\n\t\tng-model="response"\n\t\tng-required="{{data.required}}"\n\t>\n\t<p class="error" ng-show="form.$error.number">{{data.errorMsg.number || "Must be a number!"}}</p>\n\t<p class="error" ng-show="form.$error.min">{{data.errorMsg.min || "Too small!"}}</p>\n\t<p class="error" ng-show="form.$error.max">{{data.errorMsg.max || "Too big!"}}</p>\n\t<p class="error" ng-show="form.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n\t<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>';});


/*
 * The directive for creating textNumber inputs.
 */
define('quest/directives/text/text-number-directive',['require','text!./text-number.html'],function (require) {
	// This is the only way to get a non js file relatively
	var template = require('text!./text-number.html');

	var directive = function(){
		return {
			replace: true,
			template:template,
			require: ['form', 'ngModel', '^?piqPage'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {

				var form = ctrls[0];
				var input = element.find('input');
				var ngModel = input.eq(0).controller('ngModel');

				scope.form = form;

				scope.ctrl.registerModel(ctrls[1], {
					dflt: ""
				});

				scope.data.autoSubmit && element.bind("keydown keypress", function (event) {
					if(event.which === 13) {
						scope.$apply(function(){
							scope.$emit('quest:submit:now');
						});
						event.preventDefault();
					}
				});

				// we have a specific problem with min max that don't take internal
				// http://stackoverflow.com/questions/15656617/validation-not-triggered-when-data-binding-a-number-inputs-min-max-attributes
				var minValidator = function(value) {
					var min = parseFloat(scope.data.min);
					if (!isNaN(min) && value < min) {
						ngModel.$setValidity('qstMin', false);
						return undefined;
					} else {
						ngModel.$setValidity('qstMin', true);
						return value;
					}
				};

				ngModel.$parsers.push(minValidator);
				ngModel.$formatters.push(minValidator);

				var maxValidator = function(value) {
					var max = parseFloat(scope.data.max);
					if (!isNaN(max) && value > max) {
						ngModel.$setValidity('qstMax', false);
						return undefined;
					} else {
						ngModel.$setValidity('qstMax', true);
						return value;
					}
				};

				ngModel.$parsers.push(maxValidator);
				ngModel.$formatters.push(maxValidator);
			}
		};
	};

	return directive;
});
define('quest/directives/select/selectMixerProvider',['require','underscore'],function(require){

	var _ = require('underscore');

	selectMixerProvider.$inject = ['randomizeShuffle', 'mixerRecursive'];
	function selectMixerProvider(shuffle, mixer){

		function selectMixer(answersArr, options){
			var answers = mixer(answersArr);

			// inject values
			answers = _.map(answers, function(answer, index){

				if (!_.isPlainObject(answer)){
					answer = {text:answer};
				}

				if (_.isUndefined(answer.value)){
					answer.value = options.numericValues ? index + 1 : answer.text;
				}
				return answer;
			});

			if (options.reverse){
				answers = _(answers).reverse().value();
			}

			if (options.randomize){
				answers = shuffle(answers);
			}

			_.each(answers, function(answer,index){
				answer.order = index;
			});

			return answers;
		}

		return selectMixer;
	}

	return selectMixerProvider;
});

define('text!quest/directives/select/dropdown.html',[],function () { return '<div ng-form>\n\t<select\n\t\tng-model="response"\n\t\tng-options="answer.value as answer.text group by answer.group for answer in quest.answers"\n\t\tng-required="data.required"\n\t\tng-change="data.autoSubmit && autoSubmit($event)"\n\t\t>\n\t\t<option value="">{{chooseText || "-- Choose an option --"}}</option>\n\t</select>\n\t<p class="error" ng-show="form.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n\t<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>';});

/*
 * The directive for creating dropdown inputs.
 * scope.response is the value of the chosen response
 */
define('quest/directives/select/dropdownDirective',['require','text!./dropdown.html'],function (require) {

	// This is the only way to get a non js file relatively
	var template = require('text!./dropdown.html');

	directive.$inject = ['questSelectMixer'];
	function directive(mixer){
		return {
			replace: true,
			template:template,
			require: ['ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ngModel = ctrls[0];
				var ctrl = scope.ctrl;

				ctrl.registerModel(ngModel, {
					dflt: NaN
				});

				// render quest if needed
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// createChooseText
				scope.chooseText = "chooseText" in scope.data && scope.data.chooseText;

				/**
				 * Manage auto submit
				 */
				scope.autoSubmit = function(){
					scope.$emit('quest:submit:now');
				};
			}
		};
	}

	return directive;
});

define('text!quest/directives/select/selectOne.html',[],function () { return '<div required="{{data.required}}">\n\t<div ng-class="{\'list-group\':!data.buttons, \'btn-group btn-group-justified btn-group-lg\':data.buttons}">\n\t\t<!-- track by in the ng-repeat allows us to keep the repeated object clean so that angular doesn\'t add a $$hashkey property -->\n\t\t<a\n\t\t\ttabindex="-1"\n\t\t\tng-repeat="answer in quest.answers track by answer.order"\n\t\t\tng-model="$parent.responseObj"\n\t\t\tbtn-radio="answer"\n\t\t\tng-class="{active:$parent.response === answer.value, \'list-group-item\': !$parent.data.buttons, \'btn btn-success\': $parent.data.buttons}"\n\t\t\tuncheckable\n\t\t\tng-click="data.autoSubmit && autoSubmit($event)"\n\t\t\tng-bind-html="answer.text"\n\t\t></a>\n\t</div>\n\t<p class="error" ng-show="model.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n\t<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>';});

/*
 * The directive for creating selectOne inputs.
 *
 * scope.response is the value of the chosen response
 * scope.responseObj is the full answer object or undefined
 */
define('quest/directives/select/selectOneDirective',['require','text!./selectOne.html','angular'],function (require) {

	// This is the only way to get a non js file relatively
	var template = require('text!./selectOne.html');
	var angular = require('angular');

	directive.$inject = ['questSelectMixer', 'buttonConfig'];
	function directive(mixer, buttonConfig){
		return {
			replace: true,
			template:template,
			require: ['ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ngModel = ctrls[0];
				var ctrl = scope.ctrl;

				ctrl.registerModel(ngModel, {
					dflt: NaN
				});

				// render quest if needed
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// update controller with the response
				scope.$watch('responseObj',function(newValue, oldValue){
					if (newValue === oldValue){
						return;
					}

					scope.response = newValue && newValue.value;
				});

				/**
				 * Manage auto submit
				 * @param  {event} e [description]
				 */
				scope.autoSubmit = function(e){
					if (!scope.data.autoSubmit){
						return;
					}

					var isActive = angular.element(e.target).hasClass(buttonConfig.activeClass);

					if (isActive){
						// this whole function happens within a digest cycle, so we don't need to $apply
						scope.$emit('quest:submit:now');
					}
				};
			}
		};
	}

	return directive;
});

define('text!quest/directives/select/selectMulti.html',[],function () { return '<div required="{{data.required}}">\n\t<div class="list-group" >\n\t\t<!-- track by in the ng-repeat allows us to keep the repeated object clean so that angular doesn\'t add a $$hashkey property -->\n\t\t<a\n\t\t\thref="javascript:void(0);"\n\t\t\tng-repeat="answer in quest.answers track by answer.order"\n\t\t\tclass="list-group-item"\n\t\t\tng-model="answer.chosen"\n\t\t\tbtn-checkbox\n\t\t\tng-class="{active:answer.chosen}"\n\t\t\tuncheckable\n\t\t\tng-bind-html="answer.text"\n\t\t>\n\t\t</a>\n\t</div>\n\t<p class="error" ng-show="model.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n\t<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>';});

/*
 * The directive for creating selectMulti inputs.
 */
define('quest/directives/select/selectMultiDirective',['require','underscore','text!./selectMulti.html'],function (require) {
	var _ = require('underscore');

	// This is the only way to get a non js file relatively
	var template = require('text!./selectMulti.html');

	directive.$inject = ['questSelectMixer'];
	function directive(mixer){
		return {
			replace: true,
			template:template,
			require: ['^?piqPage', 'ngModel'],
			controller: 'questController',
			controllerAs: 'ctrl',
			scope:{
				data: '=questData'
			},
			link: function(scope, element, attr, ctrls) {
				var ctrl = scope.ctrl;
				var ngModel = ctrls[1];

				ctrl.registerModel(ngModel, {
					dflt: []
				});

				ngModel.$isEmpty = function(){
					return _.isEmpty(ngModel.$viewValue);
				};

				// render questions
				scope.quest = {
					answers: mixer(scope.data.answers || [], scope.data)
				};

				// mark the chosen questions
				_.each(scope.quest.answers, function(answer){
					// mark it chosen if
					if (~_.indexOf(scope.response, answer.value)){
						answer.chosen = true;
					}
				});

				// update controller with the response
				scope.$watch('quest.answers',function(newValue, oldValue){
					if (newValue === oldValue){
						return;
					}

					// get chosen answers
					scope.response = _(newValue)
						.filter(function(answer){return answer.chosen;})
						.pluck('value')
						.value();
				},true); // deep watch
			}
		};
	}

	return directive;
});
define('quest/directives/questDirectivesModule',['require','angular','utils/timer/timer-module','./buttons/buttons','utils/template/templateModule','./questController','./piQuest/piQuest-directive','./piQuest/piqPage-directive','./wrapper/wrapper-directive','./text/text-directive','./text/text-number-directive','./select/selectMixerProvider','./select/dropdownDirective','./select/selectOneDirective','./select/selectMultiDirective'],function(require){
	var angular = require('angular');
	require('utils/timer/timer-module');
	require('./buttons/buttons');
	require('utils/template/templateModule');

	// set modules that are requirements for the quest module
	var module = angular.module('questDirectives',['timer', 'ui.bootstrap.buttons', 'template']);

	module.controller('questController', require('./questController'));
	module.directive('piQuest', require('./piQuest/piQuest-directive'));
	module.directive('piqPage', require('./piQuest/piqPage-directive'));
	module.directive('questWrapper', require('./wrapper/wrapper-directive'));
	module.directive('questText', require('./text/text-directive'));
	module.directive('questTextNumber', require('./text/text-number-directive'));

	module.service('questSelectMixer', require('./select/selectMixerProvider'));
	module.directive('questDropdown',require('./select/dropdownDirective'));
	module.directive('questSelectOne',require('./select/selectOneDirective'));
	module.directive('questSelectMulti',require('./select/selectMultiDirective'));

	return module;
});

/*
 *	The logger Object
 *	Logger(settings)
 *	@param settings: the settings for this logger (defaults to the settings defined on loggerProvider.settings)
 *	settings = {
 *		pulse: 34, // after how many objects should we post
 *		url: '/my/url', // where should we post to
 *		meta: an object that extends each log
 *		DEBUG: false // activate logging each object to the console
 *	}
 *
 *	methods:
 *
 *	log(obj) - add an object to the log stack
 *	@param obj: any object that we want to log (as long as it is defined)
 *
 *	send() - send any remaining objects to the server
 *
  */
define('utils/logger/LoggerProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	loggerProvider.$inject = ['$http','$q', '$log'];
	function loggerProvider($http, $q, $log){
		var self = this;

		function Logger(dfltLogFn){
			this.pending = [];
			this.sent = [];
			this.settings = {};
			this.meta = {};
			this.dfltLogFn = dfltLogFn || function(){return arguments[0];};
		}

		_.extend(Logger.prototype, {
			log: function(){
				var settings = this.settings;
				var logObj = (settings.logFn || this.dfltLogFn).apply(settings, arguments);

				if (!_.isEmpty(this.meta) && !_.isPlainObject(logObj)){
					settings.DEBUG && $log.log(logObj);
					throw new Error('Logger: in order to use "meta" the log must be an object.');
				}

				_.extend(logObj, this.meta);

				// if debug, then log this object
				settings.DEBUG && $log.log(logObj);

				this.pending.push(logObj);
				self.logCounter++;
				if (settings.pulse && this.pending.length >= settings.pulse){
					this.send();
				}
			},

			send: function(){
				var i;
				var settings = this.settings;
				var sendData = this.pending;
				var def = $q.defer();

				// if there are no records to send...
				if (sendData.length === 0){
					return def.resolve();
				}

				if (_.isUndefined(settings.url)){
					throw new Error('The logger url is not set.');
				}

				// empty the pending stack
				this.pending = [];

				$http.post(settings.url, sendData).then(success, error);

				// move everything pending to the sent stack
				for (i = 0; i<sendData.length; i++){
					this.sent.push(sendData[i]);
				}

				function success(){
					def.resolve();
				}

				function error(){
					// try again
					$http.post(settings.url, sendData).then(success, function(){
						throw new Error('Failed to send data, it seems the backend is not responding.');
					});
				}
			},

			getCount: function(){
				return self.logCounter;
			},

			setSettings: function(settings){
				if (arguments.length === 0){
					return this.settings;
				}

				// inherit settings both from settings obj, and the global settings
				this.settings = _.defaults({}, settings, self.settings);

				if (!_.isUndefined(settings.meta) && !_.isPlainObject(settings.meta)){
					throw new Error('Logger: "meta" must be an object.');
				}

				// inherit meta settings
				this.meta = _.defaults({}, settings.meta, self.meta);
			}
		});

		return Logger;
	}

	return function(){
		this.$get = loggerProvider;
		this.settings = {};
		this.meta = {};
		this.logCounter = 0;
	};
});
define('utils/logger/logger-module',['require','angular','./LoggerProvider'],function(require){
	var angular = require('angular');
	var Logger = require('./LoggerProvider');

	var module = angular.module('logger', []);
	module.provider('Logger', Logger);

	return module;
});
/**
 * An assortment of useful randomization functions.
 * Good so we can easily mock them...
 */
define('utils/randomize/randomizeModule',['require','angular','underscore'],function(require){
	var angular = require('angular');
	var _ = require('underscore');
	var module = angular.module('randomize', []);

	/**
	 * Just plain random
	 */

	module.value('randomizeRandom', function(){
		return Math.random();
	});

	/**
	 * Just lodash shuffle...
	 */
	module.value('randomizeShuffle', _.shuffle);

	/*
	 * a function that returns a random integer between 0 and length
	 * @param length: the upper boundary to the randomization.
	 */
	module.value('randomizeInt', function randomInt(length){
		return Math.floor(Math.random()*length);
	});

	/**
	 * a function that returns a random array of integers between 0 and length
	 * @param length: the upper boundary to the randomization.
	 */
	module.value('randomizeRange', function randomArr(length){
		return _.shuffle(_.range(length));
	});
});
define('utils/database/databaseProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	DatabaseProvider.$inject = ['DatabaseStore', 'DatabaseRandomizer', 'databaseInflate'];
	function DatabaseProvider(Store, Randomizer, inflate){

		function Database(){
			this.store = new Store();
			this.randomizer = new Randomizer();
		}

		_.extend(Database.prototype, {
			inflate: function(namespace, query){
				var coll = this.store.read(namespace);
				return inflate(query, coll, this.randomizer);
			},
			createColl: function(namespace){
				this.store.create(namespace);
			},
			add: function(namespace, obj){
				var coll = this.store.read(namespace);
				coll.add(obj);
			}
		});

		return Database;
	}

	return DatabaseProvider;
});
define('utils/database/collectionProvider',['underscore'],function(_){
	/*
	 * The constructor for an Array wrapper
	 */

	function collectionService(){

		function Collection (arr) {
			if (arr instanceof Collection) {
				return arr;
			}

			// Make sure we are creating this array out of a valid argument
			if (!_.isUndefined(arr) && !_.isArray(arr) && !(arr instanceof Collection)) {
				throw new Error('Collections can only be constructed from arrays');
			}

			this.collection = arr || [];
			this.length = this.collection.length;

			// pointer to the current location within the array
			// we start with -1 so that the initial next points to the begining of the array
			this.pointer = -1;
		}

		_.extend(Collection.prototype,{

			first : function first(){
				this.pointer = 0;
				return this.collection[this.pointer];
			},

			last : function last(){
				this.pointer = this.collection.length - 1;
				return this.collection[this.pointer];
			},

			end : function end(){
				this.pointer = this.collection.length;
				return undefined;
			},

			current : function(){
				return this.collection[this.pointer];
			},

			next : function(){
				return this.collection[++this.pointer];
			},

			previous : function(){
				return this.collection[--this.pointer];
			},

			// add list of items to the collection
			add : function(list){
				// dont allow adding nothing
				if (!arguments.length) {
					return this;
				}

				// make sure list is as an array
				list = _.isArray(list) ? list : [list];
				this.collection = this.collection.concat(list);

				this.length = this.collection.length;

				return this;
			},

			// return the item at index
			at: function(index){
				return this.collection[index];
			}
		});


		// Stuff we took out of bootstrap that can augment the collection
		// **************************************************************
		var methods = ['where','filter'];
		var slice = Array.prototype.slice;

		// Mix in each Underscore method as a proxy to `Collection#models`.
		_.each(methods, function(method) {
			Collection.prototype[method] = function() {
				var args = slice.call(arguments);
				args.unshift(this.collection);
				var coll = _[method].apply(_,args);
				return new Collection(coll);
			};
		});

		return Collection;
	}

	return collectionService;


});
define('utils/database/randomizerProvider',['underscore'],function(_){

	RandomizerProvider.$inject = ['randomizeInt', 'randomizeRange', 'Collection'];
	function RandomizerProvider(randomizeInt, randomizeRange, Collection){

		function Randomizer(){
			this._cache = {
				random : {},
				exRandom : {},
				sequential : {}
			};
		}

		_.extend(Randomizer.prototype, {
			random: random,
			exRandom: exRandom,
			sequential: sequential
		});

		return Randomizer;

		function random(length, seed, repeat){
			var cache  = this._cache.random;

			if (repeat && !_.isUndefined(cache[seed])) {
				return cache[seed];
			}

			// save result in cache
			cache[seed] = randomizeInt(length);

			return cache[seed];
		}

		function sequential(length, seed, repeat){
			var cache = this._cache.sequential;
			var coll = cache[seed];
			var result;

			// if needed create collection and set it in seed
			if (_.isUndefined(coll)){
				coll = cache[seed] = new Collection(_.range(length));
				return coll.first();
			}

			if (coll.length !== length){
				throw new Error("This seed  ("+ seed +") points to a collection with the wrong length, you can only use a seed for sets of the same length");
			}

			// if this is a repeated element:
			if (repeat) {
				return coll.current();
			}

			// if we've reached the end
			result = coll.next();

			// if we've reached the end of the collection (next)
			if (_.isUndefined(result)){
				return coll.first();
			} else {
				return result;
			}
		}

		function exRandom(length, seed, repeat){
			var cache = this._cache.exRandom;
			var coll = cache[seed];
			var result;

			// if needed create collection and set it in seed
			if (_.isUndefined(coll)){
				coll = cache[seed] = new Collection(randomizeRange(length));
				return coll.first();
			}

			if (coll.length !== length){
				throw new Error("This seed  ("+ seed +") points to a collection with the wrong length, you can only use a seed for sets of the same length");
			}

			// if this is a repeated element:
			if (repeat) {
				return coll.current();
			}

			// if we've reached the end
			result = coll.next();

			// if we've reached the end of the collection (next)
			// we should re-randomize
			if (_.isUndefined(result)){
				coll = cache[seed] = new Collection(randomizeRange(length));
				return coll.first();
			} else {
				return result;
			}
		}

	}

	return RandomizerProvider;

});
/*
 *	The store is a collection of collection devided into namespaces.
 *	You can think of every namespace/collection as a table.
 */
define('utils/database/storeProvider',['underscore'],function(_){

	storeProvider.$inject = ['Collection'];
	function storeProvider(Collection){

		function Store(){
			this.store = {};
		}

		_.extend(Store.prototype, {
			create: function create(nameSpace){
				if (this.store[nameSpace]){
					throw new Error('The name space ' + nameSpace + ' already exists');
				}
				this.store[nameSpace] = new Collection();
			},

			read: function read(nameSpace){
				if (!this.store[nameSpace]){
					throw new Error('The name space ' + nameSpace + ' does not exist');
				}
				return this.store[nameSpace];
			},

			update: function update(nameSpace, data){
				var coll = this.read(nameSpace);
				coll.add(data);
			},

			del: function del(nameSpace){
				this.store[nameSpace] = undefined;
			}
		});

		return Store;
	}

	return storeProvider;
});
define('utils/database/queryProvider',['underscore'],function(_){

	queryProvider.$inject = ['Collection'];
	function queryProvider(Collection){

		function queryFn(query, collection, randomizer){
			var coll = new Collection(collection);

			// shortcuts:
			// ****************************

			// use function instead of query object.
			if (_.isFunction(query)){
				return query(collection);
			}

			// pure string query
			if (_.isString(query) || _.isNumber(query)){
				query = {set:query, type:'random'};
			}

			// narrow down by set
			// ****************************
			if (query.set){
				coll = coll.where({set:query.set});
			}

			// narrow down by data
			// ****************************
			if (_.isPlainObject(query.data)){
				coll = coll.where({data:query.data});
			}

			if (_.isFunction(query.data)){
				coll = coll.filter(query.data);
			}

			// pick by type
			// ****************************

			var seed = query.seed || query.set;
			var length = coll.length;
			var repeat = query.repeat;
			var at;

			switch (query.type){
				case undefined:
				case 'byData':
				case 'random':
					at = randomizer.random(length,seed,repeat);
					break;
				case 'exRandom':
					at = randomizer.exRandom(length,seed,repeat);
					break;
				case 'sequential':
					at = randomizer.sequential(length,seed,repeat);
					break;
				case 'first':
					at = 0;
					break;
				case 'last':
					at = length-1;
					break;
				default:
					throw new Error('Unknow query type: ' + query.type);
			}

			if (_.isUndefined(coll.at(at))) {
				throw new Error('Query failed, object (' + JSON.stringify(query) +	') not found. If you are trying to apply a template, you should know that they are not supported for inheritance.');
			}

			return coll.at(at);
		}

		return queryFn;
	}

	return queryProvider;
});
/*
 * inflates an object
 * this function is responsible for inheritance
 *
 * function inflate(source,coll, randomizer, recursive, counter)
 * @param source: the object to inflate
 * @param coll: a collection to inherit from
 * @param randomizer: a randomizer object for the query
 * @param recursive: private use only, is this inside the recursion (true) or top level (false)
 * @param depth: private use only, a counter for the depth of the recursion
 */
define('utils/database/inflateProvider',['require','angular','underscore'],function(require){
	var angular = require('angular');
	var _ = require('underscore');

	inflateProvider.$inject = ['databaseQuery','$rootScope'];
	function inflateProvider(query, $rootScope){

		function customize(source){
			// check for a custom function and run it if it exists
			if (_.isFunction(source.customize)){
				source.customize.apply(source, [source, $rootScope.global]);
			}
			return source;
		}

		// @param source - object to inflate
		// @param type - trial stimulus or media
		// @param recursive - whether this is a recursive call or not
		var inflate = function(source, coll, randomizer, recursive, depth){

			// protection against infinte loops
			// ***********************************
			depth = recursive ? --depth : 10;

			if (!depth) {
				throw new Error('Inheritance loop too deep, you can only inherit up to 10 levels down');
			}

			if (!_.isPlainObject(source)){
				throw new Error('You are trying to inflate a non object');
			}

			var parent
				// create child
				, child = angular.copy(source);


			// no inheritance
			// ***********************************

			// if we do not need to inherit anything, simply return source
			if (!child.inherit) {
				// customize only on the last call (non recursive)
				!recursive && customize(child);
				return child;
			}

			// get parent
			// ***********************************
			parent = query(source.inherit, coll, randomizer);

			// if inherit target was not found
			if (!parent){
				throw new Error('Query failed, object (' + JSON.stringify(source.inherit) +	') not found.');
			}

			// inflate parent (recursively)
			parent = inflate(
				parent,
				coll,
				randomizer,
				true,
				depth
			);

			// extending the child
			// ***********************************

			// start inflating child (we have to extend selectively...)
			_.each(parent, function(value, key){
				// if this key is not set yet, copy it out of the parent
				if (!(key in child)){
					child[key] = angular.copy(value);
				}
			});

			// we want to extend the childs data even if it already exists
			// its ok to shallow extend here (because by definition parent was created for this inflation)
			if (parent.data){
				child.data = angular.extend(parent.data, child.data || {});
			}

			// Personal customization functions - only if this is the last iteration of inflate
			// This way the customize function gets called only once.
			!recursive && customize(child);

			// return inflated trial
			return child;
		};

		return inflate;
	}

	return inflateProvider;
});
define('utils/database/database-module',['require','utils/randomize/randomizeModule','angular','./databaseProvider','./collectionProvider','./randomizerProvider','./storeProvider','./queryProvider','./inflateProvider'],function(require){


	require('utils/randomize/randomizeModule');

	var
		angular = require('angular'),
		Database = require('./databaseProvider'),
		Collection = require('./collectionProvider'),
		Randomizer = require('./randomizerProvider'),
		Store = require('./storeProvider'),
		query = require('./queryProvider'),
		inflate = require('./inflateProvider');

	var module = angular.module('database',['randomize'])
		.service('Collection', Collection)
		.service('DatabaseRandomizer', Randomizer)
		.service('databaseQuery', query)
		.service('databaseInflate', inflate)
		.service('DatabaseStore', Store)
		.service('Database', Database);

	return module;
});
define('utils/mixer/mixer',['underscore'],function(_){

	/**
	 * A function that maps a mixer object into a sequence.
	 *
	 * The basic structure of such an obect is:
	 * {
	 *		mixer: 'functionType',
	 *		remix : false,
	 *		data: [task1, task2]
	 *	}
	 *
	 * The results of the mix are set into `$parsed` within the original mixer object.
	 * if remix is true $parsed is returned instead of recomputing
	 *
	 * @param {Object} [obj] [a mixer object]
	 * @returns {Array} [An array of mixed objects]
	 */

	mixProvider.$inject = ['randomizeShuffle', 'randomizeRandom'];
	function mixProvider(shuffle, random){

		function mix(obj){
			var mixerName = obj.mixer;

			// if this isn't a mixer
			// make sure we catch mixers that are set with undefined by accident...
			if (!(_.isPlainObject(obj) && 'mixer' in obj)){
				return [obj];
			}

			if (_.isUndefined(mix.mixers[mixerName])){
				throw new Error('Mixer: unknow mixer type = ' + mixerName);
			}

			if (!obj.remix && obj.$parsed) {
				return obj.$parsed;
			}

			obj.$parsed = mix.mixers[mixerName].apply(null, arguments);

			return obj.$parsed;
		}

		mix.mixers = {
			wrapper : function(obj){
				return obj.data;
			},

			repeat: function(obj){
					var sequence = obj.data || [];
					var result = [], i;
					for (i=0; i < obj.times; i++){
						result = result.concat(_.clone(sequence,true));
					}
					return result;
			},

			random: function(obj){
				var sequence = obj.data || [];
				return shuffle(sequence);
			},

			choose: function(obj){
				var sequence = obj.data || [];
				return _.first(shuffle(sequence), obj.n ? obj.n : 1);
			},

			weightedRandom: function(obj){
				var sequence = obj.data || [];
				var i;
				var total_weight = _.reduce(obj.weights,function (prev, cur) {
					return prev + cur;
				});

				var random_num = random() * total_weight; // cutoff - when we reach this sum - we've reached the desired weight
				var weight_sum = 0;

				for (i = 0; i < sequence.length; i++) {
					weight_sum += obj.weights[i];
					weight_sum = +weight_sum.toFixed(3);

					if (random_num <= weight_sum) {
						return [obj.data[i]];
					}
				}
				throw new Error('Mixer: something went wrong with weightedRandom');
			}
		};

		return mix;
	}

	return mixProvider;
});
define('utils/mixer/mixerSequential',['require','underscore'],function(require){
	var _ = require('underscore');

	mixerSequentialProvider.$inject = ['mixer'];
	function mixerSequentialProvider(mix){
		function mixerSequential(sequence, context, depth){
			var mixed;
			var obj = sequence[0];

			depth = depth || 0;
			if (depth++ >= 10){
				throw new Error('Mixer: the mixer allows a maximum depth of 10');
			}

			if (_.isUndefined(obj.mixer)){
				return sequence;
			}

			// mix obj
			mixed = mix(obj, context);

			// remove obj from sequence
			sequence.shift();

			// concat mixed and sequence
			mixed = mixed.concat(sequence);

			return _.isUndefined(mixed[0]) || _.isUndefined(mixed[0].mixer) ? mixed : mixerSequential(mixed, context, depth);
		}

		return mixerSequential;
	}

	return mixerSequentialProvider;
});
define('utils/mixer/mixerRecursive',['require','underscore'],function(require){
	var _ = require('underscore');

	mixerRecursiveProvider.$inject = ['mixer'];
	function mixerRecursiveProvider(mix){
		function mixerRecursive(sequence, context, depth){
			var mixed = [];

			depth = depth || 0;
			if (depth++ >= 10){
				throw new Error('Mixer: the mixer allows a maximum depth of 10');
			}

			mixed = _(sequence)
				.map(function(obj){

					if (_.isUndefined(obj.mixer)){
						return obj;
					}

					// mix object, and recursively mix the result
					return mixerRecursive(mix(obj, context), context, depth);
				})
				.flatten()
				.value();

			return mixed;
		}

		return mixerRecursive;
	}

	return mixerRecursiveProvider;
});
define('utils/mixer/mixerSequenceProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	mixerSequenceProvider.$inject = ['mixer'];
	function mixerSequenceProvider(mix){

		/**
		 * MixerSequence takes an mixer array and allows browsing back and forth within it
		 * @param {Array} arr [a mixer array]
		 */
		function MixerSequence(arr){
			this.sequence = arr;
			this.stack = [];
			this.add(arr);
		}

		_.extend(MixerSequence.prototype, {
			/**
			 * Add sequence to mixer
			 * @param {[type]} arr     Sequence
			 * @param {[type]} reverse Whether to start from begining or end
			 */
			add: function(arr, reverse){
				this.stack.push({pointer:reverse ? arr.length : -1,sequence:arr});
			},

			proceed: function(direction, context){
				// get last subSequence
				var subSequence = this.stack[this.stack.length-1];
				var isNext = (direction === 'next');

				// if we ran out of sequence
				// add the original sequence back in
				if (!subSequence) {
					throw new Error ('mixerSequence: subSequence not found');
				}

				subSequence.pointer += isNext ? 1 : -1;

				var el = subSequence.sequence[subSequence.pointer];

				// if we ran out of elements, go to previous level (unless we are on the root sequence)
				if (_.isUndefined(el) && this.stack.length > 1){
					this.stack.pop();
					return this.proceed.call(this,direction,context);
				}

				// if element is a mixer, mix it
				if (el && el.mixer){
					this.add(mix(el,context), !isNext);
					return this.proceed.call(this,direction,context);
				}

				// regular element or undefined (end of sequence)
				return this;
			},

			next: function(context){
				return this.proceed.call(this, 'next',context);
			},

			prev: function(context){
				return this.proceed.call(this, 'prev',context);
			},

			/**
			 * Return current element
			 * should **never** return a mixer - supposed to abstract them away
			 * @return {[type]} undefined or element
			 */
			current:function(){
				// get last subSequence
				var subSequence = this.stack[this.stack.length-1];

				if (!subSequence) {
					throw new Error ('mixerSequence: subSequence not found');
				}

				var el = subSequence.sequence[subSequence.pointer];

				if (!el){
					return undefined;
				}

				// extend element with meta data
				el.$meta = this.meta();

				return el;
			},

			meta: function(){
				return {
					// sum of pointers + 1
					number: _.reduce(this.stack, function(memo,sub){return memo + sub.pointer;},0) + 1,

					// sum of sequence length, minus one (the mixer) for each level of stack except the last
					outOf:  _.reduce(this.stack, function(memo,sub){return memo + sub.sequence.length-1;},0)+1
				};
			}

		});

		return MixerSequence;
	}

	return mixerSequenceProvider;
});






define('utils/mixer/branching/dotNotation',['require','underscore'],function(require){
	var _ = require('underscore');

	function dotNotation(chain, obj){

		if (_.isString(chain)){
			chain = chain.split('.');
		}

		return _.reduce(chain, function(result, link){

			if (_.isPlainObject(result) || _.isArray(result)){
				return result[link];
			}

			return undefined;

		}, obj);
	}

	return dotNotation;
});
define('utils/mixer/branching/mixerDotNotationProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	mixerDotNotationProvider.$inject = ['dotNotation'];
	function mixerDotNotationProvider(dotNotation){

		function mixerDotNotation(chain, obj){

			var escapeSeparatorRegex= /[^\/]\./;

			if (!_.isString(chain)){
				return chain;
			}

			// We do not have a non escaped dot: we treat this as a string
			if (!escapeSeparatorRegex.test(chain)){
				return chain.replace('/.','.');
			}

			return dotNotation(chain, obj);
		}

		return mixerDotNotation;
	}

	return mixerDotNotationProvider;

});
define('utils/mixer/branching/mixerConditionProvider',['require','underscore','angular'],function(require){
	var _ = require('underscore');
	var angular = require('angular');


	mixerConditionProvider.$inject = ['mixerDotNotation', '$log'];
	function mixerConditionProvider(dotNotation, $log){

		function mixerCondition(condition, context){
			// @TODO angular.$parse may be a better candidate for doing this...
			var left = dotNotation(condition.compare,context);
			var right = dotNotation(condition.to,context);
			var operator = condition.operator;

			condition.DEBUG && $log.log('Condition DEBUG: ', left, operator || 'equals', right, condition);

			if (_.isFunction(operator)){
				return !! operator.apply(context,[left, right]);
			}

			switch(operator){
				case 'greaterThan':
					if (_.isNumber(left) && _.isNumber(right)){
						return +left > +right;
					}
					return false;

				case 'greaterThanOrEqual':
					if (_.isNumber(left) && _.isNumber(right)){
						return +left >= +right;
					}
					return false;

				case 'in':
					if (_.isArray(right)){
						// binary operator to turn indexOf into binary.
						return ~_.indexOf(right, left);
					}
					return false;

				case 'exactly':
					return left === right;

				case 'equals':
					/* falls through */
				default:
					if (_.isUndefined(right)){
						return !!left;
					}
					return angular.equals(left, right);
			}

			return operator;
		}

		return mixerCondition;
	}

	return mixerConditionProvider;
});
define('utils/mixer/branching/mixerEvaluateProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	evaluateProvider.$inject = ['mixerCondition'];
	function evaluateProvider(condition){
		/**
		 * Checks if a conditions set is true
		 * @param  {Array} conditions [an array of conditions]
		 * @param  {Object} context   [A context for the condition checker]
		 * @return {Boolean}          [Are these conditions true]
		 */

		function evaluate(conditions,context){
			// make && the default
			_.isArray(conditions) && (conditions = {and:conditions});

			function test(cond){return evaluate(cond,context);}

			// && objects
			if (conditions.and){
				return _.every(conditions.and, test);
			}
			if (conditions.nand){
				return !_.every(conditions.nand, test);
			}

			// || objects
			if (conditions.or){
				return _.some(conditions.or, test);
			}
			if (conditions.nor){
				return !_.some(conditions.nor, test);
			}

			return condition(conditions, context);
		}

		return evaluate;
	}

	return evaluateProvider;
});
/**
 * Registers the branching mixers with the mixer
 * @return {function}         [mixer decorator]
 */
define('utils/mixer/branching/mixerBranchingDecorator',['require','underscore'],function(require){

	var _ = require('underscore');

	mixerBranchingDecorator.$inject = ['$delegate','mixerEvaluate','mixerDefaultContext'];
	function mixerBranchingDecorator(mix, evaluate, mixerDefaultContext){

		mix.mixers.branch = branch;
		mix.mixers.multiBranch = multiBranch;

		return mix;

		/**
		 * Branching mixer
		 * @return {Array}         [A data array with objects to continue with]
		 */
		function branch(obj, context){
			context = _.extend(context || {}, mixerDefaultContext);
			return evaluate(obj.conditions, context) ? obj.data : obj.elseData || [];
		}

		/**
		 * multiBranch mixer
		 * @return {Array}         [A data array with objects to continue with]
		 */
		function multiBranch(obj, context){
			context = _.extend(context || {}, mixerDefaultContext);
			var row;

			row = _.find(obj.branches, function(branch){
				return evaluate(branch.conditions, context);
			});

			if (row) {
				return row.data || [];
			}

			return obj.elseData || [];
		}
	}

	return mixerBranchingDecorator;
});
define('utils/mixer/mixer-module',['require','utils/randomize/randomizeModule','angular','./mixer','./mixerSequential','./mixerRecursive','./mixerSequenceProvider','./branching/dotNotation','./branching/mixerDotNotationProvider','./branching/mixerConditionProvider','./branching/mixerEvaluateProvider','./branching/mixerBranchingDecorator'],function(require){
	require('utils/randomize/randomizeModule');

	var angular = require('angular');
	var module = angular.module('mixer',['randomize']);

	module.service('mixer', require('./mixer'));
	module.service('mixerSequential', require('./mixerSequential'));
	module.service('mixerRecursive', require('./mixerRecursive'));
	module.service('MixerSequence', require('./mixerSequenceProvider'));


	module.value('dotNotation', require('./branching/dotNotation'));
	module.service('mixerDotNotation', require('./branching/mixerDotNotationProvider'));
	module.service('mixerCondition', require('./branching/mixerConditionProvider'));
	module.service('mixerEvaluate', require('./branching/mixerEvaluateProvider'));
	module.config(['$provide', function($provide){
		$provide.decorator('mixer', require('./branching/mixerBranchingDecorator'));
	}]);
	module.constant('mixerDefaultContext', {});



	return module;
});
define('quest/task/questSequenceProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	SequenceProvider.$inject = ['TaskSequence'];
	function SequenceProvider(TaskSequence){

		function Sequence(arr, db){
			if (!db){
				throw new Error('Sequences need to take a db as the second argument');
			}

			this.sequence = new TaskSequence('pages', arr, db);
			this.db = db;
		}

		_.extend(Sequence.prototype, {
			next: function(context){
				this.sequence.next(context);
				return this;
			},

			prev: function(context){
				this.sequence.prev(context);
				return this;
			},

			current: function(context){
				var page = this.sequence.current(context);

				if (!page){
					return page;
				}

				var questions = new TaskSequence('questions', page.questions, this.db).all({
					pagesData: page.data,
					pagesMeta: page.$meta
				});

				// make sure we don't lose any thing in the orginal page
				// @TODO: this seems extremely expensive. Is this really neccesary?
				page = _.clone(page, true);
				page.questions = questions;

				return page;
			}
		});

		return Sequence;
	}

	return SequenceProvider;
});
define('quest/task/taskSequenceProvider',['require','underscore'],function(require){
	var _ = require('underscore');

	SequenceProvider.$inject = ['MixerSequence', 'templateObj'];
	function SequenceProvider(MixerSequence, templateObj){

		/**
		 * Sequence Constructor:
		 * Manage the progression of a sequence, including parsing (mixing, inheritance and templating).
		 * @param  {String  } namespace [pages or questions (the type of db.Store)]
		 * @param  {Array   } arr       [a sequence to manage]
		 * @param  {Database} db        [the db itself]
		 */

		function Sequence(namespace, arr,db){
			this.namespace = namespace;
			this.mixerSequence = new MixerSequence(arr);
			this.db = db;
		}

		_.extend(Sequence.prototype, {
			// only mix
			next: function(context){
				this.mixerSequence.next(context);
				return this;
			},

			// anti mix
			prev: function(context){
				this.mixerSequence.prev(context);
				return this;
			},

			/**
			 * Return the element currently in focus.
			 * It always returns either an element or undefined (mixers are abstrcted away)
			 * @param  {[type]} context [description]
			 * @return {[type]}         [description]
			 */
			current: function(context){
				context || (context = {});
				// must returned an element or undefined
				var obj = this.mixerSequence.current(context);

				// in case this is the end of the sequence
				if (!obj){
					return obj;
				}

				// inflate
				if (!obj.$inflated || obj.reinflate) {
					obj.$inflated = this.db.inflate(this.namespace, obj);
				}

				// interpolate
				if (!obj.$templated || obj.regenerateTemplate){
					context[this.namespace + 'Data'] = obj.data || {};
					context[this.namespace + 'Meta'] = obj.$meta;
					obj.$templated = templateObj(obj.$inflated, context);
				}

				return obj.$templated;
			},

			/**
			 * Returns an array of elements, created by proceeding through the whole sequence.
			 * @return {[type]} [description]
			 */
			all: function(context){
				var sequence = [];

				var el = this.next().current();
				while (el){
					sequence.push(el);
					el = this.next().current(context);
				}

				return sequence;
			}
		});

		return Sequence;
	}

	return SequenceProvider;
});
define('quest/task/taskProvider',['underscore', 'angular'], function(_, angular){

	TaskProvider.$inject = ['$q','Database','Logger','QuestSequence','taskParse', 'dfltQuestLogger', '$rootScope'];
	function TaskProvider($q, Database, Logger, Sequence, parse, dfltQuestLogger,$rootScope){
		function Task(script){
			var self = this;
			var settings = script.settings || {};

			// save script for later use...
			this.script = script;
			this.db = new Database();
			this.logger = new Logger(dfltQuestLogger);
			this.logger.setSettings(settings.logger || {});
			this.q = $q.defer();

			if (!_.isArray(script.sequence)){
				throw new Error('Task: no sequence was defined');
			}

			this.sequence = new Sequence(script.sequence, this.db);

			this.q.promise
				.then(function(){
					// check if there are unlogged questions and log them
					_.each($rootScope.current.questions, function(quest){
						if(quest.$logged){
							return true;
						}
						self.log(quest, {}, $rootScope.global);
						quest.$logged = true;
					});
					return self.logger.send();
				})
				.then(settings.onEnd || angular.noop);

			parse(script, this.db);
		}

		_.extend(Task.prototype, {
			log: function(){
				this.logger.log.apply(this.logger, arguments);
			},
			current: function(){
				var nextObj = this.sequence.current();

				if (!nextObj){
					this.q.resolve();
				}

				return nextObj;
			},
			next: function(){
				return this.sequence.next();
			},
			prev: function(){
				return this.sequence.prev();
			}
		});

		return Task;
	}

	return TaskProvider;
});
define('quest/task/parseProvider',[],function(){

	function parseProvider(){
		function parse(script, db, sequence){
			db.createColl('pages');
			db.createColl('questions');

			db.add('pages', script.pages || []);
			db.add('questions', script.questions || []);
		}

		return parse;
	}

	return parseProvider;
});
define('quest/task/dfltQuestLogger',['require','underscore'],function(require){
	var _ = require('underscore');

	function dfltQuestLogger(log, pageData, global){
		global;
		var logObj = _.extend({},pageData,log);
		if (logObj.declined) {
			logObj.response = log.responseObj = undefined;
		}
		return logObj;
	}

	return dfltQuestLogger;

});
define('quest/task/task-module',['require','utils/logger/logger-module','utils/database/database-module','utils/mixer/mixer-module','utils/template/templateModule','angular','./questSequenceProvider','./taskSequenceProvider','./taskProvider','./parseProvider','./dfltQuestLogger'],function(require){
	require('utils/logger/logger-module');
	require('utils/database/database-module');
	require('utils/mixer/mixer-module');
	require('utils/template/templateModule');

	var angular = require('angular');
	var module = angular.module('task', ['logger', 'database','mixer', 'template']);

	module.service('QuestSequence', require('./questSequenceProvider'));
	module.service('TaskSequence', require('./taskSequenceProvider'));
	module.service('Task', require('./taskProvider'));
	module.service('taskParse', require('./parseProvider'));

	module.value('dfltQuestLogger', require('./dfltQuestLogger'));

	return module;
});
/*
 *	One module to rule them all.
 *	This module is responsible to pull together all the piquest components.
 *	Calling it should suffice to activate the whole piquest stuff.
 */
define('quest/quest-module',['require','quest/directives/questDirectivesModule','quest/task/task-module'],function(require){

	require('quest/directives/questDirectivesModule');
	require('quest/task/task-module');

	var module = angular.module('piQuest', ['questDirectives','task']);
	module.config(['$sceProvider', function($sceProvider){
		$sceProvider.enabled(false);
	}]);

	return module;
});
define('taskManager/getScriptProvider',['require'],function(require){

	getScriptProvider.$inject = ['$q'];
	function getScriptProvider($q){

		function getScript(url){
			var def = $q.defer();

			require([url], function(script){
				def.resolve(script);
			}, function(err){
				def.reject(err);
			});

			return def.promise;
		}

		return getScript;
	}

	return getScriptProvider;

});
/**
 * Should manage various tasks.
 * For now it should simply load and activate a questionnaire.
 * Eventually it should be able to take a sequence of tasks and run them.
 * @name  managerDirctive
 * @return {directive}
 */
define('taskManager/managerDirective',['require','underscore'],function(require){

	var _ = require('underscore');
	directive.$inject = ['$compile','$rootScope','managerGetScript','$parse', '$window'];
	function directive($compile,$rootScope,getScript,$parse, $window){
		return {
			link:  function(scope, $element, attr){
				var q = getScript(attr.piTask);
				var piGlobal = $parse(attr.piGlobal)($window);

				// create the global object
				$rootScope.global = {};

				if (piGlobal){
					_.extend($rootScope.global, piGlobal);
				}

				q.then(function(script){
					scope.script = script;
					$element.html('<div pi-quest></div>');
					$compile($element.contents())(scope);
				});
			}
		};
	}

	return directive;
});
define('taskManager/manager-module',['require','angular','./getScriptProvider','./managerDirective'],function(require){
	
	var angular = require('angular');
	var module = angular.module('taskManager',[]);

	module.service('managerGetScript', require('./getScriptProvider'));
	module.directive('piTask', require('./managerDirective'));

	return module;
});
/**
 *	The main module that ties the whole application together.
 *	Essentially, we are creating a module with dependencies on anything interesting...
 */
define('app',['require','angular','quest/quest-module','taskManager/manager-module'],function (require) {

	var angular = require('angular');

	var submodules = [
		require('quest/quest-module').name,
		require('taskManager/manager-module').name
	];

	return angular.module('piApp', submodules);
});
