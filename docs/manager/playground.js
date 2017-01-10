define(['managerAPI'], function(Manager){

    var API = new Manager();

    API.addSequence([
        {
            type:'message', 
            template:'<h1>Hello world</h1><p>click space to end task</p>', 
            keys: ' '
        }
    ]);

    return API.script;
});
