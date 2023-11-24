import type { VNode } from '../../core/types';
import { VNodeFlags } from 'inferno-vnode-flags';
export declare function processElement(flags: VNodeFlags, vNode: VNode, dom: Element, nextPropsOrEmpty: any, mounting: boolean, isControlled: boolean): void;
export declare function addFormElementEventHandlers(flags: VNodeFlags, dom: Element, nextPropsOrEmpty: any): void;
export declare function isControlledFormElement(nextPropsOrEmpty: any): boolean;
