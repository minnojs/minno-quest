define(function(require){
    var _ = require('underscore');

    function harvest(global){
        var logs = getLogs(global);
        var matrix = createMatrix(logs);
        return toCsv(matrix);
    }

    /*
     * Harvest Logs from global
     */
    function getLogs(global){
        return _.reduce(global, reducer, []);
        function reducer(results, task, taskName){ return results.concat(harvestTask(taskName, task)); }
    }

    function harvestTask(taskName, task){
        if (taskName !== 'current' && _.isPlainObject(task) && Array.isArray(task.logs)) return task.logs.map(addTaskName);
        return [];
        
        function addTaskName(obj){ obj.taskName = taskName; return obj; }
    }

    /*
     * Transform Logs into matrix
     */
    function createMatrix(logs){
        var getIndex = GetIndex();
        var rows = logs.map(toRows);
        var headers = getIndex();
        
        rows.forEach(normalizeLength(headers.length));

        return [headers].concat(rows);

        function toRows(log){
            var row = [];
            _.forEach(log, extractValues);
            return row;

            function extractValues(value, key){ row[getIndex(key)] = typeof value === 'object' ? JSON.stringify(value) : value; }
        }

        function normalizeLength(maxLength){
            return function(arr){ arr.length = maxLength; };
        }
    }

    function GetIndex(){
        var hash = {taskName:0};
        var index = 1;
        return getIndex;

        function getIndex(key){
            if (!arguments.length) return _.keys(hash);
            if (key in hash) return hash[key];
            return hash[key] = index++;
        }
    }

    /*
     * Csv encoder
     * https://www.ietf.org/rfc/rfc4180.txt
     * toCSv :: [[String]] -> String
     */

    var quotableRgx = /(\n|,|")/;
    function toCsv(matrice){ return matrice.map(buildRow).join('\n'); }
    function buildRow(arr){ return arr.map(normalize).join(','); }
    function normalize(val){
        // wrap in double quotes and escape inner double quotes
        if (quotableRgx.test(val)) return '"' + val.replace(/"/g, '""') + '"';
        return val;
    }   
    return harvest;
});

