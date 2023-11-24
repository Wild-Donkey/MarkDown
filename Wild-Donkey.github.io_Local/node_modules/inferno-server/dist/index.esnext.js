import { EMPTY_OBJ } from 'inferno';
import { Readable } from 'stream';

var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
var isArray = Array.isArray;
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number';
}
function isNullOrUndef(o) {
    return o === void 0 || o === null;
}
function isInvalid(o) {
    return o === null || o === false || o === true || o === void 0;
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
}
function isNull(o) {
    return o === null;
}
function isUndefined(o) {
    return o === void 0;
}
function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(("Inferno Error: " + message));
}
function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key$1 in second) {
            out[key$1] = second[key$1];
        }
    }
    return out;
}

function renderStylesToString(styles) {
    if (isString(styles)) {
        return styles;
    }
    else {
        let renderedString = '';
        for (const styleName in styles) {
            const value = styles[styleName];
            if (isStringOrNumber(value)) {
                renderedString += `${styleName}:${value};`;
            }
        }
        return renderedString;
    }
}

const rxUnescaped = new RegExp(/["'&<>]/);
function escapeText(text) {
    /* Much faster when there is no unescaped characters */
    if (!rxUnescaped.test(text)) {
        return text;
    }
    let result = '';
    let escape = '';
    let start = 0;
    let i;
    for (i = 0; i < text.length; ++i) {
        switch (text.charCodeAt(i)) {
            case 34: // "
                escape = '&quot;';
                break;
            case 39: // '
                escape = '&#039;';
                break;
            case 38: // &
                escape = '&amp;';
                break;
            case 60: // <
                escape = '&lt;';
                break;
            case 62: // >
                escape = '&gt;';
                break;
            default:
                continue;
        }
        if (i > start) {
            result += text.slice(start, i);
        }
        result += escape;
        start = i + 1;
    }
    return result + text.slice(start, i);
}
const ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const VALID_ATTRIBUTE_NAME_REGEX = new RegExp('^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$');
const illegalAttributeNameCache = {};
const validatedAttributeNameCache = {};
function isAttributeNameSafe(attributeName) {
    if (validatedAttributeNameCache[attributeName] !== void 0) {
        return true;
    }
    if (illegalAttributeNameCache[attributeName] !== void 0) {
        return false;
    }
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
        validatedAttributeNameCache[attributeName] = true;
        return true;
    }
    illegalAttributeNameCache[attributeName] = true;
    return false;
}
const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
]);
function createDerivedState(instance, nextProps, state) {
    if (instance.constructor.getDerivedStateFromProps) {
        return combineFrom(state, instance.constructor.getDerivedStateFromProps(nextProps, state));
    }
    return state;
}
function renderFunctionalComponent(vNode, context) {
    const props = vNode.props || EMPTY_OBJ;
    return vNode.flags & 32768 /* ForwardRef */ ? vNode.type.render(props, vNode.ref, context) : vNode.type(props, context);
}

function renderVNodeToString(vNode, parent, context) {
    const flags = vNode.flags;
    const type = vNode.type;
    const props = vNode.props || EMPTY_OBJ;
    const children = vNode.children;
    if ((flags & 14 /* Component */) !== 0) {
        const isClass = flags & 4 /* ComponentClass */;
        if (isClass) {
            const instance = new type(props, context);
            const hasNewAPI = Boolean(type.getDerivedStateFromProps);
            instance.$BS = false;
            instance.$SSR = true;
            let childContext;
            if (isFunction(instance.getChildContext)) {
                childContext = instance.getChildContext();
            }
            if (isNullOrUndef(childContext)) {
                childContext = context;
            }
            else {
                childContext = combineFrom(context, childContext);
            }
            if (instance.props === EMPTY_OBJ) {
                instance.props = props;
            }
            instance.context = context;
            if (!hasNewAPI && isFunction(instance.componentWillMount)) {
                instance.$BR = true;
                instance.componentWillMount();
                instance.$BR = false;
                const pending = instance.$PS;
                if (pending) {
                    const state = instance.state;
                    if (state === null) {
                        instance.state = pending;
                    }
                    else {
                        for (const key in pending) {
                            state[key] = pending[key];
                        }
                    }
                    instance.$PSS = false;
                    instance.$PS = null;
                }
            }
            if (hasNewAPI) {
                instance.state = createDerivedState(instance, props, instance.state);
            }
            const renderOutput = instance.render(props, instance.state, instance.context);
            // In case render returns invalid stuff
            if (isInvalid(renderOutput)) {
                return '<!--!-->';
            }
            if (isString(renderOutput)) {
                return escapeText(renderOutput);
            }
            if (isNumber(renderOutput)) {
                return renderOutput + '';
            }
            return renderVNodeToString(renderOutput, vNode, childContext);
        }
        else {
            const renderOutput = renderFunctionalComponent(vNode, context);
            if (isInvalid(renderOutput)) {
                return '<!--!-->';
            }
            if (isString(renderOutput)) {
                return escapeText(renderOutput);
            }
            if (isNumber(renderOutput)) {
                return renderOutput + '';
            }
            return renderVNodeToString(renderOutput, vNode, context);
        }
    }
    else if ((flags & 481 /* Element */) !== 0) {
        let renderedString = `<${type}`;
        let html;
        const isVoidElement = voidElements.has(type);
        const className = vNode.className;
        if (isString(className)) {
            renderedString += ` class="${escapeText(className)}"`;
        }
        else if (isNumber(className)) {
            renderedString += ` class="${className}"`;
        }
        if (!isNull(props)) {
            for (const prop in props) {
                const value = props[prop];
                switch (prop) {
                    case 'dangerouslySetInnerHTML':
                        html = value.__html;
                        break;
                    case 'style':
                        if (!isNullOrUndef(props.style)) {
                            renderedString += ` style="${renderStylesToString(props.style)}"`;
                        }
                        break;
                    case 'children':
                    case 'className':
                        // Ignore
                        break;
                    case 'defaultValue':
                        // Use default values if normal values are not present
                        if (!props.value) {
                            renderedString += ` value="${isString(value) ? escapeText(value) : value}"`;
                        }
                        break;
                    case 'defaultChecked':
                        // Use default values if normal values are not present
                        if (!props.checked) {
                            renderedString += ` checked="${value}"`;
                        }
                        break;
                    default:
                        if (isAttributeNameSafe(prop)) {
                            if (isString(value)) {
                                renderedString += ` ${prop}="${escapeText(value)}"`;
                            }
                            else if (isNumber(value)) {
                                renderedString += ` ${prop}="${value}"`;
                            }
                            else if (value === true) {
                                renderedString += ` ${prop}`;
                            }
                        }
                        break;
                }
            }
            if (type === 'option' && typeof props.value !== 'undefined' && props.value === parent.props.value) {
                // Parent value sets children value
                renderedString += ` selected`;
            }
        }
        if (isVoidElement) {
            renderedString += `>`;
        }
        else {
            renderedString += `>`;
            const childFlags = vNode.childFlags;
            if (childFlags === 2 /* HasVNodeChildren */) {
                renderedString += renderVNodeToString(children, vNode, context);
            }
            else if (childFlags & 12 /* MultipleChildren */) {
                for (let i = 0, len = children.length; i < len; ++i) {
                    renderedString += renderVNodeToString(children[i], vNode, context);
                }
            }
            else if (childFlags === 16 /* HasTextChildren */) {
                renderedString += children === '' ? ' ' : escapeText(children);
            }
            else if (html) {
                renderedString += html;
            }
            if (!isVoidElement) {
                renderedString += `</${type}>`;
            }
        }
        if (String(type).match(/[\s\n\/='"\0<>]/)) {
            throw renderedString;
        }
        return renderedString;
    }
    else if ((flags & 16 /* Text */) !== 0) {
        return children === '' ? ' ' : escapeText(children);
    }
    else if (isArray(vNode) || (flags & 8192 /* Fragment */) !== 0) {
        const childFlags = vNode.childFlags;
        if (childFlags === 2 /* HasVNodeChildren */ || (isArray(vNode) && vNode.length === 0)) {
            return '<!--!-->';
        }
        else if (childFlags & 12 /* MultipleChildren */ || isArray(vNode)) {
            const tmpNodes = isArray(vNode) ? vNode : children;
            let renderedString = '';
            for (let i = 0, len = tmpNodes.length; i < len; ++i) {
                renderedString += renderVNodeToString(tmpNodes[i], vNode, context);
            }
            return renderedString;
        }
    }
    else {
        throwError();
    }
    return '';
}
function renderToString(input) {
    return renderVNodeToString(input, {}, {});
}

function mergePendingState(componentInstance) {
    const pendingState = componentInstance.$PS;
    if (pendingState) {
        const state = componentInstance.state;
        if (state === null) {
            componentInstance.state = pendingState;
        }
        else {
            for (const key in pendingState) {
                state[key] = pendingState[key];
            }
        }
        componentInstance.$PS = null;
    }
    componentInstance.$BR = false;
}

class RenderQueueStream extends Readable {
    constructor(initNode) {
        super();
        this.collector = [Infinity]; // Infinity marks the end of the stream
        this.promises = [];
        this.pushQueue = this.pushQueue.bind(this);
        if (initNode) {
            this.renderVNodeToQueue(initNode, null, null);
        }
    }
    _read() {
        setTimeout(this.pushQueue, 0);
    }
    addToQueue(node, position) {
        // Positioning defined, stack it
        if (!isNullOrUndef(position)) {
            const lastSlot = this.promises[position].length - 1;
            // Combine as array or push into promise collector
            if (typeof this.promises[position][lastSlot] === 'string' && typeof node === 'string') {
                this.promises[position][lastSlot] += node;
            }
            else {
                this.promises[position].push(node);
            }
            // Collector is empty push to stream
        }
        else if (typeof node === 'string' && this.collector.length - 1 === 0) {
            this.push(node);
            // Last element in collector and incoming are same then concat
        }
        else if (typeof node === 'string' && typeof this.collector[this.collector.length - 2] === 'string') {
            this.collector[this.collector.length - 2] += node;
            // Push the element to collector (before Infinity)
        }
        else {
            this.collector.splice(-1, 0, node);
        }
    }
    pushQueue() {
        const chunk = this.collector[0];
        // Output strings directly
        if (typeof chunk === 'string') {
            this.push(chunk);
            this.collector.shift();
            // For fulfilled promises, merge into collector
        }
        else if (!!chunk && (typeof chunk === 'object' || isFunction(chunk)) && isFunction(chunk.then)) {
            const self = this;
            chunk.then((index) => {
                self.collector.splice(0, 1, ...self.promises[index]);
                self.promises[index] = null;
                setTimeout(self.pushQueue, 0);
            });
            this.collector[0] = null;
            // End of content
        }
        else if (chunk === Infinity) {
            this.emit('end');
        }
    }
    renderVNodeToQueue(vNode, context, position) {
        const flags = vNode.flags;
        const type = vNode.type;
        const props = vNode.props || EMPTY_OBJ;
        const children = vNode.children;
        // Handles a component render
        if ((flags & 14 /* Component */) > 0) {
            const isClass = flags & 4 /* ComponentClass */;
            // Render the
            if (isClass) {
                const instance = new type(props, context);
                const hasNewAPI = Boolean(type.getDerivedStateFromProps);
                instance.$BS = false;
                instance.$SSR = true;
                let childContext;
                if (!isUndefined(instance.getChildContext)) {
                    childContext = instance.getChildContext();
                }
                if (!isNullOrUndef(childContext)) {
                    context = combineFrom(context, childContext);
                }
                if (instance.props === EMPTY_OBJ) {
                    instance.props = props;
                }
                instance.context = context;
                // Trigger lifecycle hook
                if (!hasNewAPI && isFunction(instance.componentWillMount)) {
                    instance.$BR = true;
                    instance.componentWillMount();
                    mergePendingState(instance);
                }
                // Trigger extra promise-based lifecycle hook
                if (isFunction(instance.getInitialProps)) {
                    const initialProps = instance.getInitialProps(instance.props, instance.context);
                    if (initialProps) {
                        if (Promise.resolve(initialProps) === initialProps) {
                            const promisePosition = this.promises.push([]) - 1;
                            this.addToQueue(initialProps.then((dataForContext) => {
                                if (typeof dataForContext === 'object') {
                                    instance.props = combineFrom(instance.props, dataForContext);
                                }
                                const renderOut = instance.render(instance.props, instance.state, instance.context);
                                if (isInvalid(renderOut)) {
                                    this.addToQueue('<!--!-->', promisePosition);
                                }
                                else if (isString(renderOut)) {
                                    this.addToQueue(escapeText(renderOut), promisePosition);
                                }
                                else if (isNumber(renderOut)) {
                                    this.addToQueue(renderOut + '', promisePosition);
                                }
                                else {
                                    this.renderVNodeToQueue(renderOut, instance.context, promisePosition);
                                }
                                setTimeout(this.pushQueue, 0);
                                return promisePosition;
                            }), position);
                            return;
                        }
                        else {
                            instance.props = combineFrom(instance.props, initialProps);
                        }
                    }
                }
                if (hasNewAPI) {
                    instance.state = createDerivedState(instance, props, instance.state);
                }
                const renderOutput = instance.render(instance.props, instance.state, instance.context);
                if (isInvalid(renderOutput)) {
                    this.addToQueue('<!--!-->', position);
                }
                else if (isString(renderOutput)) {
                    this.addToQueue(escapeText(renderOutput), position);
                }
                else if (isNumber(renderOutput)) {
                    this.addToQueue(renderOutput + '', position);
                }
                else {
                    this.renderVNodeToQueue(renderOutput, context, position);
                }
            }
            else {
                const renderOutput = renderFunctionalComponent(vNode, context);
                if (isInvalid(renderOutput)) {
                    this.addToQueue('<!--!-->', position);
                }
                else if (isString(renderOutput)) {
                    this.addToQueue(escapeText(renderOutput), position);
                }
                else if (isNumber(renderOutput)) {
                    this.addToQueue(renderOutput + '', position);
                }
                else {
                    this.renderVNodeToQueue(renderOutput, context, position);
                }
            }
            // If an element
        }
        else if ((flags & 481 /* Element */) > 0) {
            let renderedString = `<${type}`;
            let html;
            const isVoidElement = voidElements.has(type);
            const className = vNode.className;
            if (isString(className)) {
                renderedString += ` class="${escapeText(className)}"`;
            }
            else if (isNumber(className)) {
                renderedString += ` class="${className}"`;
            }
            if (!isNull(props)) {
                for (const prop in props) {
                    const value = props[prop];
                    switch (prop) {
                        case 'dangerouslySetInnerHTML':
                            html = value.__html;
                            break;
                        case 'style':
                            if (!isNullOrUndef(props.style)) {
                                renderedString += ` style="${renderStylesToString(props.style)}"`;
                            }
                            break;
                        case 'children':
                        case 'className':
                            // Ignore
                            break;
                        case 'defaultValue':
                            // Use default values if normal values are not present
                            if (!props.value) {
                                renderedString += ` value="${isString(value) ? escapeText(value) : value}"`;
                            }
                            break;
                        case 'defaultChecked':
                            // Use default values if normal values are not present
                            if (!props.checked) {
                                renderedString += ` checked="${value}"`;
                            }
                            break;
                        default:
                            if (isAttributeNameSafe(prop)) {
                                if (isString(value)) {
                                    renderedString += ` ${prop}="${escapeText(value)}"`;
                                }
                                else if (isNumber(value)) {
                                    renderedString += ` ${prop}="${value}"`;
                                }
                                else if (value === true) {
                                    renderedString += ` ${prop}`;
                                }
                            }
                            break;
                    }
                }
            }
            renderedString += `>`;
            if (String(type).match(/[\s\n\/='"\0<>]/)) {
                throw renderedString;
            }
            // Voided element, push directly to queue
            if (isVoidElement) {
                this.addToQueue(renderedString, position);
                // Regular element with content
            }
            else {
                // Element has children, build them in
                const childFlags = vNode.childFlags;
                if (childFlags === 2 /* HasVNodeChildren */) {
                    this.addToQueue(renderedString, position);
                    this.renderVNodeToQueue(children, context, position);
                    this.addToQueue('</' + type + '>', position);
                    return;
                }
                else if (childFlags === 16 /* HasTextChildren */) {
                    this.addToQueue(renderedString, position);
                    this.addToQueue(children === '' ? ' ' : escapeText(children + ''), position);
                    this.addToQueue('</' + type + '>', position);
                    return;
                }
                else if (childFlags & 12 /* MultipleChildren */) {
                    this.addToQueue(renderedString, position);
                    for (let i = 0, len = children.length; i < len; ++i) {
                        this.renderVNodeToQueue(children[i], context, position);
                    }
                    this.addToQueue('</' + type + '>', position);
                    return;
                }
                if (html) {
                    this.addToQueue(renderedString + html + '</' + type + '>', position);
                    return;
                }
                // Close element if it's not void
                if (!isVoidElement) {
                    this.addToQueue(renderedString + '</' + type + '>', position);
                }
            }
            // Push text directly to queue
        }
        else if ((flags & 16 /* Text */) > 0) {
            this.addToQueue(children === '' ? ' ' : escapeText(children), position);
            // Handle fragments and arrays
        }
        else if (isArray(vNode) || (flags & 8192 /* Fragment */) !== 0) {
            const childFlags = vNode.childFlags;
            if (childFlags === 2 /* HasVNodeChildren */ || (isArray(vNode) && vNode.length === 0)) {
                this.addToQueue('<!--!-->', position);
            }
            else if (childFlags & 12 /* MultipleChildren */ || isArray(vNode)) {
                const tmpChildren = isArray(vNode) ? vNode : vNode.children;
                for (let i = 0, len = tmpChildren.length; i < len; ++i) {
                    this.renderVNodeToQueue(tmpChildren[i], context, position);
                }
                return;
            }
            // Handle errors
        }
        else {
            throwError();
        }
    }
}
function streamQueueAsString(node) {
    return new RenderQueueStream(node);
}

const resolvedPromise = Promise.resolve();
class RenderStream extends Readable {
    constructor(initNode) {
        super();
        this.started = false;
        this.initNode = initNode;
    }
    _read() {
        if (this.started) {
            return;
        }
        this.started = true;
        resolvedPromise
            .then(() => {
            return this.renderNode(this.initNode, null);
        })
            .then(() => {
            this.push(null);
        })
            .catch((err) => {
            this.emit('error', err);
        });
    }
    renderNode(vNode, context) {
        const flags = vNode.flags;
        if ((flags & 14 /* Component */) > 0) {
            return this.renderComponent(vNode, context, flags & 4 /* ComponentClass */);
        }
        if ((flags & 481 /* Element */) > 0) {
            return this.renderElement(vNode, context);
        }
        if (isArray(vNode) || (flags & 8192 /* Fragment */) !== 0) {
            return this.renderArrayOrFragment(vNode, context);
        }
        return this.renderText(vNode);
    }
    renderArrayOrFragment(vNode, context) {
        const childFlags = vNode.childFlags;
        if (childFlags === 2 /* HasVNodeChildren */ || (isArray(vNode) && vNode.length === 0)) {
            return this.push('<!--!-->');
        }
        else if (childFlags & 12 /* MultipleChildren */ || isArray(vNode)) {
            const children = isArray(vNode) ? vNode : vNode.children;
            return children.reduce((p, child) => {
                return p.then(() => {
                    return Promise.resolve(this.renderNode(child, context)).then(() => !!(child.flags & 16 /* Text */));
                });
            }, Promise.resolve(false));
        }
    }
    renderComponent(vComponent, context, isClass) {
        const type = vComponent.type;
        const props = vComponent.props;
        if (!isClass) {
            const renderOutput = renderFunctionalComponent(vComponent, context);
            if (isInvalid(renderOutput)) {
                return this.push('<!--!-->');
            }
            if (isString(renderOutput)) {
                return this.push(escapeText(renderOutput));
            }
            if (isNumber(renderOutput)) {
                return this.push(renderOutput + '');
            }
            return this.renderNode(renderOutput, context);
        }
        const instance = new type(props, context);
        const hasNewAPI = Boolean(type.getDerivedStateFromProps);
        instance.$BS = false;
        instance.$SSR = true;
        let childContext;
        if (isFunction(instance.getChildContext)) {
            childContext = instance.getChildContext();
        }
        if (!isNullOrUndef(childContext)) {
            context = combineFrom(context, childContext);
        }
        instance.context = context;
        instance.$BR = true;
        return Promise.resolve(!hasNewAPI && instance.componentWillMount && instance.componentWillMount()).then(() => {
            mergePendingState(instance);
            if (hasNewAPI) {
                instance.state = createDerivedState(instance, props, instance.state);
            }
            const renderOutput = instance.render(instance.props, instance.state, instance.context);
            if (isInvalid(renderOutput)) {
                return this.push('<!--!-->');
            }
            if (isString(renderOutput)) {
                return this.push(escapeText(renderOutput));
            }
            if (isNumber(renderOutput)) {
                return this.push(renderOutput + '');
            }
            return this.renderNode(renderOutput, context);
        });
    }
    renderChildren(children, context, childFlags) {
        if (childFlags === 2 /* HasVNodeChildren */) {
            return this.renderNode(children, context);
        }
        if (childFlags === 16 /* HasTextChildren */) {
            return this.push(children === '' ? ' ' : escapeText(children + ''));
        }
        if (childFlags & 12 /* MultipleChildren */) {
            return children.reduce((p, child) => {
                return p.then(() => {
                    return Promise.resolve(this.renderNode(child, context)).then(() => !!(child.flags & 16 /* Text */));
                });
            }, Promise.resolve(false));
        }
    }
    renderText(vNode) {
        this.push(vNode.children === '' ? ' ' : escapeText(vNode.children));
    }
    renderElement(vNode, context) {
        const type = vNode.type;
        const props = vNode.props;
        let renderedString = `<${type}`;
        let html;
        const isVoidElement = voidElements.has(type);
        const className = vNode.className;
        if (isString(className)) {
            renderedString += ` class="${escapeText(className)}"`;
        }
        else if (isNumber(className)) {
            renderedString += ` class="${className}"`;
        }
        if (!isNull(props)) {
            for (const prop in props) {
                const value = props[prop];
                switch (prop) {
                    case 'dangerouslySetInnerHTML':
                        html = value.__html;
                        break;
                    case 'style':
                        if (!isNullOrUndef(props.style)) {
                            renderedString += ` style="${renderStylesToString(props.style)}"`;
                        }
                        break;
                    case 'children':
                    case 'className':
                        // Ignore
                        break;
                    case 'defaultValue':
                        // Use default values if normal values are not present
                        if (!props.value) {
                            renderedString += ` value="${isString(value) ? escapeText(value) : value}"`;
                        }
                        break;
                    case 'defaultChecked':
                        // Use default values if normal values are not present
                        if (!props.checked) {
                            renderedString += ` checked="${value}"`;
                        }
                        break;
                    default:
                        if (isAttributeNameSafe(prop)) {
                            if (isString(value)) {
                                renderedString += ` ${prop}="${escapeText(value)}"`;
                            }
                            else if (isNumber(value)) {
                                renderedString += ` ${prop}="${value}"`;
                            }
                            else if (value === true) {
                                renderedString += ` ${prop}`;
                            }
                            break;
                        }
                }
            }
        }
        renderedString += `>`;
        this.push(renderedString);
        if (String(type).match(/[\s\n\/='"\0<>]/)) {
            throw renderedString;
        }
        if (isVoidElement) {
            return;
        }
        else {
            if (html) {
                this.push(html);
                this.push(`</${type}>`);
                return;
            }
        }
        const childFlags = vNode.childFlags;
        if (childFlags === 1 /* HasInvalidChildren */) {
            this.push(`</${type}>`);
            return;
        }
        return Promise.resolve(this.renderChildren(vNode.children, context, childFlags)).then(() => {
            this.push(`</${type}>`);
        });
    }
}
function streamAsString(node) {
    return new RenderStream(node);
}

export { RenderQueueStream, RenderStream, renderToString as renderToStaticMarkup, renderToString, streamAsString as streamAsStaticMarkup, streamAsString, streamQueueAsString as streamQueueAsStaticMarkup, streamQueueAsString };
