define(["require","underscore","text!./modal.html","angular"],function(e){function i(e,i,s,o,u){function h(){a&&a.remove(),f&&f.$destroy(),l&&l.resolve(),c.remove(),u.off("keydown",h),i.removeClass("modal-open")}function p(p){var d=p.context||{};return h(),l=o.defer(),f=(p.$scope||e).$new(),f.close=h,u.on("keydown",h),f.header=t.template(p.header)(d),f.body=t.template(p.body)(d),f.button=t.template(p.button)(d),a=r.element(n),i.addClass("modal-open"),i.prepend(c),i.prepend(a),s(a.contents())(f),f.$digest(),l.promise}function d(e){var t=e.which||e.keyCode;t==27&&u.one("keydown",skipListener)}var a,f,l,c=r.element('<div class="modal-backdrop in"/>');this.open=p,this.close=h}var t=e("underscore"),n=e("text!./modal.html"),r=e("angular");return i.$inject=["$rootScope","$rootElement","$compile","$q","$document"],i});