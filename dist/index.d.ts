/**
 * const store = require('./store');

const unsub = store.subscribe('user', (value, prev, key) => {
  console.log(`${key} changed:`, prev, '->', value);
});

store.set('user', 'Alice');  // logs
store.set('other', 1);       // ignored
unsub();                     // stop listening


const unsub = store.subscribe((value, prev, key) => {
    console.log('any change:', key);
  });


  for await (const value of store.subscribe('token', { immediate: true })) {
    await refreshWith(value);
    if (value === 'stop') break;   // breaking triggers the finally-unsubscribe
  }

 */
declare const EventEmitter: any;
declare class Store extends EventEmitter {
    #private;
    set(key: any, value: any, { ttl }?: any): this;
    delete(key: any): boolean;
    clear(): void;
    /**
     * subscribe(key, fn)  -> unsubscribe
     * subscribe(fn)       -> unsubscribe (all keys)
     * subscribe(key, { immediate: true }) -> async iterator
     */
    subscribe(fn: (value: any, prev: any, key: string) => void): () => void;
    subscribe(key: string, fn: (value: any, prev: any, key: string) => void, opts?: {
        immediate?: boolean;
    }): () => void;
    subscribe(key: string, opts?: {
        immediate?: boolean;
    }): AsyncGenerator<any, void, unknown>;
    get<T = any>(key: string): T | undefined;
    get<T = any>(key: string, fallback: T): T;
    has(key: any): boolean;
    toJSON(): any;
    freeze(): void;
    /**
     * wait(key, opts?) -> Promise<value>
     *   opts.predicate(value, prev) -> boolean   // keep waiting until true
     *   opts.timeout   -> ms, rejects on timeout
     *   opts.immediate -> resolve now if predicate passes for current value
     *   opts.signal    -> AbortSignal
     */
    wait(key: any, { predicate, timeout, immediate, signal }?: any): Promise<any>;
    waitChange(key: any, opts?: {}): Promise<any>;
    waitFor(key: any, predicate: any, opts?: {}): Promise<any>;
}
export { Store };
declare const _default: Store;
export default _default;
