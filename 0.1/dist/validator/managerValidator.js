define(function(require){

    var messages = require('./messages');
    var managerParser = require('./parser').managerElements;

    function managerValidator(script){
        var errors = [];
        var elements = managerParser(script);

        errors.push({type:'Settings', errors:[]});
        errors.push({type:'Tasks', errors:[]});

        return errors;
    }

    return managerValidator;

});