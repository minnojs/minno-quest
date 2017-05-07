/**
 * A factory for $console
 *
 * each $console is prototyped on `consolePrototype`
 */
define(function(require){
    var _ = require('underscore');

    consoleProvider.$inject = ['piConsolePrototype'];

    function consoleProvider(consolePrototype){

		// decorate Console with a simple settings manager
        Console.setSettings = consoleSetSettings;

        return Console;

        function Console(tags, force){
            var $console = _.create(consolePrototype);

            _.extend($console, {
                tags: _.isArray(tags) ? tags : [tags], // make sure tags is an array
                force: !!force
            });

            return $console;
        }

		// a mehtod of console
        function consoleSetSettings (settings) {
            consolePrototype.settings = settings;
        }

    }

    return consoleProvider;
});