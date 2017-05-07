define(function(require){
    var _ = require('underscore');

    mixerConditionProvider.$inject = ['mixerDotNotation', 'piConsole'];
    function mixerConditionProvider(dotNotation, piConsole){

        function mixerCondition(condition, context){
            var left, right, operator;

            // support a condition that is a plain function
            if (_.isFunction(condition)){
                operator = condition;
            } else {
                // @TODO angular.$parse may be a better candidate for doing this...
                // or maybe lodash _.get?
                left = dotNotation(condition.compare,context);
                right = dotNotation(condition.to,context);
                operator = condition.operator;
            }

            piConsole(['conditions']).info('Condition: ', left, operator || 'equals', right, condition);

            if (condition.DEBUG && console) {
                /* eslint-disable no-console */
                console.info('Condition: ', left, operator || 'equals', right, condition);
                /* eslint-enable no-console */
            }

            if (_.isFunction(operator)){
                return !! operator.apply(context,[left, right, context]);
            }

            switch(operator){
                case 'greaterThan':
                    if (_.isNumber(left) && _.isNumber(right)){
                        return +left > +right;
                    }
                    return false;

                case 'greaterThanOrEqual':
                    if (_.isNumber(left) && _.isNumber(right)){
                        return +left >= +right;
                    }
                    return false;

                case 'in':
                    if (_.isArray(right)){
                        // binary operator to turn indexOf into binary.
                        return ~_.indexOf(right, left);
                    }
                    return false;

                case 'exactly':
                    return left === right;

                case 'equals':
                    /* falls through */
                default:
                    // if right condition is not set, treat this as a truth test for left
                    if (_.isUndefined(condition.to)){
                        return !!left;
                    }
                    return _.isEqual(left, right);
            }
        }

        return mixerCondition;
    }

    return mixerConditionProvider;
});
