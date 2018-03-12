import Constructor from './timeAPI';
import _ from 'lodash';
export default API;

/**
 * Constructor for PIPlayer script creator
 * @return {Object}		Script creator
 */
function API(name){
    Constructor.call(this, name);

    var settings = this.settings;

    settings.logger = {
        pulse: 20,
        url : '/implicit/PiPlayerApplet'
    };
}

// create API functions
_.extend(API.prototype, Constructor.prototype);
