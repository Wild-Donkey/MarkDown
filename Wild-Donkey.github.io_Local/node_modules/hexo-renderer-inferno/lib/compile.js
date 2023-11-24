'use strict';

const { createElement } = require('inferno-create-element');
const { renderToStaticMarkup } = require('inferno-server');

const startTag = '<html';
const babelOptions = {
    presets: [
        '@babel/preset-env'
    ],
    plugins: [
        [
            'babel-plugin-inferno',
            {
                imports: true
            }
        ]
    ],
    only: [
        /.*\.jsx$/ig
    ]
};
require('@babel/register')(babelOptions);

function compile(data) {
    const Component = require(data.path);

    return function(locals) {
        const element = createElement(Component, locals);

        // test if the layout is root layout file so we can skip costly large string comparison
        if ('layout' in locals && 'view_dir' in locals && 'filename' in locals) {
            if (locals.filename.startsWith(locals.view_dir) && locals.layout === false) {
                // this is root layout file, add doctype
                return '<!doctype html>\n' + renderToStaticMarkup(element);
            }
            return renderToStaticMarkup(element);
        }
        const markup = renderToStaticMarkup(element);
        // do not use substr, substring, slice to prevent string copy
        for (let i = 0; i < 5; i++) {
            if (markup.charAt(i).toLowerCase() !== startTag.charAt(i)) {
                return markup;
            }
        }
        return '<!doctype html>\n' + markup;
    };
}

module.exports = compile;
