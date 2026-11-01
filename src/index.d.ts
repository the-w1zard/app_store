import { M2I } from "./index";


declare global {
    /*  ==========================================================================================================================
         The entire goal is to take what is already available and give them the upgrades / updates that they need to improve the 
         ux/dx. That is it.
         Not to wildy go off and create 400 fn's to throw on.
         Create a class, extends the original api and throw it into global this so it is accessible without the need of importing
         it.
        ================================================================================== ⇦✦──⇦✦──✦──✦──← 'pew pew' 🧙 [UX/DX] */

        var M2: typeof M2I; // map

        //                                                                                                 [MAP]
        // #region ══════════════════════════════════════════════════════════════════════════════════════════════════════ 
        type M2Op = "set" | "del" | "upd" | "dirty";
        interface M2Event<H = A, T = A> {
            op: M2Op;
            k: H;
            v?: T;
            prev?: T;
            has: B;
            batch?: B;
        }
        type Sub<H, T> = (e: M2Event<H, T>) => V;
        interface Derived<H, T> {
            deps: AR<H>;
            fn: (...vals: AR<T>) => T;
            dirty: B;
            value?: T;
            has: B;
        }
        interface M2<H = A, T = A> extends Map<H, T> {
            //                                                                          [SET/GET/HAS/DELETE]
            // ══════════════════════════════════════════════════════════════════════════════════════════════════════
            //g: typeof Map.prototype.get;
            //h: typeof Map.prototype.has;
            //d: typeof Map.prototype.delete;
            on(fn: Sub<H, T>): () => V;
            off(fn: Sub<H, T>): V;
            batch(fn: () => void): this;
            s(v: UF<T>, k: H): this;
            mutate(k: H, fn: (old: T, has: true) => T): T | UD
            d(k: H): B;
            c(): V
            dv(k: H, deps: AR<H>, fn: (...vals: AR<T>) => T): this;
            dirty(...keys: AR<H>): this;
            g(k: H): T | UD;
            h(k: H): B;
            $debug(limit?: N): this;
            $strict(): this;
            $history(): AR<M2Event<H, T>>;
            $why(k: H): M2Event<H, T> | UD;
            $diff(other: M2I<H, T>): {
                add: AR<[H, T]>;
                del: AR<H>;
                chg: AR<[H, T, T]>;
            };
            swap(v: UF<T>, k: H): T | UD;
            take(key: H): T | UD;
            peek(key: H): T | false;
            getOrI(v: UF<T>, k: H): T;
            getOrM(make: () => T, key: H): T;
            update(k: H, fn: (old: T, has: B) => T, initial?: UF<T>): T;
            setIfAbsent(v: UF<T>, k: H): B;
            setIfPresent(v: UF<T>, k: H): B;
            replace(v: UF<T>, k: H): B;
            inc(key: H, by?: N): N;
            touch(key: H): B;
            mapValues<G>(fn: (v: T, k: H) => G): M2<H, G>;
            mapKeys<G>(fn: (v: T, k: H) => G): M2<G, T>;
            filterKV(pred: (v: T, k: H) => B): this;
            filterKeys(pred: (v: T, k: H) => B): this;
            partition(pred: (v: T, k: H) => B): [M2<H, T>, M2<H, T>];
            find(pred: (v: T, k: H) => B): [H, T] | UD;
            findKey(pred: (v: T, k: H) => B): H | UD;
            findValue(pred: (v: T, k: H) => B): T | UD;
            some(pred: (v: T, k: H) => B): B;
            every(pred: (v: T, k: H) => B): B;
            reduce<G>(fn: (acc: G, v: T, k: H) => G, initial: G): G;
            forEachKV(fn: (v: T, k: H, map: this) => void): void;
            invert(): M2<T, H>;
            unique<G>(fn?: (v: T, k: H) => G): M2<G, T>;
            pick(keys: Iterable<H>): M2<H, T>;
            omit(keys: Iterable<H>): M2<H, T>;
            merge(other: Iterable<readonly [H, UF<T>]>): this;
            clearAndSet(entries: Iterable<readonly [H, UF<T>]>): this;
            toArray(): A2I<[H, T]>;
            toKeys(): A2I<H>; 
            toValues(): A2I<T>
            toObject(): OB<T>;
            group<G>(fn: (v: T, k: H) => G):  M2<G, A2<T>>;
            clone(): this;
            equals(other: Map<H, T>): B;
        }
        interface M2I<H = A, T = A> extends M2<H, T> {}
        interface B2B {
            set(pid: number, value: boolean): void 
            true(pid: number, value: boolean) 
            false(pid: number, value: boolean) 
            get(pid: number): boolean
            toggle(pid: number): boolean
            clear(): void 
        }
        interface B2BI extends B2B {}
        // #endregion 

        
type RiftListener<T> = (value: T) => V;
interface RiftLike<T = A> {
	readonly createdAt: N;
	readonly openedAt: N | UD;
	wait(timeoutMs?: N): T// Promise<T>;
	// wait(timeoutMs?: N): Promise<T>;
	open(value?: T): V;
	reset(): V;
	claim(): B;
	onOpen(listener: RiftListener<T>): () => V;
	readonly isOpen: B;
	readonly isClaimed: B;
	readonly current: T | UD;
}

interface RiftLike<T = A> {
	readonly isOpen: B;
	readonly isClaimed: B;
	readonly current: OPT<T>;
	readonly createdAt: N;
	readonly openedAt: OPT<N>;
	open(v?: T): V;
	reset(): V;
	claim(): B;
	wait(timeoutMs?: N): T | Promise<T>;
	onOpen(listener: (v: T) => V): () => V;
}
interface RiftRecord<T = A> {
	opened: B;
	claimed: B;
	value?: T;
	createdAt: N;
	openedAt?: N;
}

type StoreListener<T = A> = (v: RiftRecord<T>) => void;
type Solver = "get" | "place" | "smash_n_grab" | "create_rift" | "use_rift" | "resolve_global_rift" | "resolve_rift_initial" | "has" | "probe" | "use_if_available" | "conjure" | "check" | "load_module" | "require_module" | "export_of" | "wait_for" | "defer" | "detect_environment" | "manual";

type StoreKind = "local" | "cloud" | "auto";

interface ResultRecord<T = A> {
	label: S;
	solver: Solver;
	store: StoreKind;
	value: T | undefined;
	ok: B;
	openedAt: N;
}

interface OPTIONAL_IMPORT_OPTIONS<T = A, F = A> {
	moduleName?: S;
	fallback?: F | (() => F);
	module?: B; // true → external module lookup; false → internally sourced import
	cache?: B; // default true. false = always re-run, skip the rift entirely.
	preferRequire?: B; // default false. true = require() over import() when possible.
	importPromise?: A; // a raw promise to await directly — for local files, no moduleName lookup.
	force?: F | (() => F); // force a value over any import at all
	comp_name?: S; // extract a single named export
	[key: S]: A; // ...userEnvImports: candidates keyed by detected environment
}

interface EnvDetectionState {
	moduleLevel: S | null;
	platform: S | null;
	compilers: S[]; // full scan
	bundler: S | null;
	adapters: S[]; // full scan
	ready: B;
}
type Waiter = { id: N; deps: S[]; fn: (v?: A) => V; ready: SET<S> };
type DeferredState = "pending" | "running";
type DeferredTask = { id: N; deps: S[]; fn: (...v: A[]) => A; state: DeferredState };
type DeferredStats = { registered: N; executed: N; completed: N; failed: N; cancelled: N };


}
