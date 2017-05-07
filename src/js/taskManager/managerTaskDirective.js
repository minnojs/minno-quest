define(function(){

    function directive(){
        return {
            priority: 1000,
            template: '<div pi-manager="script"></div>',
            compile: function(){
                return {
                    // this need to be pre so that the wrapping directive gets rendered before the template
                    pre: function($scope, $element, $attr){
                        var taskSource;
                        var source = $attr.piManagerTask;
                        try{
                            taskSource = $scope.$eval(source);
                        } catch(e){/* empty catch */}

                        var task  = taskSource ? taskSource : {scriptUrl:source};

                        $scope.script = {
                            sequence: [
                                {script:['done', 'managerBeforeUnload', function(done, beforeUnload){beforeUnload.deactivate(); done();}]},
                                task
                            ]
                        };
                    }
                };
            }
        };
    }

    return directive;
});
