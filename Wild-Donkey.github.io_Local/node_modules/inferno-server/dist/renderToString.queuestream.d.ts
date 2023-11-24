/// <reference types="node" />
import { Readable } from 'stream';
export declare class RenderQueueStream extends Readable {
    collector: any[];
    promises: any[];
    constructor(initNode: any);
    _read(): void;
    addToQueue(node: any, position: any): void;
    pushQueue(): void;
    renderVNodeToQueue(vNode: any, context: any, position: any): void;
}
export declare function streamQueueAsString(node: any): RenderQueueStream;
