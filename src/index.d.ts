export {}

declare global {
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
