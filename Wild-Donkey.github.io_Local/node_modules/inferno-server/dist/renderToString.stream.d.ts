/// <reference types="node" />
import { ChildFlags } from 'inferno-vnode-flags';
import { Readable } from 'stream';
import type { VNode } from 'inferno';
export declare class RenderStream extends Readable {
    initNode: any;
    started: boolean;
    constructor(initNode: any);
    _read(): void;
    renderNode(vNode: any, context: any): any;
    renderArrayOrFragment(vNode: any, context: any): any;
    renderComponent(vComponent: any, context: any, isClass: any): any;
    renderChildren(children: VNode[] | VNode | string, context: any, childFlags: ChildFlags): any;
    renderText(vNode: any): void;
    renderElement(vNode: any, context: any): any;
}
export declare function streamAsString(node: any): RenderStream;
