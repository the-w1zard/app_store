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

// store.js
const { EventEmitter } = require('node:events');

class Store extends EventEmitter {
  #data = new Map();
  #ttls = new Map();
  #subs = new Map();   // key -> Set<fn>   (key-specific)
  #anySubs = new Set(); // global watchers
  #frozen = false;

  // ---------- writes ----------
  set(key:  any, value:  any, { ttl }:  any = {}) {
    if (this.#frozen) throw new Error('Store is frozen');
    const prev = this.#data.get(key);
    this.#data.set(key, value);

    if (this.#ttls.has(key)) this.#clearTtl(key);
    if (ttl) {
      const timer = setTimeout(() => this.delete(key), ttl).unref();
      this.#ttls.set(key, { expiresAt: Date.now() + ttl, timer });
    }

    this.#notify(key, value, prev);
    return this;
  }

  delete(key:  any) {
    if (!this.#data.has(key)) return false;
    const prev = this.#data.get(key);
    this.#data.delete(key);
    this.#clearTtl(key);
    this.#notify(key, undefined, prev);
    return true;
  }

  clear() {
    for (const key of this.#ttls.keys()) this.#clearTtl(key);
    for (const key of [...this.#data.keys()]) this.#notify(key, undefined, this.#data.get(key));
    this.#data.clear();
  }

  // ---------- subscribe ----------
  /**
   * subscribe(key, fn)  -> unsubscribe
   * subscribe(fn)       -> unsubscribe (all keys)
   * subscribe(key, { immediate: true }) -> async iterator
   */
  subscribe(fn: (value: any, prev: any, key: string) => void): () => void;
  subscribe(
    key: string,
    fn: (value: any, prev: any, key: string) => void,
    opts?: { immediate?: boolean }
  ): () => void;
  subscribe(
    key: string,
    opts?: { immediate?: boolean }
  ): AsyncGenerator<any, void, unknown>;

  subscribe(
    keyOrFn: string | ((value: any, prev: any, key: string) => void),
    maybeFn?: ((value: any, prev: any, key: string) => void) | { immediate?: boolean },
    opts: { immediate?: boolean } = {}
  ): (() => void) | AsyncGenerator<any, void, unknown> {
    // global watcher
    if (typeof keyOrFn === 'function') {
      const fn = keyOrFn;
      this.#anySubs.add(fn);
      return () => { this.#anySubs.delete(fn); };
    }

    const key = keyOrFn;

    // iterator form: no maybeFn, or second arg is an options object
    if (
      maybeFn === undefined ||
      (typeof maybeFn === 'object' && maybeFn !== null)
    ) {
      const iteratorOpts = (typeof maybeFn === 'object' && maybeFn) || opts;
      return this.#asIterator(key, iteratorOpts);
    }

    // callback form
    const fn = maybeFn;
    let set = this.#subs.get(key);
    if (!set) this.#subs.set(key, (set = new Set()));
    set.add(fn);
    if (opts.immediate && this.#data.has(key)) {
      queueMicrotask(() => fn(this.#data.get(key), undefined, key));
    }
    return () => {
      set!.delete(fn);
      if (set!.size === 0) this.#subs.delete(key);
    };
  }

  async *#asIterator(key:  any, { immediate = false } = {}) {
    // buffer events so a slow consumer doesn't lose them
    const queue: any = [];
    let resolve:  any;
    let done = false;
    const push = (v:  any) => {
      queue.push(v);
      if (resolve) { const r = resolve; resolve = null; r(); }
    };
    const unsub = this.subscribe(key, (v:  any, prev:  any) => push({ value: v, prev }));
    const stop = this.subscribe((k:  any, v:  any, prev:  any) => { if (k === key) push({ value: v, prev }); });

    try {
      if (immediate && this.has(key)) yield this.get(key);
      while (!done) {
        if (queue.length === 0) await new Promise((r) => (resolve = r));
        while (queue.length) yield queue.shift().value;
      }
    } finally {
      unsub(); stop();
    }
  }

  #notify(key:  any, value:  any, prev:  any) {
    // resolve waiters first so .then() runs before subscriber side-effects
    for (const w of [...this.#waiters] as any) {
      if (w.key !== key) continue;
      if (!w.predicate(value, prev)) continue;
      w.cleanup();
      w.resolve(value);
    }

    const set = this.#subs.get(key);
    if (set) for (const fn of set) safeCall(fn, value, prev, key);
    for (const fn of this.#anySubs) safeCall(fn, value, prev, key);
    this.emit('change', { key, value, prev });
  }

  // ---------- misc ----------
  get<T = any>(key: string): T | undefined;
  get<T = any>(key: string, fallback: T): T;
  get<T = any>(key: string, fallback?: T): T | undefined {
    return this.#data.has(key) ? this.#data.get(key) : fallback;
  }
  has(key:  any) { return this.#data.has(key); }
  toJSON() { return Object.fromEntries(this.#data); }
  freeze() { this.#frozen = true; }
  #clearTtl(key:  any) {
    const t = this.#ttls.get(key);
    if (t) { clearTimeout(t.timer); this.#ttls.delete(key); }
  }
  // store.js (additions to the Store class)

  #waiters = new Set(); // { key, predicate, resolve, reject, timer }

  /**
   * wait(key, opts?) -> Promise<value>
   *   opts.predicate(value, prev) -> boolean   // keep waiting until true
   *   opts.timeout   -> ms, rejects on timeout
   *   opts.immediate -> resolve now if predicate passes for current value
   *   opts.signal    -> AbortSignal
   */
  wait(key:  any, { predicate = () => true, timeout, immediate = true, signal }:  any = {}) {
    // Fast path: value already satisfies
    if (immediate && this.#data.has(key) && predicate(this.#data.get(key), undefined)) {
      return Promise.resolve(this.#data.get(key));
    }

    return new Promise((resolve, reject) => {
      const waiter = { key, predicate, resolve, reject, timer: null } as any;

      const cleanup = () => {
        this.#waiters.delete(waiter);
        if (waiter.timer) clearTimeout(waiter.timer);
        if (signal) signal.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        cleanup();
        const err = new Error('wait aborted');
        err.name = 'AbortError';
        reject(err);
      };

      if (timeout) {
        waiter.timer = setTimeout(() => {
          cleanup();
          const err = new Error(`wait('${key}') timed out after ${timeout}ms`);
          err.name = 'TimeoutError';
          reject(err);
        }, timeout).unref();
      }

      if (signal) {
        if (signal.aborted) return onAbort();
        signal.addEventListener('abort', onAbort, { once: true });
      }

      waiter.cleanup = cleanup;
      this.#waiters.add(waiter);
    });
  }

  // Convenience: wait for a *change* (ignore current value)
  waitChange(key:  any, opts = {}) {
    return this.wait(key, { ...opts, immediate: false });
  }

  // Convenience: wait until predicate holds for the current or next value
  waitFor(key:  any, predicate:  any, opts = {}) {
    return this.wait(key, { ...opts, predicate });
  }
}

function safeCall(fn:  any, ...args:  any) {
  try { fn(...args); } catch (e:  any) { process.emitWarning(e); }
}

module.exports = new Store();
module.exports.Store = Store;
