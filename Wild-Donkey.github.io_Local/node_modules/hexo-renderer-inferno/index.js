/* global hexo */

'use strict';

const compile = require('./lib/compile');

function renderer(data, locals) {
    return compile(data)(locals);
}

renderer.compile = compile;

hexo.extend.renderer.register('jsx', 'html', renderer, true);
