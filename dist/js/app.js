/*!
 * PIQuest v0.0.9
 *  License
 */

define("utils/timer/timerStopper",[],function(){function e(e){function t(){this.startTime=e()}return t.prototype.now=function(){return e()-this.startTime},t}return e.$inject=["timerNow"],e}),define("utils/timer/timerNow",[],function(){var e;return!window.performance||(e=performance.now||performance.mozNow||performance.webkitNow||performance.msNow||performance.oNow),e?function(){return e.apply(performance)}:function(){return+(new Date)}}),define("utils/timer/timer-module",["require","angular","./timerStopper","./timerNow"],function(e){var t=e("angular"),n=t.module("timer",[]);return n.service("timerStopper",e("./timerStopper")),n.value("timerNow",e("./timerNow")),n}),define("quest/directives/buttons/buttons",["require","angular"],function(e){var t=e("angular");return t.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(e){this.activeClass=e.activeClass||"active",this.toggleEvent=e.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(e,n,r,i){var s=i[0],o=i[1];o.$render=function(){n.toggleClass(s.activeClass,t.equals(o.$modelValue,e.$eval(r.btnRadio)))},n.bind(s.toggleEvent,function(){var i=n.hasClass(s.activeClass);(!i||t.isDefined(r.uncheckable))&&e.$apply(function(){o.$setViewValue(i?null:e.$eval(r.btnRadio)),o.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(e,n,r,i){function u(){return f(r.btnCheckboxTrue,!0)}function a(){return f(r.btnCheckboxFalse,!1)}function f(n,r){var i=e.$eval(n);return t.isDefined(i)?i:r}var s=i[0],o=i[1];o.$render=function(){n.toggleClass(s.activeClass,t.equals(o.$modelValue,u()))},n.bind(s.toggleEvent,function(){e.$apply(function(){o.$setViewValue(n.hasClass(s.activeClass)?a():u()),o.$render()})})}}})}),define("utils/template/templateFilter",["require","underscore"],function(e){function n(e,n,r){function i(e,i){if(!~e.indexOf("<%"))return e;i=t.extend(i||{},r);try{return t.template(e,i)}catch(s){return n.error('ERROR: "'+s.message+'" in the following template: ',e),""}}return i}var t=e("underscore");return n.$inject=["$rootScope","$log","templateDefaultContext"],n}),define("utils/template/templateObjProvider",["require","underscore"],function(e){function n(e){function r(e,r){return t.forIn(e,function(e,i,s){t.isString(e)&&(s[i]=n(e,r))}),e}var n=e("template");return r}var t=e("underscore");return n.$inject=["$filter"],n}),define("utils/template/templateModule",["require","angular","./templateFilter","./templateObjProvider"],function(e){var t=e("angular"),n=t.module("template",[]);return n.filter("template",e("./templateFilter")),n.service("templateObj",e("./templateObjProvider")),n.constant("templateDefaultContext",{}),n}),define("quest/directives/questController",["require","underscore"],function(e){function n(e,n,r,i,s){var o=this,u,a=e.data,f={dflt:NaN};this.scope=e,this.stopper=new n,this.registerModel=function(n,l){l=t.defaults(l||{},f);var c=r(i.ngModel),h="dflt"in a?a.dflt:l.dflt;e.model=n,t.isUndefined(c(e.$parent))?(o.log=n.$modelValue=u={name:a.name,response:h,serial:t.size(r("current.questions")(e.$parent))},e.response=n.$viewValue=h,c.assign(e.$parent,u)):(u=o.log=c(e.$parent),e.response=n.$viewValue=u.response,a.DEBUG&&s.warn('DEBUG: this question has already been in use: "'+u.name+'"')),n.$formatters.push(function(e){return e.response}),n.$parsers.push(function(e){if(t.isUndefined(e))return u;var n=o.stopper.now();return u.response=e,u.latency=n,u.pristineLatency||(u.pristineLatency=n),u}),n.$options=t.defaults(n.$options||{},{updateOn:"quest"}),e.$watch("response",function(e,t){e!==t&&n.$setViewValue(e,"quest")});var p=function(e){var r=e.response,i=a.correctValue;return t.isNumber(i)&&(i+=""),t.isNumber(r)&&(r+=""),t.isEqual(i,r)?n.$setValidity("correct",!0):n.$setValidity("correct",!1),e};a.correct&&(n.$parsers.push(p),a.response=p(this.log))},e.$on("quest:decline",function(e){e.preventDefault(),u.declined=!0,u.submitLatency=o.stopper.now()}),e.$on("quest:submit",function(e){e.preventDefault(),u.declined=undefined,u.submitLatency=o.stopper.now()})}var t=e("underscore");return n.$inject=["$scope","timerStopper","$parse","$attrs","$log"],n}),define("text!quest/directives/piQuest/piQuest.html",[],function(){return'<div>\n	<div piq-page ng-module="page"></div>\n</div>'}),define("quest/directives/piQuest/piQuest-directive",["underscore","text!./piQuest.html"],function(e,t){function n(t,n,r,i,s){function h(e,t){u.next(t),d()}function p(e,t){u.prev(t),d()}function d(){var e=u.current();e&&(t.page=e)}var o=this,u=o.task=new r(t.script),a,f=n.global,l=t.script,c=n.global[l.name||"current"]=n.current={questions:{}};l.current&&e.extend(c,l.current),l.global&&e.extend(f,l.global),this.init=h,a={global:f,current:c,questions:t.current.questions},e.extend(i,a),e.extend(s,a),t.$on("quest:next",h),t.$on("quest:prev",p),t.$on("quest:refresh",d),t.$on("quest:log",function(e,n,r){u.log(n,r,t.global)})}function r(){return{replace:!0,controller:n,template:t,link:function(e,t,n,r){r.init()}}}return n.$inject=["$scope","$rootScope","Task","templateDefaultContext","mixerDefaultContext"],r}),define("text!quest/directives/piQuest/piqPage.html",[],function(){return'<div ng-form name="pageForm">\n	<div ng-if="page.progressBar" class="text-center" ng-bind-html="page.progressBar"></div>\n	<h3 ng-if="page.header" ng-bind-html="page.header" ng-style="page.headerStyle"></h3>\n	<div ng-bind-html="page.text"></div>\n	<ol ng-class="{\'list-unstyled\':!page.numbered}" start="{{page.numberStart}}">\n		<li ng-repeat="quest in page.questions">\n			<div quest-wrapper quest-data="quest" quest-current="current"></div>\n		</li>\n	</ol>\n\n	<div class="btn-group pull-right">\n		<button\n			ng-click="prev()"\n			data-role="submit"\n			class="btn"\n			ng-class="form"\n			ng-if="page.prev && page.$meta.number > 1"\n		>{{page.prevText || "Go Back"}}</button>\n\n		<button\n			ng-click="submit()"\n			data-role="submit"\n			class="btn btn-primary"\n			ng-class="form"\n			ng-disabled="pageForm.$invalid"\n			ng-if="!page.noSubmit"\n		>{{page.submitText || "Submit"}}</button>\n\n		<button\n			ng-click="decline()"\n			data-role="submit"\n			class="btn btn-warning"\n			ng-class="form"\n			ng-if="page.decline"\n		>{{page.declineText || "Decline to Answer"}}</button>\n	</div>\n\n\n</div>'}),define("quest/directives/piQuest/piqPage-directive",["require","text!./piqPage.html","underscore"],function(e){function r(e,t,r){function s(){e.$emit("quest:refresh")}function o(e,n,r){i.log={name:e.name,startTime:+(new Date)},e.timeout&&(i.timeoutDeferred=t(function(){i.log.timeout=!0,r.submit(!0),e.timeoutMessage&&alert(e.timeoutMessage)},e.timeout))}var i=this;e.global=r.global,e.current=r.current,this.harvest=function(t){var r=e.current.questions;n.each(e.page.questions,function(n){if(!n.name||!t&&!n.lognow)return;var s=r[n.name];if(s.$logged)return;e.$emit("quest:log",s,i.log),s.$logged=!0})},e.submit=function(t){var n=e.pageForm.$valid;if(!n&&t!==!0)return!0;e.$broadcast("quest:submit"),i.proceed(),e.$emit("quest:next")},e.decline=function(){e.$broadcast("quest:decline"),i.proceed(),e.$emit("quest:next")},e.prev=function(){i.proceed(),e.$broadcast("quest:prev")},this.proceed=function(){i.timeoutDeferred&&(t.cancel(i.timeoutDeferred),delete i.timeoutDeferred),i.harvest(e.page.lognow)},e.$watch("page",o),e.$watch("current.questions",s,!0),e.$on("quest:submit:now",function(){e.submit()})}function i(){return{replace:!0,controller:r,template:t}}var t=e("text!./piqPage.html"),n=e("underscore");return r.$inject=["$scope","$timeout","$rootScope"],i}),define("text!quest/directives/wrapper/wrapper.html",[],function(){return'<div class="form-group">\n	<label for="{{data.name}}" ng-bind-html="data.stem"></label>\n	<div quest-data="data" ng-model="current.questions[data.name]"></div>\n	<p class="help-block" ng-if="data.help" ng-bind-html="data.helpText"></p>\n</div>'}),define("quest/directives/wrapper/wrapper-directive",["require","text!./wrapper.html"],function(e){function r(e){return e.charAt(0).toUpperCase()+e.slice(1)}function i(e,i){return{replace:!0,template:n,priority:5,scope:{data:"=questData",current:"=questCurrent"},link:function(n,s){var o=n.data.type||"text",u=s.children().eq(1),a=/[A-Z]/g,f=t+r(o);if(!i.has(f+"Directive"))throw new Error('Unknown question type: "'+o+'"');f=f.replace(a,function(e,t){return(t?"-":"")+e.toLowerCase()}),u.attr(f,!0),e(u)(n)}}}var t="quest",n=e("text!./wrapper.html");return i.$inject=["$compile","$injector"],i}),define("text!quest/directives/text/text.html",[],function(){return'<div ng-form>\n	<input\n	 	type="text"\n		ng-model="response"\n		ng-minlength="{{data.minlength}}"\n		ng-maxlength="{{data.maxlength}}"\n		ng-pattern="{{data.pattern}}"\n		ng-required="{{data.required}}"\n	>\n	<p class="error" ng-show="form.$error.minlength">{{data.errorMsg.minlength || "Too short!"}}</p>\n	<p class="error" ng-show="form.$error.maxlength">{{data.errorMsg.maxlength || "Too long!"}}</p>\n	<p class="error" ng-show="form.$error.pattern">{{data.errorMsg.pattern || "wrong pattern!"}}</p>\n	<p class="error" ng-show="form.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n	<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>'}),define("quest/directives/text/text-directive",["require","text!./text.html"],function(e){var t=e("text!./text.html"),n=function(){return{replace:!0,template:t,require:["form","ngModel","^?piqPage"],controller:"questController",controllerAs:"ctrl",scope:{data:"=questData"},link:function(e,t,n,r){var i=r[0],s=r[1];e.form=i,e.ctrl.registerModel(s,{dflt:""}),e.data.autoSubmit&&t.bind("keydown keypress",function(t){t.which===13&&(e.$apply(function(){e.$emit("quest:submit:now")}),t.preventDefault())})}}};return n}),define("text!quest/directives/text/text-number.html",[],function(){return'<div ng-form name="name{{$id}}">\n	<input\n	 	type="number"\n		ng-model="response"\n		ng-required="{{data.required}}"\n	>\n	<p class="error" ng-show="form.$error.number">{{data.errorMsg.number || "Must be a number!"}}</p>\n	<p class="error" ng-show="form.$error.min">{{data.errorMsg.min || "Too small!"}}</p>\n	<p class="error" ng-show="form.$error.max">{{data.errorMsg.max || "Too big!"}}</p>\n	<p class="error" ng-show="form.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n	<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>'}),define("quest/directives/text/text-number-directive",["require","text!./text-number.html"],function(e){var t=e("text!./text-number.html"),n=function(){return{replace:!0,template:t,require:["form","ngModel","^?piqPage"],controller:"questController",controllerAs:"ctrl",scope:{data:"=questData"},link:function(e,t,n,r){var i=r[0],s=t.find("input"),o=s.eq(0).controller("ngModel");e.form=i,e.ctrl.registerModel(r[1],{dflt:""}),e.data.autoSubmit&&t.bind("keydown keypress",function(t){t.which===13&&(e.$apply(function(){e.$emit("quest:submit:now")}),t.preventDefault())});var u=function(t){var n=parseFloat(e.data.min);return!isNaN(n)&&t<n?(o.$setValidity("qstMin",!1),undefined):(o.$setValidity("qstMin",!0),t)};o.$parsers.push(u),o.$formatters.push(u);var a=function(t){var n=parseFloat(e.data.max);return!isNaN(n)&&t>n?(o.$setValidity("qstMax",!1),undefined):(o.$setValidity("qstMax",!0),t)};o.$parsers.push(a),o.$formatters.push(a)}}};return n}),define("quest/directives/select/selectMixerProvider",["require","underscore"],function(e){function n(e,n){function r(r,i){var s=n(r);return s=t.map(s,function(e,n){return t.isPlainObject(e)||(e={text:e}),t.isUndefined(e.value)&&(e.value=i.numericValues?n+1:e.text),e}),i.reverse&&(s=t(s).reverse().value()),i.randomize&&(s=e(s)),t.each(s,function(e,t){e.order=t}),s}return r}var t=e("underscore");return n.$inject=["randomizeShuffle","mixerRecursive"],n}),define("text!quest/directives/select/dropdown.html",[],function(){return'<div ng-form>\n	<select\n		ng-model="response"\n		ng-options="answer.value as answer.text group by answer.group for answer in quest.answers"\n		ng-required="data.required"\n		ng-change="data.autoSubmit && autoSubmit($event)"\n		>\n		<option value="">{{chooseText || "-- Choose an option --"}}</option>\n	</select>\n	<p class="error" ng-show="form.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n	<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>'}),define("quest/directives/select/dropdownDirective",["require","text!./dropdown.html"],function(e){function n(e,n){return{replace:!0,template:t,require:["ngModel"],controller:"questController",controllerAs:"ctrl",scope:{data:"=questData"},link:function(t,r,i,s){var o=s[0],u=t.ctrl;u.registerModel(o,{dflt:NaN}),t.quest={answers:e(t.data.answers||[],t.data)},t.chooseText="chooseText"in t.data&&t.data.chooseText,t.autoSubmit=function(){n(function(){t.$emit("quest:submit:now")})}}}}var t=e("text!./dropdown.html");return n.$inject=["questSelectMixer","$timeout"],n}),define("text!quest/directives/select/selectOne.html",[],function(){return'<div required="{{data.required}}">\n	<div ng-class="{\'list-group\':!data.buttons, \'btn-group btn-group-justified btn-group-lg\':data.buttons}">\n		<!-- track by in the ng-repeat allows us to keep the repeated object clean so that angular doesn\'t add a $$hashkey property -->\n		<a\n			tabindex="-1"\n			ng-repeat="answer in quest.answers track by answer.order"\n			ng-model="$parent.responseObj"\n			btn-radio="answer"\n			ng-class="{active:$parent.response === answer.value, \'list-group-item\': !$parent.data.buttons, \'btn btn-success\': $parent.data.buttons}"\n			uncheckable\n			ng-click="data.autoSubmit && autoSubmit($event)"\n			ng-bind-html="answer.text"\n		></a>\n	</div>\n	<p class="error" ng-show="model.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n	<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>'}),define("quest/directives/select/selectOneDirective",["require","text!./selectOne.html","angular"],function(e){function r(e,r){return{replace:!0,template:t,require:["ngModel"],controller:"questController",controllerAs:"ctrl",scope:{data:"=questData"},link:function(t,i,s,o){var u=o[0],a=t.ctrl;a.registerModel(u,{dflt:NaN}),t.quest={answers:e(t.data.answers||[],t.data)},t.$watch("responseObj",function(e,n){if(e===n)return;t.response=e&&e.value}),t.autoSubmit=function(e){if(!t.data.autoSubmit)return;var i=n.element(e.target).hasClass(r.activeClass);i&&t.$emit("quest:submit:now")}}}}var t=e("text!./selectOne.html"),n=e("angular");return r.$inject=["questSelectMixer","buttonConfig"],r}),define("text!quest/directives/select/selectMulti.html",[],function(){return'<div required="{{data.required}}">\n	<div class="list-group" >\n		<!-- track by in the ng-repeat allows us to keep the repeated object clean so that angular doesn\'t add a $$hashkey property -->\n		<a\n			href="javascript:void(0);"\n			ng-repeat="answer in quest.answers track by answer.order"\n			class="list-group-item"\n			ng-model="answer.chosen"\n			btn-checkbox\n			ng-class="{active:answer.chosen}"\n			uncheckable\n			ng-bind-html="answer.text"\n		>\n		</a>\n	</div>\n	<p class="error" ng-show="model.$error.required">{{data.errorMsg.required || "This field is required!"}}</p>\n	<p class="error" ng-show="model.$error.correct">{{data.errorMsg.correct || "You must answer the correct answer!"}}</p>\n</div>'}),define("quest/directives/select/selectMultiDirective",["require","underscore","text!./selectMulti.html"],function(e){function r(e){return{replace:!0,template:n,require:["^?piqPage","ngModel"],controller:"questController",controllerAs:"ctrl",scope:{data:"=questData"},link:function(n,r,i,s){var o=n.ctrl,u=s[1];o.registerModel(u,{dflt:[]}),u.$isEmpty=function(){return t.isEmpty(u.$viewValue)},n.quest={answers:e(n.data.answers||[],n.data)},t.each(n.quest.answers,function(e){~t.indexOf(n.response,e.value)&&(e.chosen=!0)}),n.$watch("quest.answers",function(e,r){if(e===r)return;n.response=t(e).filter(function(e){return e.chosen}).pluck("value").value()},!0)}}}var t=e("underscore"),n=e("text!./selectMulti.html");return r.$inject=["questSelectMixer"],r}),define("quest/directives/questDirectivesModule",["require","angular","utils/timer/timer-module","./buttons/buttons","utils/template/templateModule","./questController","./piQuest/piQuest-directive","./piQuest/piqPage-directive","./wrapper/wrapper-directive","./text/text-directive","./text/text-number-directive","./select/selectMixerProvider","./select/dropdownDirective","./select/selectOneDirective","./select/selectMultiDirective"],function(e){var t=e("angular");e("utils/timer/timer-module"),e("./buttons/buttons"),e("utils/template/templateModule");var n=t.module("questDirectives",["timer","ui.bootstrap.buttons","template"]);return n.controller("questController",e("./questController")),n.directive("piQuest",e("./piQuest/piQuest-directive")),n.directive("piqPage",e("./piQuest/piqPage-directive")),n.directive("questWrapper",e("./wrapper/wrapper-directive")),n.directive("questText",e("./text/text-directive")),n.directive("questTextNumber",e("./text/text-number-directive")),n.service("questSelectMixer",e("./select/selectMixerProvider")),n.directive("questDropdown",e("./select/dropdownDirective")),n.directive("questSelectOne",e("./select/selectOneDirective")),n.directive("questSelectMulti",e("./select/selectMultiDirective")),n}),define("utils/logger/LoggerProvider",["require","underscore"],function(e){function n(e,n,r){function s(e){this.pending=[],this.sent=[],this.settings={},this.meta={},this.dfltLogFn=e||function(){return arguments[0]}}var i=this;return t.extend(s.prototype,{log:function(){var e=this.settings,n=(e.logFn||this.dfltLogFn).apply(e,arguments);if(!t.isEmpty(this.meta)&&!t.isPlainObject(n))throw e.DEBUG&&r.log(n),new Error('Logger: in order to use "meta" the log must be an object.');t.extend(n,this.meta),e.DEBUG&&r.log(n),this.pending.push(n),i.logCounter++,e.pulse&&this.pending.length>=e.pulse&&this.send()},send:function(){function u(){o.resolve()}function a(){e.post(i.url,s).then(u,function(){throw new Error("Failed to send data, it seems the backend is not responding.")})}var r,i=this.settings,s=this.pending,o=n.defer();if(s.length===0)return o.resolve();if(t.isUndefined(i.url))throw new Error("The logger url is not set.");this.pending=[],e.post(i.url,s).then(u,a);for(r=0;r<s.length;r++)this.sent.push(s[r])},getCount:function(){return i.logCounter},setSettings:function(e){if(arguments.length===0)return this.settings;this.settings=t.defaults({},e,i.settings);if(!t.isUndefined(e.meta)&&!t.isPlainObject(e.meta))throw new Error('Logger: "meta" must be an object.');this.meta=t.defaults({},e.meta,i.meta)}}),s}var t=e("underscore");return n.$inject=["$http","$q","$log"],function(){this.$get=n,this.settings={},this.meta={},this.logCounter=0}}),define("utils/logger/logger-module",["require","angular","./LoggerProvider"],function(e){var t=e("angular"),n=e("./LoggerProvider"),r=t.module("logger",[]);return r.provider("Logger",n),r}),define("utils/randomize/randomizeModule",["require","angular","underscore"],function(e){var t=e("angular"),n=e("underscore"),r=t.module("randomize",[]);r.value("randomizeRandom",function(){return Math.random()}),r.value("randomizeShuffle",n.shuffle),r.value("randomizeInt",function(t){return Math.floor(Math.random()*t)}),r.value("randomizeRange",function(t){return n.shuffle(n.range(t))})}),define("utils/database/databaseProvider",["require","underscore"],function(e){function n(e,n,r){function i(){this.store=new e,this.randomizer=new n}return t.extend(i.prototype,{inflate:function(e,t){var n=this.store.read(e);return r(t,n,this.randomizer)},createColl:function(e){this.store.create(e)},add:function(e,t){var n=this.store.read(e);n.add(t)}}),i}var t=e("underscore");return n.$inject=["DatabaseStore","DatabaseRandomizer","databaseInflate"],n}),define("utils/database/collectionProvider",["underscore"],function(e){function t(){function t(n){if(n instanceof t)return n;if(!e.isUndefined(n)&&!e.isArray(n)&&!(n instanceof t))throw new Error("Collections can only be constructed from arrays");this.collection=n||[],this.length=this.collection.length,this.pointer=-1}e.extend(t.prototype,{first:function(){return this.pointer=0,this.collection[this.pointer]},last:function(){return this.pointer=this.collection.length-1,this.collection[this.pointer]},end:function(){return this.pointer=this.collection.length,undefined},current:function(){return this.collection[this.pointer]},next:function(){return this.collection[++this.pointer]},previous:function(){return this.collection[--this.pointer]},add:function(t){return arguments.length?(t=e.isArray(t)?t:[t],this.collection=this.collection.concat(t),this.length=this.collection.length,this):this},at:function(e){return this.collection[e]}});var n=["where","filter"],r=Array.prototype.slice;return e.each(n,function(n){t.prototype[n]=function(){var i=r.call(arguments);i.unshift(this.collection);var s=e[n].apply(e,i);return new t(s)}}),t}return t}),define("utils/database/randomizerProvider",["underscore"],function(e){function t(t,n,r){function i(){this._cache={random:{},exRandom:{},sequential:{}}}function s(n,r,i){var s=this._cache.random;return i&&!e.isUndefined(s[r])?s[r]:(s[r]=t(n),s[r])}function o(t,n,i){var s=this._cache.sequential,o=s[n],u;if(e.isUndefined(o))return o=s[n]=new r(e.range(t)),o.first();if(o.length!==t)throw new Error("This seed  ("+n+") points to a collection with the wrong length, you can only use a seed for sets of the same length");return i?o.current():(u=o.next(),e.isUndefined(u)?o.first():u)}function u(t,i,s){var o=this._cache.exRandom,u=o[i],a;if(e.isUndefined(u))return u=o[i]=new r(n(t)),u.first();if(u.length!==t)throw new Error("This seed  ("+i+") points to a collection with the wrong length, you can only use a seed for sets of the same length");return s?u.current():(a=u.next(),e.isUndefined(a)?(u=o[i]=new r(n(t)),u.first()):a)}return e.extend(i.prototype,{random:s,exRandom:u,sequential:o}),i}return t.$inject=["randomizeInt","randomizeRange","Collection"],t}),define("utils/database/storeProvider",["underscore"],function(e){function t(t){function n(){this.store={}}return e.extend(n.prototype,{create:function(n){if(this.store[n])throw new Error("The name space "+n+" already exists");this.store[n]=new t},read:function(t){if(!this.store[t])throw new Error("The name space "+t+" does not exist");return this.store[t]},update:function(t,n){var r=this.read(t);r.add(n)},del:function(t){this.store[t]=undefined}}),n}return t.$inject=["Collection"],t}),define("utils/database/queryProvider",["underscore"],function(e){function t(t){function n(n,r,i){var s=new t(r);if(e.isFunction(n))return n(r);if(e.isString(n)||e.isNumber(n))n={set:n,type:"random"};n.set&&(s=s.where({set:n.set})),e.isPlainObject(n.data)&&(s=s.where({data:n.data})),e.isFunction(n.data)&&(s=s.filter(n.data));var o=n.seed||n.set,u=s.length,a=n.repeat,f;switch(n.type){case undefined:case"byData":case"random":f=i.random(u,o,a);break;case"exRandom":f=i.exRandom(u,o,a);break;case"sequential":f=i.sequential(u,o,a);break;case"first":f=0;break;case"last":f=u-1;break;default:throw new Error("Unknow query type: "+n.type)}if(e.isUndefined(s.at(f)))throw new Error("Query failed, object ("+JSON.stringify(n)+") not found. If you are trying to apply a template, you should know that they are not supported for inheritance.");return s.at(f)}return n}return t.$inject=["Collection"],t}),define("utils/database/inflateProvider",["require","angular","underscore"],function(e){function r(e,r){function i(e){return n.isFunction(e.customize)&&e.customize.apply(e,[e,r.global]),e}var s=function(r,o,u,a,f){f=a?--f:10;if(!f)throw new Error("Inheritance loop too deep, you can only inherit up to 10 levels down");if(!n.isPlainObject(r))throw new Error("You are trying to inflate a non object");var l,c=t.copy(r);if(!c.inherit)return!a&&i(c),c;l=e(r.inherit,o,u);if(!l)throw new Error("Query failed, object ("+JSON.stringify(r.inherit)+") not found.");return l=s(l,o,u,!0,f),n.each(l,function(e,n){n in c||(c[n]=t.copy(e))}),l.data&&(c.data=t.extend(l.data,c.data||{})),!a&&i(c),c};return s}var t=e("angular"),n=e("underscore");return r.$inject=["databaseQuery","$rootScope"],r}),define("utils/database/database-module",["require","utils/randomize/randomizeModule","angular","./databaseProvider","./collectionProvider","./randomizerProvider","./storeProvider","./queryProvider","./inflateProvider"],function(e){e("utils/randomize/randomizeModule");var t=e("angular"),n=e("./databaseProvider"),r=e("./collectionProvider"),i=e("./randomizerProvider"),s=e("./storeProvider"),o=e("./queryProvider"),u=e("./inflateProvider"),a=t.module("database",["randomize"]).service("Collection",r).service("DatabaseRandomizer",i).service("databaseQuery",o).service("databaseInflate",u).service("DatabaseStore",s).service("Database",n);return a}),define("utils/mixer/mixer",["underscore"],function(e){function t(t,n){function r(t){var n=t.mixer;if(!(e.isPlainObject(t)&&"mixer"in t))return[t];if(e.isUndefined(r.mixers[n]))throw new Error("Mixer: unknow mixer type = "+n);return!t.remix&&t.$parsed?t.$parsed:(t.$parsed=r.mixers[n].apply(null,arguments),t.$parsed)}return r.mixers={wrapper:function(e){return e.data},repeat:function(t){var n=t.data||[],r=[],i;for(i=0;i<t.times;i++)r=r.concat(e.clone(n,!0));return r},random:function(e){var n=e.data||[];return t(n)},choose:function(n){var r=n.data||[];return e.first(t(r),n.n?n.n:1)},weightedRandom:function(t){var r=t.data||[],i,s=e.reduce(t.weights,function(e,t){return e+t}),o=n()*s,u=0;for(i=0;i<r.length;i++){u+=t.weights[i],u=+u.toFixed(3);if(o<=u)return[t.data[i]]}throw new Error("Mixer: something went wrong with weightedRandom")}},r}return t.$inject=["randomizeShuffle","randomizeRandom"],t}),define("utils/mixer/mixerSequential",["require","underscore"],function(e){function n(e){function n(r,i,s){var o,u=r[0];s=s||0;if(s++>=10)throw new Error("Mixer: the mixer allows a maximum depth of 10");return t.isUndefined(u.mixer)?r:(o=e(u,i),r.shift(),o=o.concat(r),t.isUndefined(o[0])||t.isUndefined(o[0].mixer)?o:n(o,i,s))}return n}var t=e("underscore");return n.$inject=["mixer"],n}),define("utils/mixer/mixerRecursive",["require","underscore"],function(e){function n(e){function n(r,i,s){var o=[];s=s||0;if(s++>=10)throw new Error("Mixer: the mixer allows a maximum depth of 10");return o=t(r).map(function(r){return t.isUndefined(r.mixer)?r:n(e(r,i),i,s)}).flatten().value(),o}return n}var t=e("underscore");return n.$inject=["mixer"],n}),define("utils/mixer/mixerSequenceProvider",["require","underscore"],function(e){function n(e){function n(e){this.sequence=e,this.stack=[],this.add(e),this.pointer=0}return t.extend(n.prototype,{add:function(e,t){this.stack.push({pointer:t?e.length:-1,sequence:e})},proceed:function(n,r){var i=this.stack[this.stack.length-1],s=n==="next";if(!i)throw new Error("mixerSequence: subSequence not found");i.pointer+=s?1:-1;var o=i.sequence[i.pointer];return t.isUndefined(o)&&this.stack.length>1?(this.stack.pop(),this.proceed.call(this,n,r)):o&&o.mixer?(this.add(e(o,r),!s),this.proceed.call(this,n,r)):this},next:function(e){return this.pointer++,this.proceed.call(this,"next",e)},prev:function(e){return this.pointer--,this.proceed.call(this,"prev",e)},current:function(){var e=this.stack[this.stack.length-1];if(!e)throw new Error("mixerSequence: subSequence not found");var t=e.sequence[e.pointer];return t?(t.$meta=this.meta(),t):undefined},meta:function(){return{number:this.pointer,outOf:t.reduce(this.stack,function(e,t){return e+t.sequence.length-1},0)+1}}}),n}var t=e("underscore");return n.$inject=["mixer"],n}),define("utils/mixer/branching/dotNotation",["require","underscore"],function(e){function n(e,n){return t.isString(e)&&(e=e.split(".")),t.reduce(e,function(e,n){return t.isPlainObject(e)||t.isArray(e)?e[n]:undefined},n)}var t=e("underscore");return n}),define("utils/mixer/branching/mixerDotNotationProvider",["require","underscore"],function(e){function n(e){function n(n,r){var i=/[^\/]\./;return t.isString(n)?i.test(n)?e(n,r):n.replace("/.","."):n}return n}var t=e("underscore");return n.$inject=["dotNotation"],n}),define("utils/mixer/branching/mixerConditionProvider",["require","underscore","angular"],function(e){function r(e,r){function i(i,s){var o=e(i.compare,s),u=e(i.to,s),a=i.operator;i.DEBUG&&r.log("Condition DEBUG: ",o,a||"equals",u,i);if(t.isFunction(a))return!!a.apply(s,[o,u]);switch(a){case"greaterThan":if(t.isNumber(o)&&t.isNumber(u))return+o>+u;return!1;case"greaterThanOrEqual":if(t.isNumber(o)&&t.isNumber(u))return+o>=+u;return!1;case"in":if(t.isArray(u))return~t.indexOf(u,o);return!1;case"exactly":return o===u;case"equals":default:if(t.isUndefined(u))return!!o;return n.equals(o,u)}return a}return i}var t=e("underscore"),n=e("angular");return r.$inject=["mixerDotNotation","$log"],r}),define("utils/mixer/branching/mixerEvaluateProvider",["require","underscore"],function(e){function n(e){function n(r,i){function s(e){return n(e,i)}return t.isArray(r)&&(r={and:r}),r.and?t.every(r.and,s):r.nand?!t.every(r.nand,s):r.or?t.some(r.or,s):r.nor?!t.some(r.nor,s):e(r,i)}return n}var t=e("underscore");return n.$inject=["mixerCondition"],n}),define("utils/mixer/branching/mixerBranchingDecorator",["require","underscore"],function(e){function n(e,n,r){function i(e,i){return i=t.extend(i||{},r),n(e.conditions,i)?e.data||[]:e.elseData||[]}function s(e,i){i=t.extend(i||{},r);var s;return s=t.find(e.branches,function(e){return n(e.conditions,i)}),s?s.data||[]:e.elseData||[]}return e.mixers.branch=i,e.mixers.multiBranch=s,e}var t=e("underscore");return n.$inject=["$delegate","mixerEvaluate","mixerDefaultContext"],n}),define("utils/mixer/mixer-module",["require","utils/randomize/randomizeModule","angular","./mixer","./mixerSequential","./mixerRecursive","./mixerSequenceProvider","./branching/dotNotation","./branching/mixerDotNotationProvider","./branching/mixerConditionProvider","./branching/mixerEvaluateProvider","./branching/mixerBranchingDecorator"],function(e){e("utils/randomize/randomizeModule");var t=e("angular"),n=t.module("mixer",["randomize"]);return n.service("mixer",e("./mixer")),n.service("mixerSequential",e("./mixerSequential")),n.service("mixerRecursive",e("./mixerRecursive")),n.service("MixerSequence",e("./mixerSequenceProvider")),n.value("dotNotation",e("./branching/dotNotation")),n.service("mixerDotNotation",e("./branching/mixerDotNotationProvider")),n.service("mixerCondition",e("./branching/mixerConditionProvider")),n.service("mixerEvaluate",e("./branching/mixerEvaluateProvider")),n.config(["$provide",function(t){t.decorator("mixer",e("./branching/mixerBranchingDecorator"))}]),n.constant("mixerDefaultContext",{}),n}),define("quest/task/questSequenceProvider",["require","underscore"],function(e){function n(e){function n(t,n){if(!n)throw new Error("Sequences need to take a db as the second argument");this.sequence=new e("pages",t,n),this.db=n}return t.extend(n.prototype,{next:function(e){return this.sequence.next(e),this},prev:function(e){return this.sequence.prev(e),this},current:function(n){var r=this.sequence.current(n);if(!r)return r;var i=(new e("questions",r.questions||[],this.db)).all({pagesData:r.data,pagesMeta:r.$meta});return r=t.clone(r,!0),r.questions=i,r}}),n}var t=e("underscore");return n.$inject=["TaskSequence"],n}),define("quest/task/taskSequenceProvider",["require","underscore"],function(e){function n(e,n){function r(t,n,r){this.namespace=t,this.mixerSequence=new e(n),this.db=r}return t.extend(r.prototype,{next:function(e){return this.mixerSequence.next(e),this},prev:function(e){return this.mixerSequence.prev(e),this},current:function(e){e||(e={});var t=this.mixerSequence.current(e);if(!t)return t;if(!t.$inflated||t.reinflate)t.$inflated=this.db.inflate(this.namespace,t);if(!t.$templated||t.regenerateTemplate)e[this.namespace+"Data"]=t.$inflated.data||{},e[this.namespace+"Meta"]=t.$meta,t.$templated=n(t.$inflated,e);return t.$templated},all:function(e){var t=[],n=this.next().current(e);while(n)t.push(n),n=this.next().current(e);return t}}),r}var t=e("underscore");return n.$inject=["MixerSequence","templateObj"],n}),define("quest/task/taskProvider",["underscore","angular"],function(e,t){function n(n,r,i,s,o,u,a){function f(f){var l=this,c=f.settings||{};this.script=f,this.db=new r,this.logger=new i(u),this.logger.setSettings(c.logger||{}),this.q=n.defer();if(!e.isArray(f.sequence))throw new Error("Task: no sequence was defined");this.sequence=new s(f.sequence,this.db),this.q.promise.then(function(){return e.each(a.current.questions,function(e){if(e.$logged)return!0;l.log(e,{},a.global),e.$logged=!0}),l.logger.send()}).then(c.onEnd||t.noop),o(f,this.db)}return e.extend(f.prototype,{log:function(){this.logger.log.apply(this.logger,arguments)},current:function(){var e=this.sequence.current();return e||this.q.resolve(),e},next:function(){return this.sequence.next()},prev:function(){return this.sequence.prev()}}),f}return n.$inject=["$q","Database","Logger","QuestSequence","taskParse","dfltQuestLogger","$rootScope"],n}),define("quest/task/parseProvider",[],function(){function e(){function e(e,t,n){t.createColl("pages"),t.createColl("questions"),t.add("pages",e.pages||[]),t.add("questions",e.questions||[])}return e}return e}),define("quest/task/dfltQuestLogger",["require","underscore"],function(e){function n(e,n,r){r;var i=t.extend({},n,e);return i.declined&&(i.response=e.responseObj=undefined),i}var t=e("underscore");return n}),define("quest/task/task-module",["require","utils/logger/logger-module","utils/database/database-module","utils/mixer/mixer-module","utils/template/templateModule","angular","./questSequenceProvider","./taskSequenceProvider","./taskProvider","./parseProvider","./dfltQuestLogger"],function(e){e("utils/logger/logger-module"),e("utils/database/database-module"),e("utils/mixer/mixer-module"),e("utils/template/templateModule");var t=e("angular"),n=t.module("task",["logger","database","mixer","template"]);return n.service("QuestSequence",e("./questSequenceProvider")),n.service("TaskSequence",e("./taskSequenceProvider")),n.service("Task",e("./taskProvider")),n.service("taskParse",e("./parseProvider")),n.value("dfltQuestLogger",e("./dfltQuestLogger")),n}),define("quest/quest-module",["require","quest/directives/questDirectivesModule","quest/task/task-module"],function(e){e("quest/directives/questDirectivesModule"),e("quest/task/task-module");var t=angular.module("piQuest",["questDirectives","task"]);return t.config(["$sceProvider",function(e){e.enabled(!1)}]),t}),define("taskManager/getScriptProvider",["require"],function(e){function t(t){function n(n){var r=t.defer();return e([n],function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}return n}return t.$inject=["$q"],t}),define("taskManager/managerDirective",["require","underscore"],function(e){function n(e,n,r,i,s){return{link:function(o,u,a){var f=r(a.piTask),l=i(a.piGlobal)(s);n.global={},l&&t.extend(n.global,l),f.then(function(t){o.script=t,u.html("<div pi-quest></div>"),e(u.contents())(o)})}}}var t=e("underscore");return n.$inject=["$compile","$rootScope","managerGetScript","$parse","$window"],n}),define("taskManager/manager-module",["require","angular","./getScriptProvider","./managerDirective"],function(e){var t=e("angular"),n=t.module("taskManager",[]);return n.service("managerGetScript",e("./getScriptProvider")),n.directive("piTask",e("./managerDirective")),n}),define("app",["require","angular","quest/quest-module","taskManager/manager-module"],function(e){var t=e("angular"),n=[e("quest/quest-module").name,e("taskManager/manager-module").name];return t.module("piApp",n)});