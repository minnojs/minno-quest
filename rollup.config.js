/* eslint env:"node" */

import {version} from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import string from 'rollup-plugin-string';
import legacy from 'rollup-plugin-legacy';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

// add argument --production to uglify + index.js
const production = process.argv.slice(2).some(v => v === '--production');
const banner = `/**
 * @preserve minno-quest v${version}
 * @license Apache-2.0 (${(new Date()).getFullYear()})
 */
`;

const output = {
    file: 'dist/minno.js',
    format: 'iife', 
    name: 'minnoQuest',
    banner: banner
};

const piOutput = {
    file: 'dist/pi-minno.js',
    format: 'iife', 
    name: 'minnoQuest',
    banner: banner
};

const debugConsole = {
    file: 'dist/minno-debug.js',
    format: 'iife', 
    name: 'minnoDebug'
};

const config = {
    sourcemap:true,
    plugins: [
        postcss({plugins:[cssnano()]}),
        legacy({
            './node_modules/angular/angular.js':'angular',
            './node_modules/requirejs/require.js':{define:'define',require:'require',requirejs:'requirejs'},
            './node_modules/angular-animate/angular-animate.js':'contains' // just force an export
        }),
        resolve(),
        string({include:['**/*.html', '**/*.jst']}),
        commonjs(),
        production && uglify({output:{comments:'some' }}) // minify, but only in production
    ],
    onwarn: function ( message ) {
        if ( /requirejs/.test( message ) ) return;
        console.error( message );
    },
    globals: {
        angular: 'angular'
    }
};

export default [
    production && Object.assign({}, config, {input:'src/index.js', output:output}),
    Object.assign({}, config, {input:'src/pi-index.js', output:piOutput}),
    Object.assign({}, config, {input:'src/debug-console/index.js', output:debugConsole})
].filter(v=>v);
