// #region ───────────────────────────────────────────────────────────────────────────────────────────── STORE / MAELSTROM ───
/*  ==========================================================================================================================
     Yaaaaa... I know.
     BUT... Just ignore what you don't need, and when the day comes that you do... its here.

     This now solves 4 problems, almost all of which in the end need the same thing... a set of node modules all neededing
     either the same state, store or rift ie module whether it be locally sourced or not. Each solving the problem, exactly
     the way they need to. The stores problem... is not the same as the rifts, and is not the same as the states.

     Which is why none of them, are entirely collapsed into one another.

     The 4th problem was not mentioned yet, because it basically hitched a free ride in with maelstrom, which is
     apparations. If your unfamiliar with that... basically, its offensive coding inplace of defensive coding. Instead of
     dropping a bunch of if (this || that) and all that shit... it gives the fn exactly what it requested, so both typescript
     AND the runtime will just be fucking la-di-da with no thrown errors and simply be happy with life and let the app
     continue running.
    ==========================================================================================================================
     SET / GET
     Store a value                                                                                   STORE.set("user", user)
     Store a lazily-created value                                                  STORE.setLazy("user", () => createUser())
     Retrieve a value                                                                                      STORE.get("user")
     Retrieve with fallback                                                                      STORE.get("user", fallback)
     Check whether a key exists                                                                            STORE.has("user")
     Delete a value                                                                                     STORE.delete("user")
     Remove all values                                                                                         STORE.clear()
     Retrieve all values                                                                                      STORE.getAll()
     Freeze further writes                                                                                    STORE.freeze()

     SUBSCRIPTIONS
     Subscribe to changes on a specific key                                                      STORE.subscribe("user", fn)
     Subscribe to all store changes                                                                      STORE.subscribe(fn)
     Subscribe and receive the current value immediately                    STORE.subscribe("user", fn, { immediate: true })
     Observe changes through an async iterator                                                       STORE.subscribe("user")
     Observe with an immediate initial value                                    STORE.subscribe("user", { immediate: true })
     Unsubscribe all matching listeners                                                            STORE.unsubscribeAll(fns)
     Get subscribers registered for multiple keys                                    STORE.subscribersOf(["user", "config"])

     WAITERS
     Wait for the next matching value                                                               await STORE.wait("user")
     Wait for a change, ignoring the current value                                            await STORE.waitChange("user")
     Wait until a predicate is satisfied                                              await STORE.waitFor("user", predicate)
     Wait with a timeout                                                         await STORE.wait("user", { timeout: 5000 })
     Wait with an AbortSignal                                                           await STORE.wait("user", { signal })

     ATOMIC OPERATIONS
     Set only when a key does not exist                                                      STORE.setIfAbsent("user", user)
     Set only when a key already exists                                                     STORE.setIfPresent("user", user)
     Replace an existing value                                                                   STORE.replace("user", user)
     Update using the previous value                                                            STORE.update("count", fn, 0)
     Increment a numeric value                                                                         STORE.inc("count", 1)
     Register a key without overwriting its value                                                        STORE.touch("user")

     COLLECTION / INSPECTION
     Convert store to a plain object                                                                          STORE.toJSON()
     Retrieve entries                                                                                        STORE.entries()
     Retrieve keys                                                                                              STORE.keys()
     Retrieve values                                                                                          STORE.values()
     Find a value                                                                                      STORE.find(predicate)
     Find a matching key                                                                            STORE.findKey(predicate)
     Group values                                                                                            STORE.group(fn)
     Select specific keys                                                                                   STORE.pick(keys)
     Exclude specific keys                                                                                  STORE.omit(keys)
     Create a snapshot                                                                                      STORE.snapshot()
     Compare stores                                                                                      STORE.equals(other)
     Inspect subscription state                                                                         STORE.snapshotSubs()
     ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
     STORE.STATE                                                   Scoped state is organized by root → master → slave → key.

     Retrieve a scoped state map                                                                        STORE.state.getMap()
     Retrieve a map using custom channels                                            STORE.state.getMap(slave, master, root)
     Retrieve scoped metadata                                                                      STORE.state.getMetadata()
     Read a state value                                                                                 STORE.state.get(key)
     Read using custom channels                                                                   STORE.state.get(key, opts)
     Write a state value                                                                         STORE.state.set(key, value)
     Write with notification options                                                       STORE.state.set(key, value, opts)
     Subscribe to a state key                                                           STORE.state.subscribe(key, listener)
     Check whether a state key exists                                                                   STORE.state.has(key)
     Delete a state key                                                                              STORE.state.delete(key)
     Retrieve scoped entries                                                                           STORE.state.entries()
     Clear scoped state                                                                                  STORE.state.clear()
     Schedule a key notification                                                                      STORE.state._emit(key)

     PERSISTENCE
     Mark a state key for persistence                                                               STORE.state.persist(key)
     Remove a key from persistence                                                                STORE.state.unpersist(key)
     Clear persistent values                                                                   STORE.state.clearPersistent()

     Notification scheduling is cached and flushed through the Store's
     notification pipeline. State metadata also holds batching, history,
     time-travel, listeners, waiters, contracts, conflicts and scope information.
     ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
     MAELSTROM

     MODULE RESOLUTION
     Dynamically import an ESM module                                                 await STORE.maelstrom.module("module")
     Resolve a module relative to the current module                                  STORE.maelstrom.key_for("./module.js")
     Synchronously require a module                                                STORE.maelstrom.module.require("node:fs")
     Check whether a module has loaded                                        STORE.maelstrom.module.isLoaded("./module.js")
     Retrieve a loaded module                                                STORE.maelstrom.module.getLoaded("./module.js")
     Extract a named export                                           STORE.maelstrom.module.extract_named(ns, "exportName")
     Retrieve a named export                                                  STORE.maelstrom.module.export_of("exportName")
     Retrieve a named export from a specific module            STORE.maelstrom.module.export_of("exportName", "./module.js")
     Load and resolve a named export                             STORE.maelstrom.module.named_export("module", "exportName")
     Initialize module resolution                                                      STORE.maelstrom.module.init("module")
     Initialize a named export                              STORE.maelstrom.module.init.named_export("module", "exportName")
     Check whether a module exists                                              await STORE.maelstrom.module.check("module")
     Index exports from a loaded module                                  STORE.maelstrom.module.indexExports(rift, key, mod)

     RIFT REGISTRY
     Retrieve or create a Rift                                                         STORE.maelstrom.rift("service.ready")
     Create a Rift directly                                                                      STORE.maelstrom.rift.make()
     Check whether a Rift exists                                                   STORE.maelstrom.rift.has("service.ready")
     Inspect registered Rifts                                                                 STORE.maelstrom.rift.inspect()
     Clear the Rift registry                                                                    STORE.maelstrom.rift.clear()
     Read a Rift value                                                            STORE.maelstrom.rift.read("service.ready")
     Reset a Rift                                                                STORE.maelstrom.rift.reset("service.ready")
     Delete a Rift                                                              STORE.maelstrom.rift.delete("service.ready")
     Wait for a Rift                                                      await STORE.maelstrom.rift("service.ready").wait()
     Guard execution behind a Rift                                           STORE.maelstrom.rift.guard("service.ready", fn)
     Resolve a global Rift                              STORE.maelstrom.rift.resolve.global("service.ready", timeout, value)

     RIFT RESOLUTION
     Retrieve or resolve a module through a Rift                                         STORE.maelstrom.rift.use("service")
     Create a Rift from a supplied value                                       STORE.maelstrom.rift.create("service", value)
     Read a Rift value                                                                  STORE.maelstrom.rift.read("service")
     Resolve an existing or claimed Rift                                      STORE.maelstrom.rift.resolve.global("service")
     Resolve a module with a fallback                      STORE.maelstrom.rift.resolve.global("service", timeout, fallback)
     Probe a named export with a synchs fallback    STORE.maelstrom.rift.probe("service", "./module.js", "export", fallback)
     Probe a named export w/o blocking   STORE.maelstrom.rift.use_if_available("service", "./module.js", "export", fallback)
     Conjure a module through the Rift resolver                                        STORE.maelstrom.rift.conjure(options)
     Conjure without caching                                                  STORE.maelstrom.rift.conjure.uncached(options)
     Retrieve a module Rift                                                       STORE.maelstrom.rift.conjure.get("module")

     RESULTS
     Retrieve all recorded results                                                                   STORE.maelstrom.results
     Retrieve the number of registered Rifts                                                            STORE.maelstrom.size
     Retrieve a specific result                                                       STORE.maelstrom.rift.result("service")
     Filter results by solver                                                     STORE.maelstrom.rift.resultsFrom("solver")
     Subscribe to recorded results                                                         STORE.maelstrom.rift.onResult(fn)
     Record a resolution outcome                                                STORE.maelstrom.record(label, solver, value)

     WAITERS
     Wait for one or more readiness signals                                               STORE.maelstrom.waiter("auth", fn)
     Wait for multiple signals                                                STORE.maelstrom.waiter(["auth", "config"], fn)
     Cancel a multi-signal waiter                                                          STORE.maelstrom.waiter.cancel(id)
     Wait for a Rift through a Promise                STORE.maelstrom.waiter.wait_and_promise(timeout, key, isOpen, current)

     DEFER
     Schedule execution when dependencies become available                                STORE.maelstrom.defer("cache", fn)
     Schedule execution after multiple dependencies                           STORE.maelstrom.defer(["cache", "logger"], fn)
     Provide a dependency                                              STORE.maelstrom.defer.provide("cache", cacheInstance)
     Provide multiple dependencies                                          STORE.maelstrom.defer.provide({ cache, logger })
     Resolve a dependency without a value                                     STORE.maelstrom.defer.resolve("service.ready")
     Invalidate a dependency                                               STORE.maelstrom.defer.invalidate("service.ready")
     Check whether a dependency is available                                              STORE.maelstrom.defer.has("cache")
     Retrieve a dependency                                                                STORE.maelstrom.defer.get("cache")
     Check whether a task's dependencies are ready                                         STORE.maelstrom.defer.ready(task)
     Cancel a pending task                                                                  STORE.maelstrom.defer.cancel(id)
     Inspect pending/running tasks and scheduler statistics                                  STORE.maelstrom.defer.inspect()
     Clear pending tasks                                                                       STORE.maelstrom.defer.clear()
     Drain the scheduler                                                                       STORE.maelstrom.defer.drain()

     ENVIRONMENT DETECTION
     Detect runtime and available modules                                               STORE.maelstrom.detect.environment()
     Detect a specific module                                                  STORE.maelstrom.detect.firstMatch(candidates)
     Detect all available modules                                                     STORE.maelstrom.detect.all(candidates)
     Detect a runtime capability                                          STORE.maelstrom.detect.capability("shared_worker")
     Detect the package manager                                                             STORE.maelstrom.detect.bundler()
     Inspect environment state                                                                 STORE.maelstrom.useEnvState()
     APPARATION
     Create a generic array                                                       STORE.maelstrom.apparation.array<string>()
     Create a generic object                                                     STORE.maelstrom.apparation.object<MyType>()
     Create a generic Map                                                   STORE.maelstrom.apparation.map<string, number>()
     Create a generic Set                                                           STORE.maelstrom.apparation.set<string>()
     Create a generic Promise                                                   STORE.maelstrom.apparation.promise<MyType>()
     Create a generic function                                                     STORE.maelstrom.apparation.func<MyType>()
     Create a generic WeakMap                                           STORE.maelstrom.apparation.weakMap<object, MyType>()
     Create a generic async iterable                                      STORE.maelstrom.apparation.asyncIterable<MyType>()
     Create a generic typed array                                        STORE.maelstrom.apparation.typedArray<Uint8Array>()
     Create a generic value placeholder                                             STORE.maelstrom.apparation.any<MyType>()

     RESET / LOGGING
     Log a MAELSTROM event                                                               STORE.maelstrom.log("AREA", detail)
     Reset MAELSTROM registries, tasks and environment state                                         STORE.maelstrom.reset()
    ======================================================================== ⇦✦──⇦✦──✦──✦──← 'pew pew' 🧙 [STORE/MAELSTROM] */
// #endregion ──────────────────────────────────────────────────────────────────────────────────
//                                           TYPE ALIASES (the shorthand table, carried forward)
// #region ─────────────────────────────────────────────────────────────────────────────────────
function MaybePromise(v) {
    return v !== undefined ? v : Promise.resolve(v);
}
// #endregion ──────────────────────────────────────────────────────────────────────────────────
//                                                                        Rift — the local shape
// #region ─────────────────────────────────────────────────────────────────────────────────────
//
// A named slot holding a value that may not have landed yet. In-process. It carries, on
// itself, everything the registry needs from it: the value, the open/claim state, the
// subscriber set (THE one subscription mechanism for this entry), the solver tag of whoever
// produced its value, and — when the entry holds a module — its export index and inflight
// promise. Nothing about a result is stored anywhere else.
function wait_for_promise_in_rift(gate, timeoutMs) {
    let timer;
    const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`[rift] wait() timed out after ${timeoutMs}m`)), timeoutMs);
    });
    return Promise.race([gate, timeout]).finally(() => clearTimeout(timer));
}
class Rift {
    opened = false;
    claimed = false;
    value;
    resolveFn;
    gate;
    listeners = [];
    createdAt = Date.now();
    openedAt;
    constructor() { this.makeGate(); }
    makeGate() { this.gate = new Promise((resolve) => { this.resolveFn = resolve; }); } // CHANGED: default is now "wait forever". Explicit timeout = opt-in rejection.           
    wait(timeoutMs = 0) {
        if (!timeoutMs)
            return this.gate;
        else {
            return wait_for_promise_in_rift(this.gate, timeoutMs);
        }
    }
    open(value) {
        if (this.opened)
            return;
        this.opened = true;
        this.openedAt = Date.now();
        this.value = value;
        this.resolveFn(value);
        for (const l of this.listeners)
            l(value);
    }
    reset() {
        this.opened = false;
        this.claimed = false;
        this.value = undefined;
        this.openedAt = undefined;
        this.makeGate();
    }
    claim() {
        if (this.claimed)
            return false;
        this.claimed = true;
        return true;
    }
    onOpen(listener) {
        this.listeners.push(listener);
        return () => { const i = this.listeners.indexOf(listener); if (i !== -1)
            this.listeners.splice(i, 1); };
    }
    get isOpen() { return this.opened; }
    get isClaimed() { return this.claimed; }
    get current() { return this.value; }
}
// #endregion ──────────────────────────────────────────────────────────────────────────────────
//                                                                                REACTIVE_STORE
// #region ─────────────────────────────────────────────────────────────────────────────────────
// Same contract as Rift, but the slot lives in a shared store: writes are visible to every
// reader of the same label, and onOpen subscriptions fire across all holders. Its reactive
// store is the cloud shape's own backbone — one store, one subscription mechanism.
//                                                                                               [USAGE]
// #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
/*  ====================================================================================================
     const store = require('./store');

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
    if (value === 'stop') break;   // breaking
      ============================================================= ⇦✦──⇦✦──✦──✦──← 'pew pew' 🧙 [STORE] */
// #endregion
//                                                                                               [STORE]
// #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
const { EventEmitter } = require("node:events");
class Store extends EventEmitter {
    //                                                                                           [CONSTANTS]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    #waiters = new M2(); // { key, predicate, resolve, reject, timer }
    #data = new M2();
    #subs = new M2(); // key -> Set<fn>   (key-specific)
    #anySubs = new SET2(); // global watchers
    #frozen = false;
    #context = new M2();
    #meta = new M2();
    r = "_root_k_";
    m = "_master_k_";
    s = "_slave_k_";
    // #endregion
    //                                                                                               [STATE]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    _globalNotifyCache = new WeakMap();
    _notifyCache = new WeakMap();
    state = {
        getMap: (slave = this.s, master = this.m, rk = this.r) => {
            let root = this.#context.get(rk); // (globalThis as any)[rk]  //  ; (globalThis as any)[rk] = root;
            if (!root) {
                root = new M2();
                this.#context.set(rk, root);
            }
            let masterMap = root.get(master);
            if (!masterMap) {
                masterMap = new M2();
                root.set(master, masterMap);
            }
            let slaveMap = masterMap.get(slave);
            if (!slaveMap) {
                slaveMap = new M2();
                masterMap.set(slave, slaveMap);
            }
            return slaveMap;
        },
        getMetadata: (s = this.s, m = this.m, r = this.r) => {
            let root = this.#meta.get(r); //  (globalThis as A)[r]; // STATE_CONTEXT === "sauron" ?  : null;
            if (!root) {
                root = new M2();
                globalThis[r] = root;
            }
            let masterMap = root.get(m);
            if (!masterMap) {
                masterMap = new M2();
                root.set(m, masterMap);
            }
            let metaMap = masterMap.get(s);
            if (!metaMap) {
                metaMap = {
                    _batches: new Set(),
                    _batchQueue: new Map(),
                    _batchOpts: new Map(),
                    _history: new Map(),
                    _timeTravel: new Map(),
                    _globalListeners: new Set(),
                    _global_subscribers: new Map(),
                    _waiters: new Map(),
                    _sys: new Map(),
                    _sealed: new Set(),
                    _frozen: new Set(),
                    _keyContracts: new Map(),
                    _conflicts: new Map(),
                    _conflictStrategies: new Map(),
                    _causal: new Map(),
                    _scopes: new Map(),
                    _msgHandlers: new Map(),
                    _lastWriteSource: new Map(),
                    _mainMap: new Map(),
                    _tupleCache: new Map(),
                    _weakMap: new WeakMap(),
                    _boundaries: new WeakMap(),
                };
                masterMap.set(s, metaMap);
            }
            return metaMap;
        },
        get: (key, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _state = this.getMap(sl_reg, ms_reg, globalKey);
            const _persistent = this.state.getMap(`${sl_reg}_PERSISTENT`, ms_reg, globalKey);
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            // recordDependency(key)
            if (_state.has(key))
                return MaybePromise(_state.get(key));
            if (_persistKeys.has(key) && _persistent.has(key)) {
                const v = _persistent.get(key);
                _state.set(key, v);
                return MaybePromise(v);
            }
            return undefined;
        },
        set: (key, value, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r, triggerRender: true, cap: 200 }) => {
            const { triggerRender = true, sl_reg, ms_reg, globalKey, cap } = opts;
            const _state = this.state.getMap(sl_reg, ms_reg, globalKey);
            const _persistent = this.state.getMap(`${sl_reg}_PERSISTENT`, ms_reg, globalKey);
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            const _listeners = this.state.getMap(`${sl_reg}_LISTENERS`, ms_reg, globalKey);
            const prev = _state.get(key);
            const next = typeof value === "function" ? value(prev) : value;
            if (Object.is(prev, next))
                return;
            // TIME TRAVEL
            if (!this.root.TIME_TRAVEL._time_travel_reverting) {
                const meta = this.state.getMetadata(sl_reg, ms_reg, globalKey);
                let hist = meta._history.get(key);
                if (!hist) {
                    hist = [];
                    meta._history.set(key, hist);
                }
                const lastActive = hist.findLastIndex((e) => !e.undone) ?? -1;
                if (lastActive < hist.length - 1)
                    hist.length = lastActive + 1; // truncate redo tail
                hist.push({ k: (hist[hist.length - 1]?.k ?? 0) + 1, prev, next, ts: Date.now(), undone: false });
                const cap_val = cap ?? 200;
                while (hist.length > cap_val)
                    hist.shift();
            }
            _state.set(key, next);
            if (_persistKeys.has(key))
                _persistent.set(key, next);
            if (triggerRender)
                this.state.scheduleGlobalNotify(key, this.getMetadata(sl_reg, ms_reg, globalKey), opts);
            if (triggerRender)
                this.state.scheduleNotify(key, _listeners, _state);
            return MaybePromise(next);
        },
        subscribe: (key, listener, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _listeners = this.state.getMap(`${sl_reg}_LISTENERS`, ms_reg, globalKey);
            if (!_listeners.has(key))
                _listeners.set(key, new Set());
            _listeners.get(key).add(listener);
            return () => {
                _listeners.get(key)?.delete(listener);
                if (_listeners.get(key)?.size === 0)
                    _listeners.delete(key);
            };
        },
        delete: (key, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _state = this.state.getMap(sl_reg, ms_reg, globalKey);
            const _persistent = this.state.getMap(`${sl_reg}_PERSISTENT`, ms_reg, globalKey);
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            const _listeners = this.state.getMap(`${sl_reg}_LISTENERS`, ms_reg, globalKey);
            const existed = _state.delete(key);
            if (_persistKeys.has(key)) {
                _persistKeys.delete(key);
                _persistent.delete(key);
            }
            _listeners.get(key)?.forEach((l) => l(undefined));
            _listeners.delete(key);
            return MaybePromise(existed);
        },
        entries: (opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _state = this.state.getMap(sl_reg, ms_reg, globalKey);
            return MaybePromise(Array.from(_state.entries()));
        },
        persist: (key, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            _persistKeys.set(key, true);
        },
        unpersist: (key, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _persistent = this.state.getMap(`${sl_reg}_PERSISTENT`, ms_reg, globalKey);
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            _persistKeys.delete(key);
            _persistent.delete(key);
        },
        has: (key, opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _state = this.state.getMap(sl_reg, ms_reg, globalKey);
            const _persistent = this.state.getMap(`${sl_reg}_PERSISTENT`, ms_reg, globalKey);
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            return _state.has(key) || (_persistKeys.has(key) && _persistent.has(key));
        },
        clear: (opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _state = this.state.getMap(sl_reg, ms_reg, globalKey);
            const _listeners = this.state.getMap(`${sl_reg}_LISTENERS`, ms_reg, globalKey);
            _state.clear();
            _listeners.clear();
        },
        clearPersistent: (opts = { sl_reg: this.s, ms_reg: this.m, globalKey: this.r }) => {
            const { sl_reg, ms_reg, globalKey } = opts;
            const _persistent = this.state.getMap(`${sl_reg}_PERSISTENT`, ms_reg, globalKey);
            const _persistKeys = this.state.getMap(`${sl_reg}_PERSIST_KEYS`, ms_reg, globalKey);
            _persistent.clear();
            _persistKeys.clear();
        },
        _emit: (key, sl_reg = this.s, ms_reg = this.m, globalKey = this.r) => {
            const opts = { sl_reg, ms_reg, globalKey };
            const _state = this.state.getMap(sl_reg, ms_reg, globalKey);
            const _listeners = this.state.getMap(`${sl_reg}_LISTENERS`, ms_reg, globalKey);
            const meta = this.state.getMetadata(sl_reg, ms_reg, globalKey);
            this.state.scheduleNotify(key, _listeners, _state);
            this.state.scheduleGlobalNotify(key, meta, opts);
        },
        scheduleNotify: (key, _listeners, _state) => {
            let cache = this._notifyCache.get(_listeners);
            if (!cache) {
                cache = new Map();
                this._notifyCache.set(_listeners, cache);
            }
            let fn = cache.get(key);
            if (!fn) {
                fn = () => {
                    cache.delete(key);
                    const val = _state.get(key);
                    _listeners.get(key)?.forEach((l) => l(val));
                };
                cache.set(key, fn);
            }
            this.onFlush(fn);
        },
        scheduleGlobalNotify: (key, meta, opts) => {
            let cache = this._globalNotifyCache.get(meta);
            if (!cache) {
                cache = new Map();
                this._globalNotifyCache.set(meta, cache);
            }
            let fn = cache.get(key);
            if (!fn) {
                fn = () => {
                    cache.delete(key);
                    const finalVal = this.store.get(key, opts);
                    const waiters = meta._waiters.get(key);
                    if (waiters) {
                        for (const resolveFn of waiters) {
                            try {
                                resolveFn(finalVal);
                            }
                            catch (err) {
                                console.error(`[Sauron Waiter Error]:`, err);
                            }
                        }
                        meta._waiters.delete(key);
                    }
                    for (const listener of meta._globalListeners) {
                        try {
                            listener(key, finalVal);
                        }
                        catch (err) {
                            console.error(`[Sauron Global Listener Error]:`, err);
                        }
                    }
                };
                cache.set(key, fn);
            }
            this.onFlush(fn);
        },
    };
    // #endregion
    //                                                                                                 [SET]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    set(key, value) {
        if (this.#frozen)
            throw new Error("Store is frozen");
        const prev = this.#data.swap(key, value); // returns previous, writes new
        this.#notify(key, value, prev);
        return this;
    }
    setLazy(key, make) {
        const prev = this.#data.g(key);
        const value = make();
        this.#data.s(key, value);
        this.#notify(key, value, prev);
        return this;
    }
    delete(key) {
        if (!this.#data.h(key))
            return false;
        const prev = this.#data.take(key);
        this.#notify(key, undefined, prev);
        return true;
    }
    clear() {
        for (const key of this.#data.toKeys())
            this.#notify(key, undefined, this.#data.g(key));
        this.#data.clear();
    }
    subscribe(keyOrFn, maybeFn, opts = {}) {
        // global watcher
        if (typeof keyOrFn === "function") {
            const fn = keyOrFn;
            this.#anySubs.add(fn);
            return () => {
                this.#anySubs.delete(fn);
            };
        }
        const key = keyOrFn;
        // iterator form: no maybeFn, or second arg is an options object
        if (maybeFn === undefined || (typeof maybeFn === "object" && maybeFn !== null)) {
            const iteratorOpts = (typeof maybeFn === "object" && maybeFn) || opts;
            return this.#asIterator(key, iteratorOpts);
        }
        // callback form
        const fn = maybeFn;
        let set = this.#subs.getOrM(() => new SET2(), key);
        set.add(fn);
        if (opts.immediate && this.#data.has(key)) {
            queueMicrotask(() => fn(this.#data.get(key), undefined, key));
        }
        // unsubscribe
        return () => {
            const set = this.#subs.g(key);
            if (!set)
                return;
            set.delete(fn);
            if (set.size === 0)
                this.#subs.d(key);
        };
    }
    unsubscribeAll(fns) {
        for (const set of this.#subs.values())
            set.deleteAll(fns);
        this.#anySubs.deleteAll(fns);
    }
    subscribersOf(keys) {
        let out = new SET2();
        for (const key of keys) {
            const set = this.#subs.g(key);
            if (set)
                out = out.union(set);
        }
        return out;
    }
    async *#asIterator(key, { immediate = false } = {}) {
        // buffer events so a slow consumer doesn't lose them
        const queue = [];
        let resolve;
        let done = false;
        const push = (v) => {
            queue.push(v);
            if (resolve) {
                const r = resolve;
                resolve = null;
                r();
            }
        };
        const unsub = this.subscribe(key, (v, prev) => push({ value: v, prev }));
        const stop = this.subscribe((k, v, prev) => {
            if (k === key)
                push({ value: v, prev });
        });
        try {
            if (immediate && this.has(key))
                yield this.get(key);
            while (!done) {
                if (queue.length === 0)
                    await new Promise((r) => (resolve = r));
                while (queue.length)
                    yield queue.shift().value;
            }
        }
        finally {
            unsub();
            stop();
        }
    }
    #notify(key, value, prev) {
        const waiting = this.#waiters.get(key);
        if (waiting) {
            for (const w of waiting) {
                if (!w.predicate(value, prev))
                    continue;
                w.cleanup();
                w.resolve(value);
            }
        }
    }
    get(key, fallback) {
        return this.#data.has(key) ? this.#data.get(key) : fallback;
    }
    getAll() {
        return this.#data.clone();
    }
    has(key) {
        return this.#data.has(key);
    }
    freeze() {
        this.#frozen = true;
    }
    // #endregion
    //                                                                                                [WAIT]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    /*  ====================================================================================================
     wait(key, opts?) -> Promise<value>

     opts.predicate(value, prev) -> boolean   // keep waiting until true

     opts.timeout   -> ms, rejects on timeout

     opts.immediate -> resolve now if predicate passes for current value

     opts.signal    -> AbortSignal
    ============================================================= ⇦✦──⇦✦──✦──✦──← 'pew pew' 🧙 [STORE] */
    wait(key, { predicate = () => true, timeout, immediate = true, signal } = {}) {
        // Fast path: value already satisfies
        if (immediate && this.#data.has(key) && predicate(this.#data.get(key), undefined)) {
            return Promise.resolve(this.#data.get(key));
        }
        return new Promise((resolve, reject) => {
            const waiter = { key, predicate, resolve, reject, timer: null };
            const cleanup = () => {
                this.#waiters.delete(waiter);
                if (waiter.timer)
                    clearTimeout(waiter.timer);
                if (signal)
                    signal.removeEventListener("abort", onAbort);
            };
            const onAbort = () => {
                cleanup();
                const err = new Error("wait aborted");
                err.name = "AbortError";
                reject(err);
            };
            if (timeout) {
                waiter.timer = setTimeout(() => {
                    cleanup();
                    const err = new Error(`wait('${key}') timed out after ${timeout}ms`);
                    err.name = "TimeoutError";
                    reject(err);
                }, timeout).unref();
            }
            if (signal) {
                if (signal.aborted)
                    return onAbort();
                signal.addEventListener("abort", onAbort, { once: true });
            }
            waiter.cleanup = cleanup;
            this.#waiters.getOrM(() => new SET2(), key).add(waiter);
        });
    } // Convenience: wait for a *change* (ignore current value)
    waitChange(key, opts = {}) {
        return this.wait(key, { ...opts, immediate: false });
    }
    // Convenience: wait until predicate holds for the current or next value
    waitFor(key, predicate, opts = {}) {
        return this.wait(key, { ...opts, predicate });
    }
    // #endregion
    //                                                                                              [ATOMIC]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    setIfAbsent(key, value) {
        if (!this.#data.setIfAbsent(key, value))
            return false;
        this.#notify(key, value, undefined);
        return true;
    }
    setIfPresent(key, value) {
        const prev = this.#data.g(key);
        if (!this.#data.setIfPresent(key, value))
            return false;
        this.#notify(key, value, prev);
        return true;
    }
    replace(key, value) {
        return this.setIfPresent(key, value);
    }
    update(key, fn, initial) {
        const had = this.#data.h(key);
        const prev = had ? this.#data.g(key) : undefined;
        const next = this.#data.update(key, fn, initial);
        this.#notify(key, next, prev);
        return next;
    }
    inc(key, by = 1) {
        const prev = this.#data.g(key);
        const next = this.#data.inc(key, by);
        this.#notify(key, next, prev);
        return next;
    }
    touch(key) {
        // register interest without overwriting — useful for the "subscribed but not yet written" case
        if (!this.#data.setIfAbsent(key, undefined))
            return false;
        this.#notify(key, undefined, undefined);
        return true;
    }
    // #endregion
    //                                                                                               [OTHER]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    toJSON() {
        return this.#data.toObject();
    }
    entries() {
        return this.#data.toArray();
    }
    keys() {
        return this.#data.toKeys();
    }
    values() {
        return this.#data.toValues();
    }
    find(pred) {
        return this.#data.find(pred);
    }
    findKey(pred) {
        return this.#data.findKey(pred);
    }
    group(fn) {
        return this.#data.group(fn);
    }
    pick(keys) {
        return this.#data.pick(keys);
    }
    omit(keys) {
        return this.#data.omit(keys);
    }
    snapshot() {
        return this.#data.clone();
    }
    equals(other) {
        return this.#data.equals(other);
    }
    snapshotSubs() {
        return this.#subs.mapValues((set) => set.clone());
    }
    // #endregion
    //                                                                                                [SLAB]
    // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════
    #rifts = new M2();
    #deferTasks = new M2();
    #multiWaiters = new SET2();
    nextWaiterId = 0;
    // ══ THE ONE SCHEDULER STATE ═════════════════════════════════════════════════════════════════
    // Deferred tasks (not results — the results ARE the registry entries above).
    nextDeferId = 0;
    draining = false;
    drainAgain = false;
    deferStats = { registered: 0, executed: 0, completed: 0, failed: 0, cancelled: 0 };
    autoCloud = undefined;
    warnedUseBeforeReady = false;
    ENV_STATE = { moduleLevel: null, platform: null, compilers: [], bundler: null, adapters: [], ready: false };
    shout = new ORC_SHOUT();
    /** the results view — computed from the ONE registry, stored nowhere */
    get results() {
        const out = [];
        for (const [label, rift] of this.#rifts) {
            const r = rift;
            if (r.solver === undefined)
                continue;
            out.push({
                label,
                solver: r.solver,
                store: (r.store ?? "local"),
                value: rift.current,
                ok: rift.current !== undefined && rift.current !== null,
                openedAt: rift.openedAt ?? rift.createdAt,
            });
        }
        return out;
    }
    get size() { return this.#rifts.size; }
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    // SOLVER · detect_environment — the cartographer
    // ═══════════════════════════════════════════════════════════════════════════════════════════
    static MODULE_LEVEL_CANDIDATES = ["typescript", "rollup", "vite", "eslint", "babel", "postcss", "tailwindcss", "@babel/core", "prettier", "stylelint", "sass", "less", "jest", "vitest", "playwright", "@types/vscode"];
    static PLATFORM_CANDIDATES = ["PROJECT_PLATFORM_KILLER", "react", "preact", "@remix-run/react", "@react-router/react", "next", "nuxt", "svelte", "solid", "vite", "arfa", "vue", "angular", "astro", "gatsby", "dojo", "inferno", "lupine", "ember-source", "backbone", "alpinejs", "lit", "marko", "@builder.io/qwik", "solid-start", "@sveltejs/kit", "meteor", "stencil", "aurelia", "nodiff", "qwik", "velo-type", "webpack"];
    static COMPILER_CANDIDATES = ["rspack", "webpack", "vite", "rollup", "esbuild", "swc-loader", "babel", "next", "nuxt", "@remix-run/react", "@react-router/react", "svelte", "solid", "vue", "@swc/core", "turbopack", "parcel", "tsup", "unbuild", "esbuild-loader", "@babel/core", "terser", "@angular/core", "@angular/compile"];
    static BUNDLER_CANDIDATES = ["bun", "pnpm", "yarn", "npm"];
    static ADAPTER_CANDIDATES = ["websocket_dev_server", "cross_app_ws_server", "terminal_ngin_proxy_register", "terminal_ngin_proxy", "workspace_hub_server", "workspace_hub_client", "cross_app_ws_client", "cse_cross_app_server", "cse_cross_app_client", "shared_worker", "service_worker", "unix_worker", "broadcastr_channel", "websocket", "websocket_server", "websocket_client", "webrtc", "webrtc_server", "webrtc_client", "electron_server", "electron_client", "mqtt", "sse", "named_pipe", "worker_thread", "native_msg_host", "native_msg_client"];
    static CAPABILITY_CANDIDATES = ["shared_worker", "service_worker", "unix_worker", "broadcastr_channel", "electron_server", "electron_client", "named_pipe", "native_msg_host", "native_msg_client"];
    maelstrom = (() => {
        const fn = () => { };
        fn.log = (where, detail = {}, type = "info") => {
            const payload = { ...detail };
            if (payload.error instanceof Error)
                payload.error = payload.error.message;
            this.shout.log(`[MAELSTROM][${where}]`, payload, this.shout.t[type] ?? this.shout.t.deep);
        }; /** resolve a specifier relative to THIS file, always. Absolute out. */
        fn.key_for = (specifier) => {
            try {
                return import.meta.resolve(specifier);
            }
            catch {
                try {
                    return new URL(specifier, import.meta.url).href;
                }
                catch {
                    return specifier;
                }
            }
        };
        fn.normalizeFallback = (fallback, fallbackDefault) => {
            if (typeof fallback === "function")
                return fallback;
            if (fallback !== undefined)
                return () => fallback;
            return fallbackDefault;
        }; /** the safe proxy — missing module access is suppressed, never crashed */
        fn.createSafeProxy = () => new Proxy(function noop() { }, {
            get: (_, prop) => {
                if (prop === Symbol.toPrimitive) {
                    this.maelstrom.log("SAFE_PROXY", { note: `Missing module. Suppressed access to: ${String(prop)}` }, "warn");
                    return () => "";
                }
                if (prop === "valueOf" || prop === "toString") {
                    this.maelstrom.log("SAFE_PROXY", { note: `Missing module. Suppressed access to: ${String(prop)}` }, "warn");
                    return () => "[MAELSTROM:missing-module]";
                }
                if (prop === "then" || prop === Symbol.iterator)
                    return undefined;
                const noop = () => { };
                return new Proxy(noop, {
                    get: () => noop,
                    apply: () => this.maelstrom.createSafeProxy(),
                    construct: () => this.maelstrom.createSafeProxy(),
                });
            },
            apply: () => this.maelstrom.createSafeProxy(),
            construct: () => this.maelstrom.createSafeProxy(),
        });
        fn.toNamespace = (m) => {
            if (m && typeof m === "object")
                return m;
            return { default: m };
        };
        fn.blind = (() => {
            const fn = () => { };
            /** dynamic import with no static dependency — works in every module system */
            fn.import = new Function("specifier", "return import(specifier)");
            /** require with no static dependency — null where require does not exist (browser/ESM) */
            fn.require = typeof require !== "undefined" ? new Function("specifier", "return require(specifier)") : null;
            return fn;
        })();
        fn.has = (() => {
            const fn = () => { };
            const blindReq = typeof require !== "undefined" ? new Function("specifier", "return require(specifier)") : null;
            fn.bun = typeof process !== "undefined" && !!process?.versions?.bun;
            fn.node = typeof process !== "undefined" && !!process?.versions?.node;
            /** does a local file exist, resolved from cwd — the has_local probe */
            fn.local = (filePath, module) => {
                try {
                    if (!this.maelstrom.has.node && !this.maelstrom.has.bun)
                        return false;
                    if (!filePath) {
                        this.maelstrom.log("HAS_LOCAL", { note: "FILE PATH UNDEFINED — DEFINE A PATH", module, type: "SYNC" }, "error");
                        return false;
                    }
                    const path = this.maelstrom.blind.require("path");
                    const fs = this.maelstrom.blind.require("fs");
                    const resolved = path.resolve(process.cwd(), filePath);
                    return fs.existsSync(resolved);
                }
                catch (e) {
                    this.maelstrom.log("HAS_LOCAL", { module, type: "SYNC", error: e }, "error");
                    return false;
                }
            };
            fn.require = blindReq !== null;
            return fn;
        })();
        fn.is = (() => {
            const blindReq = typeof require !== "undefined" ? new Function("specifier", "return require(specifier)") : null;
            const fn = () => { };
            fn.require_available = () => {
                return blindReq !== null;
            };
            fn.browser = typeof window !== "undefined";
            fn.VSCode = typeof process !== "undefined" && process.env.VSCODE_PID;
            fn.electron = false;
            fn.unix = false;
            fn.windows = true;
            return fn;
        })();
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        // THE SHARED RESULTS SURFACE — a view onto the ONE registry, not a second map
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        /**
         * Record an outcome. This is the single funnel: it tags the registry entry, notifies the
         * entry's subscribers, advances every waiter on the label, and releases deferred tasks.
         * It writes to the ONE registry — it creates no maps.
         */
        fn.record = (label, solver, value, store = "local") => {
            const rift = this.maelstrom.rift(label);
            rift.solver = solver;
            rift.store = store;
            rift.version++;
            const rec = {
                label,
                solver,
                store,
                value,
                ok: value !== undefined && value !== null,
                openedAt: rift.openedAt ?? Date.now(),
            };
            rift.open(value); // the entry itself notifies its own subscribers
            this.maelstrom.rift("__results__").reset(); // sentinel re-fires per record (open is idempotent)
            this.maelstrom.rift("__results__").open(rec); // machine-level watchers ride the same mechanism
            this.maelstrom.waiter.releaseMulti(label, value);
            this.maelstrom.defer.drain();
        };
        fn.rift = (() => {
            /**
             * get_module: require the specifier → local file read → builtin check → cwd-resolved
             * require → async import as the last resort. Every sync path is tried before anything
             * returns a promise.
             */
            const fn = (name) => {
                if (!this.#rifts.has(name))
                    this.#rifts.set(name, this.maelstrom.rift.make());
                return this.#rifts.get(name);
            };
            fn.clear = () => {
                this.#rifts.clear();
            };
            fn.inspect = () => {
                return [...this.#rifts.entries()].map(([name, rift]) => ({
                    name,
                    isOpen: rift.isOpen,
                    isClaimed: rift.isClaimed,
                    createdAt: rift.createdAt,
                    openedAt: rift.openedAt,
                }));
            };
            /** guard — wait for a rift, then run a fn on its unlock value */
            fn.guard = (name, fn, timeoutMs) => {
                MaybePromise(this.maelstrom.rift.guard_promise_gate(this.get, name, fn, timeoutMs));
            };
            /** async load with inflight dedupe — same key always resolves to the same promise */
            fn.load = (specifier) => {
                const key = this.maelstrom.key_for(specifier);
                const rift = this.maelstrom.rift(`mod:${key}`);
                if (rift.isOpen)
                    return Promise.resolve(rift.current);
                if (rift.inflight)
                    return rift.inflight;
                const p = this.maelstrom.blind
                    .import(key)
                    .then((mod) => {
                    rift.open(mod);
                    this.maelstrom.module.indexExports(rift, key, mod);
                    rift.inflight = undefined;
                    this.maelstrom.record(`mod:${key}`, "load_module", mod);
                    return mod;
                })
                    .catch((err) => {
                    rift.inflight = undefined; // let it retry later
                    throw err;
                });
                rift.inflight = p;
                return p;
            };
            fn.result = (label) => {
                const rift = this.#rifts.get(label);
                if (!rift || rift.solver === undefined)
                    return undefined;
                return {
                    label,
                    solver: rift.solver,
                    store: (rift.store ?? "local"),
                    value: rift.current,
                    ok: rift.current !== undefined && rift.current !== null,
                    openedAt: rift.openedAt ?? rift.createdAt,
                };
            };
            fn.resultsFrom = (solver) => {
                return this.results.filter((r) => r.solver === solver);
            }; /** "any result, any solver" — rides the ONE mechanism: the sentinel entry's own subscription */
            fn.onResult = (listener) => {
                return this.maelstrom.rift("__results__").onOpen(() => listener(this.maelstrom.rift.result("__results__")));
            };
            fn.place = (label, value, store = "local") => {
                this.maelstrom.rift(label).open(value);
                this.maelstrom.record(label, "place", value, store);
            };
            fn.get_value = (label) => {
                return this.maelstrom.rift.read(label);
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // SOLVER · get / place — the plain registry read and write
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.read = (label, store = "local") => {
                const rift = this.maelstrom.rift(label);
                const v = rift.current;
                this.maelstrom.record(label, "get", v, store);
                return v;
            };
            fn.clear = () => {
                this.#rifts.clear();
            };
            fn.reset = (name) => {
                this.#rifts.get(name)?.reset();
            };
            fn.delete = (name) => {
                return this.#rifts.delete(name);
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // the bandit. Never throws, always returns a usable envelope.
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.bandit = (label, module, wait, store = "local") => {
                let v;
                try {
                    v = this.maelstrom.rift(label);
                    if (v.isOpen) {
                        // check rift registry, return current
                        try {
                            return MaybePromise({ is_waiting: false, isLoaded: true, get: v.current });
                        }
                        catch (e) {
                            this.maelstrom.log("SMASH_N_GRAB", { msg: "[CHECK RIFT REG, RETURN CURRENT][FAILED][MOVING ON...]", error: e }, "error");
                        }
                    }
                    if (!module && wait) {
                        // no module but a wait → wait for it
                        try {
                            this.maelstrom.log("SMASH_N_GRAB", { msg: "[NO MODULE BUT WAIT SUPPLIED — WAITING]" }, "info");
                            const raw = v.wait(wait);
                            const envelope = (w) => MaybePromise({ is_waiting: !w, isLoaded: module ? this.maelstrom.rift.has(module) : false, mod: w });
                            if (raw instanceof Promise) {
                                // a rejected wait is a miss, not a crash
                                return MaybePromise(raw.then((w) => envelope(w), (e) => {
                                    this.maelstrom.log("SMASH_N_GRAB", { msg: "[WAIT TIMED OUT — RETURNING MISS]", error: e }, "warn");
                                    return envelope(undefined);
                                }));
                            }
                            return envelope(raw);
                        }
                        catch (e) {
                            this.maelstrom.log("SMASH_N_GRAB", { msg: "[WAIT PATH FAILED][MOVING ON...]", error: e }, "error");
                        }
                    }
                    if (label && module && !wait) {
                        // label + module, no wait → open
                        try {
                            return MaybePromise({ is_waiting: false, isLoaded: true, mod: v.open(module) });
                        }
                        catch (e) {
                            // all else fails — nuke it
                            const value = this.maelstrom.module(module);
                            this.maelstrom.log("SMASH_N_GRAB", { msg: "try failed, attempting catch gate now...", error: e }, "error");
                            v.open(value);
                            this.maelstrom.record(label, "smash_n_grab", value, store);
                            return MaybePromise({ is_waiting: false, isLoaded: true, mod: value });
                        }
                    }
                }
                catch (e) {
                    this.maelstrom.log("SMASH_N_GRAB", { error: e }, "error");
                }
                const ap = this.maelstrom.apparation.func();
                return MaybePromise({ is_waiting: false, isLoaded: false, mod: ap });
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // SOLVER · create_rift — the founder
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.create = (label, module, store = "local") => {
                try {
                    if (module) {
                        this.maelstrom.rift(label).open(module);
                        this.maelstrom.record(label, "create_rift", module, store);
                        return MaybePromise(module);
                    }
                }
                catch (e) {
                    const value = this.maelstrom.module(module);
                    if (value && !(value instanceof Promise)) {
                        this.maelstrom.rift(label).open(value);
                        this.maelstrom.record(label, "create_rift", value, store);
                        return MaybePromise(value);
                    }
                    this.maelstrom.log("CREATE_RIFT", { error: e, msg: "try failed, attempting catch gate now..." }, "error");
                }
                return undefined;
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // SOLVER · use_rift — the traveler. The full resolution ladder.
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.use = (label, wait, apparation, store = "local") => {
                try {
                    const rift = this.maelstrom.rift(label);
                    if (rift.isOpen) {
                        this.maelstrom.record(label, "use_rift", rift.current, store);
                        return MaybePromise(rift.current);
                    }
                    if (rift.isClaimed) {
                        try {
                            return MaybePromise(rift.wait(wait));
                        }
                        catch (e) {
                            this.maelstrom.log("USE_RIFT", { msg: "try failed...", error: e }, "error");
                        }
                    }
                    const value = this.maelstrom.module(label);
                    if (value && !(value instanceof Promise)) {
                        rift.open(value);
                        this.maelstrom.record(label, "use_rift", value, store);
                        return MaybePromise(value);
                    }
                    this.maelstrom.record(label, "use_rift", apparation, store);
                    return apparation;
                }
                catch (e) {
                    this.maelstrom.log("USE_RIFT", { error: e }, "error");
                    return apparation;
                }
            };
            fn.resolve = (() => {
                // ═══════════════════════════════════════════════════════════════════════════════════════════
                // SOLVER · resolve_global_rift / resolve_rift_initial — the diplomat and the bootstrap
                // ═══════════════════════════════════════════════════════════════════════════════════════════
                const cn = (name, v) => {
                    try {
                        return this.maelstrom.rift.resolve.global(name, 15000, v);
                    }
                    catch (e) {
                        this.maelstrom.log("RESOLVE_RIFT_INITIAL", { error: e }, "error");
                        return e?.error ?? v;
                    }
                };
                cn.global = (name, wait = 20000, fallback) => {
                    try {
                        const rift = this.maelstrom.rift(name);
                        if (rift.isOpen)
                            return rift.current;
                        if (rift.isClaimed) {
                            try {
                                return MaybePromise(rift.wait(wait));
                            }
                            catch (e) {
                                this.maelstrom.log("RESOLVE_GLOBAL_RIFT", { error: e }, "error");
                                return fallback;
                            }
                        }
                        return fallback;
                    }
                    catch (e) {
                        this.maelstrom.log("RESOLVE_GLOBAL_RIFT", { error: e }, "error");
                        return fallback;
                    }
                };
                return cn;
            })();
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // SOLVER · has — the scout. Four probes, one boolean.
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.has = (module) => {
                if (this.#rifts.has(module))
                    return true;
                if (this.maelstrom.module.isLoaded(module))
                    return true;
                if (this.maelstrom.rift(module).isOpen)
                    return true;
                try {
                    this.maelstrom.blind.require(module);
                    return true;
                }
                catch {
                    try {
                        void this.maelstrom.blind.import(module);
                        return true;
                    }
                    catch {
                        return false;
                    }
                }
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // THE REGISTRY — every solver reads and writes through here, and nowhere else
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.make = () => {
                return new Rift();
            }; /** true when a shared store can actually round-trip */
            fn.conjure = (() => {
                // ═══════════════════════════════════════════════════════════════════════════════════════════
                // SOLVER · conjure — the conjurer. The full cached/uncached pair.
                // ═══════════════════════════════════════════════════════════════════════════════════════════
                /** cached conjuration — one registry entry per moduleName, claimed once, waited on forever after */
                const cn = (options) => {
                    const { moduleName, fallback: rawFallback, module = true, cache = true, preferRequire = false, importPromise, ...userEnvImports } = options;
                    const fallback = this.maelstrom.normalizeFallback(rawFallback, this.maelstrom.createSafeProxy);
                    if (!moduleName || !cache) {
                        return this.maelstrom.rift.conjure.uncached({ moduleName, fallback: fallback(), module, preferRequire, importPromise, ...userEnvImports });
                    }
                    const rift = this.maelstrom.rift(moduleName);
                    if (rift.isOpen)
                        return rift.wait();
                    if (!rift.claim())
                        return rift.wait();
                    const result = this.maelstrom.rift.conjure.uncached({ moduleName, fallback, module, preferRequire, importPromise, ...userEnvImports });
                    const settle = (resolved) => {
                        rift.open(resolved);
                        this.maelstrom.record(moduleName, "conjure", resolved);
                        return resolved;
                    };
                    return MaybePromise(result instanceof Promise ? result.then(settle) : settle(result));
                }; /** conjure a rift for a whole module namespace */
                cn.get = (label, cache = true, module = true) => {
                    const rift = this.maelstrom.rift(label);
                    if (rift.isOpen)
                        return rift;
                    const raw = this.maelstrom.rift.conjure({ moduleName: label, module, cache });
                    const result = MaybePromise(raw);
                    if (rift.isOpen) {
                        return MaybePromise(rift);
                    }
                    else if (raw) {
                        return MaybePromise(raw);
                    }
                    else {
                        const resolve = (resolved) => {
                            if (resolved === undefined || resolved === null)
                                return resolved;
                            rift.open(resolved);
                            this.maelstrom.record(label, "conjure", resolved);
                            return resolved?.[label];
                        };
                        return MaybePromise(result instanceof Promise ? result.then(resolve) : resolve(result));
                    }
                }; /** the agnostic auto importer: if it doesn't exist, it doesn't crash */
                cn.uncached = (options) => {
                    const { moduleName, fallback: rawFallback, comp_name, module = true, preferRequire = false, importPromise, ...userEnvImports } = options;
                    const fallback = this.maelstrom.normalizeFallback(rawFallback, this.maelstrom.createSafeProxy);
                    const forceNode = userEnvImports.force !== undefined;
                    const state = {
                        moduleLevel: null,
                        platform: null,
                        compilers: [],
                        bundler: null,
                        adapters: [],
                        ready: false,
                    };
                    const priorityKeys = state ? [...state.adapters, ...state.compilers, state.moduleLevel, state.platform, state.bundler] : [];
                    const resolveImportCandidate = async (candidate) => {
                        if (!candidate)
                            return null;
                        try {
                            const resolved = typeof candidate.then === "function" ? await candidate : candidate;
                            return resolved ?? null;
                        }
                        catch {
                            return null;
                        }
                    };
                    let syncResult = undefined;
                    let needsAsync = false;
                    if (!module || (importPromise && !moduleName)) {
                        if (importPromise && typeof importPromise.then !== "function") {
                            syncResult = importPromise;
                        }
                        else if (importPromise) {
                            needsAsync = true;
                        }
                        else {
                            for (const value of Object.values(userEnvImports)) {
                                if (value && typeof value === "object" && typeof value.then === "function") {
                                    needsAsync = true;
                                    break;
                                }
                                if (value !== null && value !== undefined) {
                                    syncResult = value;
                                    break;
                                }
                            }
                            if (!needsAsync && syncResult === undefined) {
                                syncResult = fallback();
                            }
                        }
                    }
                    else {
                        for (const key of priorityKeys) {
                            if (key && userEnvImports[key]) {
                                const v = userEnvImports[key];
                                if (v && typeof v === "object" && typeof v.then === "function") {
                                    needsAsync = true;
                                    break;
                                }
                                if (v !== null && v !== undefined) {
                                    syncResult = v;
                                    break;
                                }
                            }
                        }
                        if (!needsAsync && syncResult === undefined && userEnvImports.default) {
                            const v = userEnvImports.default;
                            if (v && typeof v === "object" && typeof v.then === "function") {
                                needsAsync = true;
                            }
                            else if (v !== null && v !== undefined) {
                                syncResult = v;
                            }
                        }
                        if (!needsAsync && syncResult === undefined && moduleName) {
                            if (forceNode) {
                                try {
                                    const res = typeof forceNode === "function" ? forceNode() : forceNode;
                                    if (res !== null && res !== undefined)
                                        syncResult = res;
                                    else
                                        needsAsync = true;
                                }
                                catch {
                                    needsAsync = true;
                                }
                            }
                            else if (comp_name) {
                                if (this.maelstrom.blind.require && this.maelstrom.has.require) {
                                    try {
                                        const res = this.maelstrom.blind.require(moduleName);
                                        if (res && res[comp_name] !== undefined)
                                            syncResult = res[comp_name];
                                        else
                                            needsAsync = true;
                                    }
                                    catch {
                                        needsAsync = true;
                                    }
                                }
                                else {
                                    needsAsync = true;
                                }
                            }
                            else if (preferRequire && this.maelstrom.has.require) {
                                try {
                                    const res = this.maelstrom.blind.require(moduleName);
                                    if (res !== null && res !== undefined)
                                        syncResult = res;
                                    else
                                        needsAsync = true;
                                }
                                catch {
                                    needsAsync = true;
                                }
                            }
                            else if (!preferRequire && this.maelstrom.blind.require && state && (state.bundler === "bun" || this.maelstrom.is.electron || typeof process !== "undefined") && this.maelstrom.has.require) {
                                try {
                                    const res = this.maelstrom.blind.require(moduleName);
                                    if (res !== null && res !== undefined)
                                        syncResult = res;
                                    else
                                        needsAsync = true;
                                }
                                catch {
                                    needsAsync = true;
                                }
                            }
                            else if (this.maelstrom.has.require && this.maelstrom.blind.require) {
                                try {
                                    const res = this.maelstrom.blind.require(moduleName);
                                    if (res !== null && res !== undefined)
                                        syncResult = res;
                                    else
                                        needsAsync = true;
                                }
                                catch {
                                    needsAsync = true;
                                }
                            }
                            else {
                                needsAsync = true;
                            }
                        }
                        if (!needsAsync && syncResult === undefined) {
                            syncResult = fallback();
                        }
                    }
                    // AND BAM... All sync work is now complete... NOW let us throw down a logic gate so that we can meet the other req's
                    // We first attempt to return the sync result... just like how it is defined in MaybePromise, followed by the promise functionality...
                    // this is A HARD FUCKING REQUIREMENT... This is because javascript does not trigger async work TILL it ACTUALLY see the promised code, so it DOES NOT TRIGGER... SIMPLY WALKING OVER AWAIT at the start of the function... the same goes for async... BUT not all runtimes play nicely... so to ensure this happen everywhere without any errors whats so ever... we lock it behind a logic gate as well, because when javascript executes the code... it can see and view everything except what is behind that logic gate. Thus... allowing us to hide the async functionality, that when triggered fucks our execution right up and slows everything down...
                    if (syncResult) {
                        return MaybePromise(syncResult);
                    }
                    else {
                        return MaybePromise((() => {
                            const timeoutMs = 10000;
                            return new Promise((resolve, reject) => {
                                let timer;
                                if (!module || (importPromise && !moduleName)) {
                                    if (importPromise) {
                                        const resolved = importPromise;
                                        if (resolved !== null && resolved !== undefined) {
                                            if (timer)
                                                clearTimeout(timer);
                                            resolve(resolved);
                                            return;
                                        }
                                    }
                                    for (const value of Object.values(userEnvImports)) {
                                        if (value && typeof value === "object" && typeof value.then === "function") {
                                            try {
                                                const result = value;
                                                if (result !== null && result !== undefined) {
                                                    if (timer)
                                                        clearTimeout(timer);
                                                    resolve(result);
                                                    return;
                                                }
                                            }
                                            catch {
                                                continue;
                                            }
                                        }
                                    }
                                }
                                if (moduleName) {
                                    if (moduleName && comp_name) {
                                        const res = this.maelstrom.blind.import(moduleName);
                                        if (res && res[comp_name] !== undefined) {
                                            resolve(res[comp_name]);
                                            if (timer)
                                                clearTimeout(timer);
                                            return;
                                        }
                                    }
                                    else {
                                        const res2 = this.maelstrom.blind.import(moduleName);
                                        if (res2 !== null && res2 !== undefined) {
                                            resolve(res2);
                                            if (timer)
                                                clearTimeout(timer);
                                            return;
                                        }
                                    }
                                }
                                if (userEnvImports.default) {
                                    const res = resolveImportCandidate(userEnvImports.default);
                                    if (res !== null) {
                                        resolve(res);
                                        if (timer)
                                            clearTimeout(timer);
                                        return;
                                    }
                                }
                                if (timeoutMs) {
                                    timer = setTimeout(() => {
                                        reject(new Error(`[rift] wait() timed out after ${timeoutMs}ms`));
                                    }, timeoutMs);
                                }
                            });
                        })());
                    }
                };
                return cn;
            })(); /**
             * The named-export form of use(). `label` is the rift key — one probe per name, ever.
             * `filePath` resolves relative to this file (the "locally sourced" anchor).
             * Cold: sync fallback. Hot: the real named export, as a plain property read.
             */
            fn.use_if_available = (label, filePath, comp_name, fallback, opts) => {
                const rift = this.maelstrom.rift(label);
                if (rift.isOpen)
                    return rift.current; // hot path — done, sync
                if (rift.claim()) {
                    // one-time fire-and-forget probe
                    void (async () => {
                        try {
                            const mod = await this.maelstrom.blind.import(this.maelstrom.key_for(filePath));
                            const named = mod?.[comp_name] !== undefined ? mod[comp_name] : fallback;
                            rift.open(named);
                            this.maelstrom.record(label, "use_if_available", named, opts?.store ?? "local");
                        }
                        catch {
                            rift.open(fallback);
                            this.maelstrom.record(label, "use_if_available", fallback, opts?.store ?? "local");
                        }
                    })();
                }
                return fallback; // cold path — instant
            };
            // SOLVER · probe + use_if_available — the locally sourced named import
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            //
            // Cold path: returns `fallback` synchronously. ZERO await. ZERO promise.
            // One probe per label, ever — every later call is a bare property read.
            // The background import resolves the rift; every subsequent call sees the real value.
            fn.probe = (label, filePath, comp_name, fallback) => {
                return this.maelstrom.rift.use_if_available(label, filePath, comp_name, fallback);
            };
            fn.guard_promise_gate = (get, name, fn, timeoutMs) => {
                return async () => {
                    const val = await this.maelstrom.rift(name).wait(timeoutMs);
                    return fn(val);
                };
            };
            return fn;
        })();
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        // SOLVER · load_module / require_module / export_of — the porters and the index clerk
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        //
        // The module cache IS the registry: loaded modules live under `mod:` labels, sync-required
        // ones under `req:` labels, with the export index stored ON the entry itself. Inflight
        // dedupe lives on the entry too. No separate maps.
        fn.module = (() => {
            /**
             * get_module: require the specifier → local file read → builtin check → cwd-resolved
             * require → async import as the last resort. Every sync path is tried before anything
             * returns a promise.
             */
            const fn = (module, filePath) => {
                const br = this.maelstrom.blind.require;
                try {
                    let v = null;
                    try {
                        v = br(module);
                        return MaybePromise(v);
                    }
                    catch (e) {
                        this.maelstrom.log("GET_MODULE", { module, type: "SYNC", import_used: "blindRequire", error: e }, "error");
                    }
                    if (module && this.maelstrom.has.local(filePath, module)) {
                        const fs = br("fs");
                        const path = br("path");
                        const resolved = path.resolve(process.cwd(), filePath);
                        if (fs.existsSync(resolved)) {
                            v = fs.readFileSync(resolved, "utf8").trim();
                            return MaybePromise(v);
                        }
                    }
                    if (this.maelstrom.has.local(filePath)) {
                        const path = br("path");
                        const resolved = path.resolve(process.cwd(), filePath);
                        try {
                            v = br(resolved);
                            return MaybePromise(v);
                        }
                        catch (e) {
                            this.maelstrom.log("GET_MODULE", { module, filePath, type: "SYNC", import_used: "local", error: e }, "error");
                        }
                    }
                    if (this.maelstrom.has.node || this.maelstrom.has.bun) {
                        const fs = br("fs");
                        const { isBuiltin } = br("node:module");
                        if (isBuiltin(module)) {
                            try {
                                v = br(module);
                                return MaybePromise(v);
                            }
                            catch (e) {
                                this.maelstrom.log("GET_MODULE", { module, type: "SYNC", import_used: "builtin", error: e }, "error");
                            }
                        }
                        try {
                            const resolved = br.resolve(module, { paths: [process.cwd()] });
                            if (fs.existsSync(resolved)) {
                                v = br(resolved);
                                return MaybePromise(v);
                            }
                        }
                        catch (e) {
                            this.maelstrom.log("GET_MODULE", { module, type: "SYNC", import_used: "cwd_resolve", error: e }, "error");
                        }
                    }
                    this.maelstrom.log("GET_MODULE", { note: "SYNC PATHS EXHAUSTED — ENTERING ASYNC LAST RESORT", module, type: "SYNC" }, "success");
                    if (module)
                        return Promise.resolve().then(() => this.maelstrom.blind.import(module));
                }
                catch (e) {
                    this.maelstrom.log("GET_MODULE", { module, type: "SYNC", error: e }, "error");
                }
                return undefined;
            };
            fn.extract_named = (ns, comp_name) => {
                const n = this.maelstrom.toNamespace(ns);
                return n[comp_name] ?? n.default?.[comp_name];
            };
            fn.init = (() => {
                /** init-level conjuration: the module itself, no default candidate, no string leak */
                const rn = (label, module = true) => {
                    return this.maelstrom.rift.conjure.uncached({ moduleName: label, module });
                }; /** conjure a rift for a single named export */
                rn.named_export = (label, comp_name, cache = true, module = true) => {
                    const rift = this.maelstrom.rift(label);
                    if (rift.isOpen)
                        return rift;
                    const raw = this.maelstrom.rift.conjure({ moduleName: label, module, cache, comp_name });
                    const result = MaybePromise(raw);
                    const resolve = (resolved) => {
                        if (resolved === undefined || resolved === null) {
                            this.maelstrom.log("CONJURE_NAMED", { msg: "module_not_found", label }, "warn");
                            return resolved;
                        }
                        if (typeof resolved !== "object" || !(comp_name in resolved)) {
                            this.maelstrom.log("CONJURE_NAMED", { msg: "export_not_found", label, comp_name }, "warn");
                            return resolved;
                        }
                        rift.open(resolved);
                        this.maelstrom.record(label, "conjure", resolved);
                        return resolved[comp_name];
                    };
                    return MaybePromise(result instanceof Promise ? result.then(resolve) : resolve(result));
                };
                return rn;
            })();
            fn.named_export = (label, comp_name, module = true) => {
                return this.maelstrom.rift.conjure.uncached({ moduleName: label, module, comp_name });
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // SOLVER · check — the verifier. One probe per module, ever. Boolean out.
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.check = async (moduleName) => {
                const label = `check:${moduleName}`;
                const rift = this.maelstrom.rift(label);
                if (rift.claim()) {
                    // check does the ONLY importing anywhere in this flow; open() just records the outcome
                    (async () => {
                        const result = await this.maelstrom.rift.conjure.uncached({ moduleName, fallback: () => null });
                        const ok = result != null;
                        rift.open(ok);
                        this.maelstrom.record(label, "check", ok);
                    })();
                }
                return Promise.resolve(rift.wait());
            };
            fn.isLoaded = (specifier) => {
                return this.maelstrom.rift(`mod:${this.maelstrom.key_for(specifier)}`).isOpen;
            };
            fn.getLoaded = (specifier) => {
                return this.maelstrom.rift(`mod:${this.maelstrom.key_for(specifier)}`).current;
            };
            /**
             * Find a named export across every loaded module.
             * Ambiguous finds throw — the index never silently guesses.
             */
            fn.export_of = (name, specifier) => {
                if (specifier !== undefined)
                    return this.maelstrom.module.getLoaded(specifier)?.[name];
                const sources = new Map();
                for (const [label, rift] of this.#rifts) {
                    if (!label.startsWith("mod:") || !rift.isOpen)
                        continue;
                    const idx = rift.exports;
                    const found = idx?.get(name);
                    if (found)
                        for (const [k, v] of found)
                            sources.set(k, v);
                }
                if (sources.size === 0)
                    return undefined;
                if (sources.size > 1)
                    throw new Error(`Ambiguous export "${name}" found in: ${[...sources.keys()].join(", ")}`);
                return sources.values().next().value;
            };
            fn.indexExports = (rift, key, mod) => {
                if (!mod || (typeof mod !== "object" && typeof mod !== "function"))
                    return;
                for (const name of Object.keys(mod)) {
                    let sources = rift.exports.get(name);
                    if (!sources) {
                        sources = new Map();
                        rift.exports.set(name, sources);
                    }
                    sources.set(key, mod[name]);
                }
            }; /** the porter's sync twin — blind require, cached, indexed */
            fn.require = (specifier) => {
                const rift = this.maelstrom.rift(`req:${specifier}`);
                if (rift.isOpen)
                    return rift.current;
                if (!this.maelstrom.blind.require) {
                    // ESM / browser — no require, no crash
                    this.maelstrom.log("REQUIRE_MODULE", { msg: "require unavailable in this module system — returning undefined", specifier }, "warn");
                    return undefined;
                }
                const mod = this.maelstrom.blind.require(specifier);
                rift.open(mod);
                this.maelstrom.module.indexExports(rift, specifier, mod);
                this.maelstrom.record(`req:${specifier}`, "require_module", mod);
                return mod;
            };
            return fn;
        })();
        fn.waiter = (() => {
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // SOLVER · wait_for / signal — the signal waiter. ONE list.
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            /**
             * register a waiter over one or more signal keys; fires when ALL of them have fired.
             * ONE label → the waiter IS an entry subscription (Rift.onOpen). No parallel list.
             * MANY labels → one row in the multi-waiter table, released by each entry's own
             * subscription firing. Every subscribe call goes through the entry, always.
             */
            const fn = (deps, fn) => {
                const keys = [...new Set(Array.isArray(deps) ? deps : [deps])];
                const id = ++this.nextWaiterId;
                if (keys.length === 1) {
                    // single-label → pure subscription
                    const unsubs = [];
                    const rift = this.maelstrom.rift(keys[0]);
                    if (rift.isOpen) {
                        fn(rift.current);
                        return id;
                    }
                    unsubs.push(rift.onOpen((v) => {
                        fn(v);
                    }));
                    return id;
                }
                const entry = { id, deps: keys, fn, ready: new Set() }; // multi-label → one table row
                this.#multiWaiters.add(entry);
                for (const k of keys) {
                    const rift = this.maelstrom.rift(k);
                    if (rift.isOpen)
                        entry.ready.add(k);
                    else
                        rift.onOpen((v) => this.maelstrom.waiter.releaseMulti(k, v));
                }
                if (entry.ready.size === keys.length) {
                    fn();
                    this.#multiWaiters.delete(entry);
                }
                return id;
            };
            /** advance every multi-label waiter on this label */
            fn.releaseMulti = (k, v) => {
                for (const entry of [...this.#multiWaiters]) {
                    if (!entry.deps.includes(k))
                        continue;
                    entry.ready.add(k);
                    if (entry.ready.size !== entry.deps.length)
                        continue;
                    this.#multiWaiters.delete(entry);
                    try {
                        entry.fn(v);
                    }
                    catch (e) {
                        queueMicrotask(() => {
                            throw e;
                        });
                    }
                }
            };
            fn.cancel = (id) => {
                for (const entry of this.#multiWaiters) {
                    if (entry.id !== id)
                        continue;
                    this.#multiWaiters.delete(entry);
                    return true;
                }
                return false;
            }; /** rift-shaped wait on a single label — subscribe first, then re-check isOpen */
            fn.wait_and_promise = (timeoutMs, key, isOpen, current) => {
                const rift = this.maelstrom.rift(key);
                return new Promise((resolve, reject) => {
                    // subscribe first, THEN re-check isOpen — closes the gap where the record opens mid-subscribe
                    let timer;
                    const unsub = rift.onOpen((v) => {
                        if (timer)
                            clearTimeout(timer);
                        unsub();
                        this.maelstrom.record(key, "wait_for", v);
                        resolve(v);
                    });
                    if (isOpen) {
                        // opened while we were subscribing
                        if (timer)
                            clearTimeout(timer);
                        unsub();
                        this.maelstrom.record(key, "wait_for", current);
                        resolve(current);
                        return;
                    }
                    if (timeoutMs) {
                        timer = setTimeout(() => {
                            unsub();
                            reject(new Error(`[rift] wait() timed out after ${timeoutMs}ms`));
                        }, timeoutMs);
                    }
                });
            };
            return fn;
        })();
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        // DEFER — the scheduler. Drain loop, versioned deps, stats, cancellation.
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        //
        // Deferred dependency values are registry entries — `provide` opens a rift under the
        // dependency's label. No separate dependency map. The task table holds tasks only.
        fn.defer = (() => {
            const fn = (deps, fn) => {
                const keys = [...new Set(typeof deps === "string" ? [deps] : deps)];
                const id = ++this.nextDeferId;
                this.deferStats.registered++;
                this.#deferTasks.set(id, { id, deps: keys, fn, state: "pending" });
                this.maelstrom.defer.drain();
                return id;
            };
            fn.provide = (k, v) => {
                const entries = typeof k === "string" ? [[k, v]] : Object.entries(k);
                for (const [key, value] of entries) {
                    const rift = this.maelstrom.rift(key);
                    rift.reset(); // replace, don't just first-open
                    rift.open(value);
                    rift.version++;
                    this.maelstrom.record(key, "manual", value);
                }
                this.maelstrom.defer.drain();
            };
            fn.resolve = (k) => {
                this.maelstrom.defer.provide(k, undefined);
            };
            fn.invalidate = (k) => {
                return this.maelstrom.rift.delete(k);
            };
            fn.has = (k) => {
                return this.maelstrom.rift(k).isOpen;
            };
            fn.get = (k) => {
                return this.maelstrom.rift(k).current;
            };
            fn.cancel = (id) => {
                const task = this.#deferTasks.get(id);
                if (!task || task.state !== "pending")
                    return false;
                this.#deferTasks.delete(id);
                this.deferStats.cancelled++;
                return true;
            };
            fn.ready = (task) => {
                return task.deps.every((k) => this.maelstrom.rift(k).isOpen);
            };
            fn.drain = () => {
                if (this.draining) {
                    this.drainAgain = true;
                    return;
                }
                this.draining = true;
                try {
                    do {
                        this.drainAgain = false;
                        for (const task of this.#deferTasks.values()) {
                            if (task.state !== "pending" || !this.maelstrom.defer.ready(task))
                                continue;
                            task.state = "running"; // claim before execution to prevent duplicate dispatch
                            this.deferStats.executed++;
                            const v = task.deps.map((k) => this.maelstrom.rift(k).current);
                            try {
                                const result = task.fn(...v);
                                if (result != null && typeof result.then === "function") {
                                    Promise.resolve(result)
                                        .then(() => {
                                        this.deferStats.completed++;
                                        this.maelstrom.defer.onSuccess(task.id, task.deps);
                                    })
                                        .catch((e) => {
                                        this.deferStats.failed++;
                                        this.maelstrom.defer.reportError(task, e);
                                    })
                                        .finally(() => {
                                        this.#deferTasks.delete(task.id);
                                    });
                                }
                                else {
                                    this.deferStats.completed++;
                                    this.maelstrom.defer.onSuccess(task.id, task.deps);
                                    this.#deferTasks.delete(task.id);
                                }
                            }
                            catch (e) {
                                this.deferStats.failed++;
                                this.maelstrom.defer.reportError(task, e);
                                this.#deferTasks.delete(task.id);
                            }
                        }
                    } while (this.drainAgain);
                }
                finally {
                    this.draining = false;
                }
            };
            fn.reportError = (task, e) => {
                try {
                    this.maelstrom.defer.onError(e, task.id, task.deps);
                }
                catch {
                    /* error reporting must not interrupt the scheduler */
                }
            };
            fn.inspect = () => {
                const pending = [...this.#deferTasks.values()].filter((x) => x.state === "pending").map((x) => ({ id: x.id, deps: x.deps, missing: x.deps.filter((k) => !this.maelstrom.rift(k).isOpen) }));
                const running = [...this.#deferTasks.values()].filter((x) => x.state === "running").map((x) => ({ id: x.id, deps: x.deps }));
                return {
                    stats: { ...this.deferStats },
                    pending,
                    running,
                };
            };
            fn.clear = () => {
                for (const [id, task] of this.#deferTasks) {
                    if (task.state === "pending") {
                        this.#deferTasks.delete(id);
                        this.deferStats.cancelled++;
                    }
                }
            };
            fn.onError = (e, id, deps) => {
                this.maelstrom.log("DEFERRED", { msg: "Task failed", id, deps, error: e }, "error");
            };
            fn.onSuccess = (id, deps) => {
                this.maelstrom.log("DEFERRED", { msg: "Task fulfilled", id, deps }, "info");
            };
            return fn;
        })();
        fn.detect = (() => {
            const fn = () => { };
            fn.capability = (name) => {
                const g = typeof globalThis !== "undefined" ? globalThis : {};
                switch (name) {
                    case "shared_worker":
                        return typeof g.SharedWorker !== "undefined";
                    case "service_worker":
                        return typeof g.ServiceWorkerGlobalScope !== "undefined" || (typeof g.navigator !== "undefined" && "serviceWorker" in g.navigator);
                    case "unix_worker":
                        return typeof g.process !== "undefined" && !!g.process?.versions?.node;
                    case "broadcastr_channel":
                        return typeof g.BroadcastChannel !== "undefined";
                    case "electron_server":
                    case "electron_client":
                        return typeof g.process !== "undefined" && !!g.process?.versions?.electron;
                    case "named_pipe":
                    case "native_msg_host":
                    case "native_msg_client":
                        return typeof g.process !== "undefined" && !!g.process?.versions?.node;
                    default:
                        return false;
                }
            };
            fn.bundler = () => {
                const proc = typeof process !== "undefined" ? process : null;
                if (!proc || !proc.versions?.node)
                    return null; // .versions check distinguishes real Node from a browser shim
                if (proc.versions?.bun)
                    return "bun";
                const ua = proc.env?.npm_config_user_agent ?? "";
                if (ua.startsWith("pnpm"))
                    return "pnpm";
                if (ua.startsWith("yarn"))
                    return "yarn";
                if (ua.startsWith("npm"))
                    return "npm";
                return null;
            };
            fn.firstMatch = async (candidates) => {
                for (const name of candidates) {
                    if (await this.maelstrom.module.check(name))
                        return name;
                }
                return null;
            };
            fn.all = async (candidates) => {
                const results = await Promise.all(candidates.map(async (name) => ((await this.maelstrom.module.check(name)) ? name : null)));
                return results.filter((r) => r !== null);
            }; /** runs once. Everything downstream just reads the result. */
            fn.environment = (env_lib) => {
                void (async () => {
                    const bundler = this.maelstrom.detect.bundler();
                    const [moduleLevel, platform, compilers, adapters] = await Promise.all([this.maelstrom.detect.firstMatch(env_lib ? [env_lib] : this.MODULE_LEVEL_CANDIDATES), this.maelstrom.detect.firstMatch(this.PLATFORM_CANDIDATES), this.maelstrom.detect.all(this.COMPILER_CANDIDATES), this.maelstrom.detect.all(this.ADAPTER_CANDIDATES)]);
                    this.ENV_STATE = { moduleLevel, platform, compilers, bundler, adapters, ready: true };
                    this.maelstrom.record("ENV_DETECTION", "detect_environment", this.ENV_STATE);
                })();
            };
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            // what_is_this_item_exactly — the type interrogator, carried whole
            // ═══════════════════════════════════════════════════════════════════════════════════════════
            fn.type = (v) => {
                // #region ═════════════════════════════════════════════
                // ── axis 2 first: is it async? thenable (promise-like, not necessarily Promise)  ─────────────────────══
                if (v != null && typeof v.then === "function") /*                            */
                    return "thenable";
                // ─── async iterable ───────────────────────────────────────────────────────────────────────═────────────
                if (v != null && typeof v[Symbol.asyncIterator] === "function") /*     */
                    return "async-iterable";
                // ── axis 1: what shape? ────────────────────────────────────────────────────────────────────────────────
                if (v === null) /*                           null (typeof null === 'object', so separate) */
                    return "null";
                const t = typeof v; /*                                                                                  */
                ;
                if (t !== "object" && t !== "function") /*        primitive: str/num/bool/bigint/sym/undefined */
                    return t;
                if (typeof v === "function") /*                                              function */
                    return "function";
                if (ArrayBuffer.isView(v)) /*                                     TypedArray or DataView */
                    return "array";
                if (v instanceof Map) /*                                                                   */
                    return "map";
                if (v instanceof Set) /*                                                                   */
                    return "set";
                if (v instanceof Date) /*                                                                 */
                    return "date";
                if (v instanceof RegExp) /*                                                             */
                    return "regexp";
                if (v instanceof Error) /*                                                               */
                    return "error";
                if (typeof v[Symbol.iterator] === "function") /*                             */
                    return "iterable";
                if (t === "object") /*                                                     plain record */
                    return "object";
                // ─── iterable ──────────────────────────────────────────────────────────────────────────────────────────
                if (v != null && typeof v[Symbol.iterator] === "function") /*                */
                    return "iterator";
                if (typeof v === "string") /*                                                           */
                    return "string";
                if (typeof v === "number") /*                                                           */
                    return "number";
                if (typeof v === "boolean") /*                                                         */
                    return "boolean";
                if (typeof v === "bigint") /*                                                           */
                    return "bigint";
                if (typeof v === "symbol") /*                                                           */
                    return "symbol";
                if (typeof v === "undefined") /*                                                     */
                    return "undefined";
                // ─── objects by constructor ────────────────────────────────────────────────────────────────────────────
                if (v instanceof Array) /*                                           or Array.isArray(v) */
                    return "Array";
                if (v instanceof WeakMap) /*                                                           */
                    return "WeakMap";
                if (v instanceof WeakSet) /*                                                           */
                    return "WeakSet";
                if (v instanceof Promise) /*                                                           */
                    return "Promise";
                if (v instanceof ArrayBuffer) /*                                                   */
                    return "ArrayBuffer";
                // ─── node-specific ─────────────────────────────────────────────────────────────────────────────────────
                if (v instanceof Buffer) /*                                                 Node buffer */
                    return "Buffer";
                if (v instanceof URL) /*                                                       oWHATWG URL */
                    return "URL";
                if (v instanceof URLSearchParams) /*                                           */
                    return "URLSearchParams";
                // ─── plain object / record ─────────────────────────────────────────────────────────────────────────────
                if (typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Map)
                    && !(v instanceof Set)) /*                                                     */
                    return "plainObject";
                // ───────────────────────────────────────────────────────────────────────────────────────────────────────
            };
            fn.cloudSupport = () => {
                const g = typeof globalThis !== "undefined" ? globalThis : {};
                return !!(g.window && g.window !== g) || typeof g.document !== "undefined";
            };
            return fn;
        })();
        fn.useEnvState = () => {
            if (!this.ENV_STATE.ready && !this.warnedUseBeforeReady) {
                this.warnedUseBeforeReady = true; // warn once, not spam
                this.maelstrom.log("USE_ENV_STATE", { note: "called before detect_environment() finished — falling back to defaults" }, "warn");
            }
            return { ...this.ENV_STATE, rt: "ENV_DETECTION", subChannel: "[CSE_ENV]" };
        }; // ═══════════════════════════════════════════════════════════════════════════════════════════
        // APPARATION — the no-op factory, carried whole
        // ═══════════════════════════════════════════════════════════════════════════════════════════
        fn.apparation = {
            any: () => ({}),
            anyGeneric: () => ({}),
            anyProp: (v) => v,
            anyProp2: (v) => v,
            anyProp3: (v) => v,
            anyAs: (v) => v,
            promise: () => Promise.resolve({}),
            booleanPromise: () => Promise.resolve(false),
            void: () => { },
            func: () => () => ({}),
            funcVoid: () => () => { },
            universal: () => new Proxy({}, {
                get: (target, prop) => {
                    if (typeof prop === "symbol")
                        return undefined;
                    const propName = prop;
                    if (propName === "then" || propName === "catch" || propName === "finally")
                        return undefined;
                    if (propName === Symbol.iterator)
                        return function* () { };
                    if (propName === "toString" || propName === "valueOf")
                        return () => "";
                    return (...args) => target;
                },
                set: () => true,
                deleteProperty: () => true,
                ownKeys: () => [],
                getOwnPropertyDescriptor: () => undefined,
                apply: (target) => target,
                construct: (target) => target,
            }),
            universalNoop: () => new Proxy({}, {
                get: (target, prop) => {
                    if (typeof prop === "symbol")
                        return undefined;
                    const propName = prop;
                    if (propName === "then" || propName === "catch" || propName === "finally")
                        return undefined;
                    if (propName === Symbol.iterator)
                        return function* () { };
                    if (propName === "toString" || propName === "valueOf")
                        return () => "";
                    return (...args) => target;
                },
                set: () => true,
                deleteProperty: () => true,
                ownKeys: () => [],
                getOwnPropertyDescriptor: () => undefined,
                apply: (target) => target,
                construct: (target) => target,
            }),
            simpleNoop: () => ({}),
            noopPromise: () => Promise.resolve({}),
            noopBooleanPromise: () => Promise.resolve(false),
            noopVoid: () => { },
            noopFunction: () => () => ({}),
            thenable: () => ({ then: (_onF, _onR) => new Promise(() => { }) }),
            asyncIterable: () => ({
                [Symbol.asyncIterator]: async function* () {
                    await new Promise(() => { });
                },
            }),
            null: () => null,
            primitive: () => undefined,
            string: () => "",
            number: () => 0,
            boolean: () => false,
            bigint: () => 0n,
            symbol: () => Symbol("apparation"),
            undefined: () => undefined,
            undefinedString: () => "undefined",
            function_: () => () => { },
            typedArray: () => new Uint8Array(),
            dataView: () => new DataView(new ArrayBuffer(0)),
            arrayBuffer: () => new ArrayBuffer(0),
            map: () => new Map(),
            set: () => new Set(),
            date: () => new Date(0),
            regexp: () => /(?:)/,
            error: (msg = "[Apparation]") => new Error(msg),
            iterable: () => [],
            iterator: () => [][Symbol.iterator](),
            object: () => ({}),
            plainObject: () => ({}),
            array: () => [],
            weakMap: () => new WeakMap(),
            weakSet: () => new WeakSet(),
            promiseInstance: () => Promise.resolve({}),
            url: () => new URL("about:blank"),
            urlSearchParams: () => new URLSearchParams(),
            buffer: () => (typeof Buffer !== "undefined" ? Buffer.alloc(0) : new Uint8Array()),
            _ArrayBuffer: () => new Uint8Array(),
        };
        fn.reset = () => {
            this.#rifts.clear();
            this.#multiWaiters.clear();
            this.#deferTasks.clear();
            this.deferStats = { registered: 0, executed: 0, completed: 0, failed: 0, cancelled: 0 };
            this.autoCloud = undefined;
            this.ENV_STATE = { moduleLevel: null, platform: null, compilers: [], bundler: null, adapters: [], ready: false };
        };
        return fn;
    })();
}
export { Store };
export default new Store();
// #endregion
//                                     ORC_SHOUT — the real logger, carried in whole, unmodified
// #region ─────────────────────────────────────────────────────────────────────────────────────
class ORC_SHOUT {
    c = {
        emerald: { 10: "#002c22", 9: "#004f3b", 8: "#016630", 7: "#007a55", 6: "#009966", 5: "#00bc7d" },
        blue: { 10: "", 9: "", 8: "", 7: "", 6: "", 5: "" },
    };
    t = {
        deep: {
            bg: "#020817",
            txt: "#f8fafc",
            size: 12,
            title_size: 14,
            title_txt: "#94a3b8",
            payload_key: "#a4ed2c",
            payload_value: "#f8fafc",
            font: "monospace",
            border: "2px solid #101727",
            borderRadius: "6px",
            padding: "8px 16px",
            svg: "",
        },
        vintage: {
            bg: "#001B29",
            txt: "#e9e1ba",
            size: 12,
            title_size: 14,
            title_txt: "#ada785",
            payload_key: "#29c3a0",
            payload_value: "#fafafa",
            font: "monospace",
            border: "2px solid #112932",
            borderRadius: "6px",
            padding: "8px 16px",
            svg: "",
        },
        error: {
            bg: "#09090B",
            txt: "#e7000b",
            size: 12,
            title_size: 14,
            title_txt: "#9f0712",
            payload_key: "#a4ed2c",
            payload_value: "#f8fafc",
            font: "monospace",
            border: "2px solid #e7000b",
            borderRadius: "6px",
            padding: "8px 16px",
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e7000b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
        },
        warn: {
            bg: "#09090B",
            txt: "#e17100",
            size: 12,
            title_size: 14,
            title_txt: "#973c00",
            payload_key: "#a4ed2c",
            payload_value: "#f8fafc",
            font: "monospace",
            border: "2px solid #e17100",
            borderRadius: "6px",
            padding: "8px 16px",
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e17100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
        },
        success: {
            bg: "#09090B",
            txt: "#009966",
            size: 12,
            title_size: 14,
            title_txt: "#016630",
            payload_key: "#a4ed2c",
            payload_value: "#f8fafc",
            font: "monospace",
            border: "2px solid #009966",
            borderRadius: "6px",
            padding: "8px 16px",
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#009966" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>`,
        },
        info: {
            bg: "#09090B",
            txt: "#155dfc",
            size: 12,
            title_size: 14,
            title_txt: "#193cb8",
            payload_key: "#a4ed2c",
            payload_value: "#f8fafc",
            font: "monospace",
            border: "2px solid #155dfc",
            borderRadius: "6px",
            padding: "8px 16px",
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#155dfc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
        },
    };
    log(msg, p, theme = this.t.deep) {
        const isArray = Array.isArray(msg);
        const title = isArray ? msg[0] : msg;
        const paragraphs = isArray ? msg.slice(1) : [];
        const containerStyle = `
              background: ${theme.bg};
              ${theme.border ? `border: ${theme.border};` : ""}
              ${theme.borderRadius ? `border-radius: ${theme.borderRadius};` : ""}
              ${theme.padding ? `padding: ${theme.padding};` : ""}
              font-family: ${theme.font};
              display: block;
              margin: 4px 0;
          `;
        const titleWithIcon = theme?.svg ? `${theme?.svg} ${title}` : title;
        const titleStyle = `
              color: ${theme.title_txt};
              font-size: ${theme.title_size}px;
              font-weight: bold;
              font-family: ${theme.font};
              display: flex;
              align-items: center;
              gap: 8px;
          `;
        const paragraphStyle = `
              color: ${theme.txt};
              font-size: ${theme.size}px;
              font-family: ${theme.font};
              margin-top: 4px;
          `;
        const keyStyle = `
              color: ${theme.payload_key};
              font-weight: bold;
              font-family: ${theme.font};
          `;
        const valueStyle = `
              color: ${theme.payload_value};
              font-family: ${theme.font};
          `;
        let payloadStr = "";
        if (p && typeof p === "object") {
            const entries = Object.entries(p);
            payloadStr = entries.map(([key, value]) => `%c${key}: %c${JSON.stringify(value, null, 2)}`).join("\n");
        }
        const logParts = [`%c${titleWithIcon}`, ...paragraphs.map((p) => `%c${p}`), payloadStr ? `\n${payloadStr}` : ""].filter(Boolean).join("\n");
        const styles = [containerStyle + titleStyle, ...paragraphs.map(() => paragraphStyle), ...(payloadStr ? [keyStyle, valueStyle] : [])];
        console.log(logParts, ...styles);
    }
}
// #endregion ──────────────────────────────────────────────────────────────────────────────────
