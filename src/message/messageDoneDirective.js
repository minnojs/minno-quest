/*
 * @name: messageDone Directive
 */
 
directive.$inject = [];
function directive(){
    return {
        link: function($scope, $element){
            $element.on('click', function(){
                $scope.done();
            });
        }
    };
}

export default directive;
