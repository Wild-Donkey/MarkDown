import { VNode } from 'inferno';
export declare function escapeText(text: string): string;
export declare function getCssPropertyName(str: any): string;
export declare const VALID_ATTRIBUTE_NAME_REGEX: RegExp;
export declare function isAttributeNameSafe(attributeName: string): boolean;
export declare const voidElements: Set<string>;
export declare function createDerivedState(instance: any, nextProps: any, state: any): any;
export declare function renderFunctionalComponent(vNode: VNode, context: any): any;
