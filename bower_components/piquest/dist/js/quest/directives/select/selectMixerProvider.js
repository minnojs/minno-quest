define(["require","underscore"],function(e){function n(e,n){function r(r,i){var s=n(r);return s=t.map(s,function(e,n){return t.isPlainObject(e)||(e={text:e}),t.isUndefined(e.value)&&(e.value=i.numericValues?n+1:e.text),e}),i.reverse&&(s=t(s).reverse().value()),i.randomize&&(s=e(s)),t.each(s,function(e,t){e.order=t}),s}return r}var t=e("underscore");return n.$inject=["randomizeShuffle","mixerRecursive"],n});