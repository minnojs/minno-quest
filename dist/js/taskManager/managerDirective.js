define(["require","underscore"],function(e){function n(e,t,n){function r(r){var i=this,s;try{s=e.$eval(r)}catch(o){}finally{s||(s=r)}n(s).then(function(n){e.script=n,e.settings=n&&n.settings||{},i.manager=new t(e,n),e.$emit("manager:next")})}this.init=r}function r(e,r,i){return{priority:1e3,replace:!0,template:'<div pi-swap><div pi-task="task" ng-class="{\'pi-spinner\':loading}"></div></div>',controller:n,require:["piManager","piSwap"],link:function(e,n,s,o){function c(){e.loading=!1,l=f,f=a.manager.current(),f?h():p()}function h(){v([e.settings.preTask,l&&l.post,f.pre,t.bind(u.next,u,[{task:f}])])}function p(){v([l&&l.post,t.bind(u.empty,u),e.settings.onEnd,function(){e.$emit("manager:done")}])}function d(t){t.stopPropagation(),e.loading=!0,e.$emit("manager:next")}function v(e){var n=r.when();t(e).map(function(e){return function(){var n=t.isFunction(e)?i.invoke(e):e;return r.when(n)}}).reduce(function(e,t){return e.then(t)},n)}var u=o[1],a=o[0],f,l;a.init(s.piManager),e.$on("manager:loaded",c),e.$on("task:done",d),e.loading=!0}}}var t=e("underscore");return n.$inject=["$scope","managerService","managerLoad"],r.$inject=["managerService","$q","$injector"],r});