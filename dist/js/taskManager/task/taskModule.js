define(["require","angular","./taskGetScriptProvider","./taskLoadProvider","./taskActivateProvider","./taskDirective"],function(e){var t=e("angular"),n=t.module("pi.task",[]);return n.service("taskGetScript",e("./taskGetScriptProvider")),n.service("taskLoad",e("./taskLoadProvider")),n.provider("taskActivate",e("./taskActivateProvider")),n.directive("piTask",e("./taskDirective")),n.config(["taskActivateProvider",function(e){function t(e,t,n,r,i){var s;n.script=i,t.append("<div pi-quest></div>"),s=t.contents(),r(s)(n),s.controller("piQuest").task.promise["finally"](function(){s.scope().$destroy(),s.remove(),e()})}t.$inject=["done","$element","$scope","$compile","script"],e.set("quest",t)}]),n});