define(["require","underscore","angular"],function(e){function r(e,n){function s(e){i=r.getScope(),i.options=t.defaults(e,{direction:"down",template:"normal",show:!0,remove:!0,duration:0}),r.stopper=new n,r.targetTime=i.options.duration*1e3,i.options.show&&r.show(),u()}function o(){var t=i.options||{};i=r.getScope(),e.cancel(r.timeoutId),t.remove&&r.remove()}function u(){var n=100,s=i.options,o=r.stopper.now(),f=r.targetTime-o;if(o>=r.targetTime){i.$emit("timer-end"),s.remove&&r.remove();return}var l=s.direction==="up"?o:f;t.extend(i,a(l)),r.timeoutId=e(u,Math.min(n,f)),i.$emit("timer-tick")}function a(e){var t=Math.floor(e/1e3),n=Math.floor(t/3600),r=t%3600,i=Math.floor(r/60),s=r%60,o=Math.ceil(s),u={current:e,hours:n,minutes:i,seconds:o,milis:e%1e3};return u}var r=this,i={};r.start=s,r.stop=o}function i(e){return{controller:r,priority:400,link:function(t,r,i,s){function f(){u=n.element(o),r.prepend(u),e(u.contents())(a)}function l(){u&&u.remove(),u=null}var o='<div class="pi-timer well well-sm text-center" style="font-family: monospace;">{{minutes}}:{{zeroPad(seconds)}}</div>',u,a=t.$new();s.show=f,s.remove=l,s.getScope=function(){return a},a.zeroPad=function(t){return t<10?"0"+t:t},t.$on("$destroy",l)}}}var t=e("underscore"),n=e("angular");return r.$inject=["$timeout","timerStopper"],i.$inject=["$compile"],i});