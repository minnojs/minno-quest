import _ from 'lodash';
import xhr from './xhr';

export default {
    onRow: function(name, row, settings, ctx){
        var logs = ctx.csv || (ctx.csv = []);
        logs.push(_.assign({taskName:name}, row));
    },
    onEnd: function(name, settings, ctx){ if (name == 'manager') return ctx.csv; },
    serialize: function(name, logs){ return toCsv(createMatrix(logs)); },
    send: function(name, serialized, settings,ctx){ 
        var url = _.isString(settings.postCsv) ? settings.postCsv : settings.url;
        return xhr({url:url, body:serialized}).catch(onError); 
        function onError(e){ settings.onError.apply(null, [e,name,serialized,settings,ctx]); }
    }
};

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
