// The example build for reference
// https://github.com/requirejs/r.js/blob/master/build/example.build.js
({
    // Creates a dist folder with optimized js
    logLevel: 2, // WARN
    dir: 'dist',
    appDir: 'src',
    baseUrl: 'js',
    removeCombined: true,
    generateSourceMaps: true,
    preserveLicenseComments: false,
    optimize: 'uglify2',
    // optimize:'none', // toggle this for fast optimized debuging
    skipDirOptimize: true,

    // Tells Require.js to look at main.js for all shim and path configurations
    mainConfigFile: ['src/js/config.js'],

    fileExclusionRegExp: /(\.scss|\.md|_test\.js)$|^example/,
    paths: {
        // Libs
        jquery: 'empty:'
    },

    packages:[
        {
            name: 'pipScorer',
            location: '../../bower_components/PIPlayer/src/js/extensions/dscore',
            main: 'Scorer'
        }
    ],

    modules: [
        {
            name: 'bootstrap',
            insertRequire: ['bootstrap'],
            include: ['app','pipScorer', 'pipAPI','questAPI','managerAPI', '../../bower_components/requirejs/require'],
            override: {
                map: {
                    '*': {
                        pipAPI: 'APIs/pipAPI',
                        questAPI: 'APIs/questAPI',
                        managerAPI: 'APIs/managerAPI'
                    }
                }
            }
        },
        {
            name: 'pibootstrap',
            insertRequire: ['pibootstrap'],
            include: ['app','pipScorer', 'pipAPI','questAPI','managerAPI', '../../bower_components/requirejs/require'],
            override: {
                map: {
                    '*': {
                        pipAPI: 'APIs/PIpipAPI',
                        questAPI: 'APIs/PIquestAPI',
                        managerAPI: 'APIs/PImanagerAPI'
                    }
                }
            }
        }
    ]
});
