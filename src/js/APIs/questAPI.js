define(function(require){
    var api = require('./APIConstructor');

    return api({
        type: 'quest',
        sets: ['pages', 'questions']
    });
});