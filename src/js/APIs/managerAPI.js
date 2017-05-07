define(function(require){
    var api = require('./APIConstructor');

    var PROGRESS_BAR = ['<div class="row" style="opacity:0.4;">',
        '<div class="hidden-xs col-sm-3 text-right" style="font-weight:bold;">Progress:&nbsp;</div>',
        '<div class="col-xs-12 col-sm-7">',
        '<div class="progress">',
        '<div class="progress-bar" style="width: <%= 100 * tasksMeta.number / tasksMeta.outOf %>%;"></div>',
        '</div>',
        '</div>',
        '</div>'].join('\n');

    return api({
        type: 'manager',
        sets: ['tasks'],
        static: {PROGRESS_BAR:PROGRESS_BAR}
    });
});
