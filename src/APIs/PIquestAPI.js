import Constructor from './questAPI';
import decorator from './PIAPIdecorator';
import _ from 'lodash';

export default API;

/**
 * Constructor for PIPlayer script creator
 * @return {Object}		Script creator
 */
function API(){
    Constructor.call(this);
    _.set(this, 'settings.logger.url', '/implicit/PiQuest');
}

decorator(API);

// create API functions
_.extend(API.prototype, Constructor.prototype);
