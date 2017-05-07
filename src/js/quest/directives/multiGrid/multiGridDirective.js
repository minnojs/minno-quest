define(function (require) {
    var _ = require('underscore');

    gridDirective.$inject = ['questShuffle'];
    function gridDirective(shuffle){
        return {
            replace: true,
            template: require('text!./multiGrid.html'),
            require: ['ngModel','form'],
            //			controller: 'questController',
            controllerAs: 'ctrl',
            scope:{
                data: '=questData',
                current: '=questCurrent'
            },
            link: function(scope, element, attr, ctrls) {
                var data = scope.data;

                scope.form = ctrls[1];

                scope.columns = mapColumns(data.columns);
                scope.rows = mapRows(data.rows, data);

                scope.allCss = allCss;
            }
        };

        // merge objects
        function allCss(){
            var objects = _.toArray(arguments);
            objects.unshift({}); // prepend an empty object so that we don't change the originals
            return _.extend.apply(_, objects);
        }

        function mapColumns(columns){
            return (columns || []).map(objectify);
        }

        function mapRows(rows, data){
            return _(rows || [])
            .map(objectify)
            .each(function setRowName(row, index){
                row.hasOwnProperty('name') || (row.name = data.name + zerofill(index+1,3));
            })
            .thru(data.shuffle ? shuffle : _.identity)
            .value();
        }

        function objectify(target){
            return _.isPlainObject(target) ? target : {stem:target};
        }

        /**
         * Zero fills a number
         * http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
         *
         * WARNING!! fails if n===0
         *
         * @param  {Number} n The number to zerofill
         * @param  {Number} w The width of the fill
         * @return {String}   Zerofilled number
         */
        function zerofill(n, w) {
            var an = Math.abs(n);
            var digitCount = 1 + Math.floor(Math.log(an) / Math.LN10);
            if (digitCount >= w) {
                return n;
            }
            var zeroString = Math.pow(10, w - digitCount).toString().substr(1);
            return n < 0 ? '-' + zeroString + an : zeroString + an;
        }
    }

    return gridDirective;
});
