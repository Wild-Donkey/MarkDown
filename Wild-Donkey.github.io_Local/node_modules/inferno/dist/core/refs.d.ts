import type { ForwardRef, RefObject, SFC } from './types';
export declare function createRef<T = Element>(): RefObject<T>;
export declare function forwardRef(render: Function): SFC & ForwardRef;
export declare function unmountRef(ref: any): void;
export declare function mountRef(ref: any, value: any, lifecycle: Function[]): void;
