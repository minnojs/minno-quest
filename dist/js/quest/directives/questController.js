define(["require","underscore"],function(e){function n(e,n,r,i,s,o){function c(n,c){function d(e){var r=e.response,i=f.correctValue;return t.isNumber(i)&&(i+=""),t.isNumber(r)&&(r+=""),t.isEqual(i,r)?n.$setValidity("correct",!0):n.$setValidity("correct",!1),e}c=t.defaults(c||{},l);var h=r(i.ngModel),p="dflt"in f?f.dflt:c.dflt;e.model=n,a=h(e.$parent),t.isUndefined(a)?(a={},h.assign(e.$parent,a)):s(["question"]).warn('This question has already been in use: "'+a.name+'"'),u.log=n.$modelValue=a,t.defaults(a,{name:f.name,response:p,serial:t.size(r("current.questions")(e.$parent))}),e.response=n.$viewValue=a.response,n.$formatters.push(function(e){return e.response}),n.$parsers.push(function(e){if(t.isUndefined(e))return a;var n=u.stopper.now();return a.response=e,a.latency=n,a.pristineLatency||(a.pristineLatency=n),a}),e.$watch("response",function(e,r){t.isEqual(e,r)||(n.$setViewValue(e),o(f.onChange,{log:a}))}),e.$on("$destroy",function(){o(f.onDestroy,{log:a})}),f.correct&&(n.$parsers.push(d),f.response=d(this.log)),o(f.onCreate,{log:a})}var u=this,a,f=e.data,l={dflt:NaN};this.scope=e,this.stopper=new n,this.registerModel=c,e.$on("quest:submit",function(e){e.preventDefault(),a.declined=undefined,a.submitLatency=u.stopper.now(),o(f.onSubmit,{log:a})}),e.$on("quest:decline",function(e){e.preventDefault(),a.declined=!0,a.submitLatency=u.stopper.now(),o(f.onDecline,{log:a})}),e.$on("quest:timeout",function(e){e.preventDefault(),a.timeout=!0,o(f.onTimeout,{log:a})})}var t=e("underscore");return n.$inject=["$scope","timerStopper","$parse","$attrs","piConsole","piInvoke"],n});