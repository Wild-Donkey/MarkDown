import { IComponentConstructor, Props, StatelessComponent, VNode } from 'inferno';
/**
 * Creates virtual node
 * @param {string|Function|Component<any, any>} type Type of node
 * @param {object=} props Optional props for virtual node
 * @param {...{object}=} _children Optional children for virtual node
 * @returns {VNode} new virtual node
 */
export declare function createElement<T>(type: string | IComponentConstructor<T> | StatelessComponent<T>, props?: (T & Props<T>) | null, ..._children: any[]): VNode;
