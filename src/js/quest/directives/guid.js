define(function(){
    return function guidFactory(){
        var id = 0;
        return function guid(){ return id++; };
    };
});
