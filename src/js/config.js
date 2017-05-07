/*jshint unused: vars */
define(function(){

    // just make sure console is available
    // It prevents stuff from breaking
    var noop = function(){};
    if (!window.console) window.console = {log:noop,info:noop,error:noop};

    require.config({
        // in order to catch IE errors
        enforceDefine: true,
        paths: {
            // libs
            underscore: '../../bower_components/lodash-compat/lodash.min',
            angular: '../../bower_components/angular/angular.min',
            dragula: '../../bower_components/dragula.js/dist/dragula',
            animate: '../../bower_components/angular-animate/angular-animate.min',
            text: '../../bower_components/requirejs-text/text',
            fastclick: '../../bower_components/fastclick/lib/fastclick',

            // this lib is needed for pipScorer
            jquery: ['//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min','../../bower_components/jquery/dist/jquery.min']
        },

        packages:[
            {
                name: 'pipScorer',
                location: '../../bower_components/PIPlayer/dist/js/extensions/dscore',
                main: 'Scorer'
            }
        ],
        shim: {
            angular : {exports : 'angular'},
            animate : {deps: ['angular'], exports: 'angular'}
        },
        deps: [
            // The APIs are preloaded into the app so we don't have to set them as dependencies here
            'angular', 'animate', 'underscore','text'
        ]
    });
});
