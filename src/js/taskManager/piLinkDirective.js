define(function(){

    piLinkDirective.$inject = ['managerBeforeUnload'];
    function piLinkDirective(managerBeforeUnload){
        return {
            link: function($scope, $element){
                $element.on('click', function(){
                    managerBeforeUnload.deactivate();
                });
            }
        };
    }

    return piLinkDirective;

});
