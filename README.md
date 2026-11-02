
<div align="left" style="position: relative;">
<img src="./icons/gandalf.png" align="right" width="30%" style="margin: -20px 0 0 20px;">

<h1>Store: <span style="font-size:18px;" >The Wizard's Arsenal</span></h1>

<p align="left"><em>The most opinionated platform... ever.</em></p>
<p align="left"><em>Trust me... I'm a fucking wizard... 🧙</em></p>
<p align="left">VSCode ext:</p>
<p align="left">
<img src="https://img.shields.io/badge/THEMES- 251-95ED27?style=flat">
<img src="https://img.shields.io/badge/SIDEBARS- 160+-95ED27?style=flat">
<img src="https://img.shields.io/badge/PRODUCT ICONS- 651-95ED27?style=flat">
<img src="https://img.shields.io/badge/FILE ICONS- 454-95ED27?style=flat">
<img src="https://img.shields.io/badge/VSCode Extentions- 82+-95ED27?style=flat">
<img src="https://img.shields.io/badge/FEATURES- SHIT TONNE-95ED27?style=flat">
</p>
<p align="left">Small but powerful repos worth checking out:</p>
<p align="left">

<a href="https://github.com/the-w1zard/app_store"><img src="https://img.shields.io/badge/Store / Maelstrom-000000.svg?style=flat&logo=JetBrains&logoColor=white" alt="JetBrains"></a>
<a href="https://github.com/the-w1zard/dx"><img src="https://img.shields.io/badge/UX /DX-34A853.svg?style=flat&logo=Android&logoColor=white" alt="Android"></a>
<a href="https://github.com/the-w1zard/temporal_shift"><img src="https://img.shields.io/badge/Temporal Shift-77AA99.svg?style=flat&logo=Org&logoColor=white" alt="Org"></a>
<a href="https://github.com/the-w1zard/the_cloud"><img src="https://img.shields.io/badge/The Cloud-02303A.svg?style=flat&logo=Gradle&logoColor=white" alt="Gradle"></a>
<a href="https://github.com/the-w1zard/signals"><img src="https://img.shields.io/badge/Signals-02303A.svg?style=flat&logo=Gradle&logoColor=white" alt="Gradle"></a>
<img src="https://img.shields.io/badge/Sometimes, my genius... It generates gravity.-4285F4.svg?style=flat&logo=🧙&logoColor=white" alt="Google">
<a href="https://github.com/the-w1zard"><img src="https://img.shields.io/badge/Coming Soon: The Wizard Platform-7F52FF.svg?style=flat&logo=Kotlin&logoColor=white" alt="Kotlin"></a>
<a href="https://github.com/the-w1zard"><img src="https://img.shields.io/badge/Coming Soon: Hadron Particle Disruptor-%23ED8B00.svg?style=flat&logo=openjdk&logoColor=white" alt="java"></a>
</p>
<p align="left">The goal? To remove all friction, from everything.</p>

</div>
<br clear="right">

## Table of Contents

### 🔗 [THE_WIZARD]

- I. [🧙 TLDR](#-tldr)
- II. [🔮 Features](#-features)
- III. [🧙 Store](#-store)
- IV. [🔮 Scoped State](#-scoped-state)
- V. [🧙 Rifts](#-rifts)
- VI. [🔮 Waiters](#-readiness-waiters)
- VII. [🧙 Defer](#-deferred-tasks)
- VII. [🔮 Modules](#-module-resolution)
- VII. [🧙 Apparation](#-apparations-and-safe-fallbacks)
- VII. [🔮 Usage: Quick Reference](#-usage-quick-reference-sheet)
- VII. [🧙 Usage: Maelstrom Cheat sheet](#-usage-quick-reference-sheet)

---
<span  style="font-family: monospace"> 


> [!NOTE] TLDR
>
> This is the combination of several solutions but created so that, each are still their own individual thing but accessible through a single source where it can be shared across several different node modules. Each solution solves a different problem, while at the same having an extremely small foot print. In addition to that, each of the solution was created ontop of the foundation of the new and extended functions from the dx package, where their functionality was leveraged which helped in keeping the overall package size small.
>
> You will find amongst the collective:
> - Store
> - State
> - modules:
>   - defer
>   - waiter
>   - conjure
>   - conjure named exports
>   - conjure cached and uncached
> 
> THE MAIN GOAL, is having a small but capable fn where the same instance/store can be accessed from different node / locally sourced modules. The end result is a single file that places a reactive and powerful surface area that agressively addressees several problems at once while keeping each of them sepearated, despite everything being accessible via a single call definition.

</span>

A single in-process module for keyed storage, scoped state, readiness signals, module resolution, and dependency-based task scheduling.

It exports a `Store` class for independent instances and a default, ready-to-use store:

```ts
import Store, { Store } from "@the-w1zard/store";

const isolatedStore = new Store();
```

## Features

- Reactive keyed store with subscriptions, async iteration, waiters, and update helpers
- Hierarchical state scopes with notification scheduling and persistence markers
- Rift registry for values that may become available later
- Module loading, optional imports, named-export lookup, and environment detection
- Readiness waiters and deferred tasks that run when their dependencies are provided
- Safe placeholder factories and structured logging

## Store

### Read and write

```ts
store.set("user", { name: "Alice" });

store.get("user");                    // { name: "Alice" }
store.get("missing", "fallback");     // "fallback"
store.has("user");                    // true

store.setLazy("session", () => createSession());
store.delete("user");
store.clear();
```

`set()` returns the store instance. `setLazy()` evaluates and stores its factory result each time it is called. `getAll()` returns a clone of the stored data.

### Subscribe to changes

```ts
const unsubscribe = store.subscribe("user", (value, previous, key) => {
  console.log(`${key}:`, previous, "→", value);
});

store.set("user", { name: "Alice" });
unsubscribe();
```

Subscribe to all keys:

```ts
const unsubscribe = store.subscribe((value, previous, key) => {
  console.log("Changed:", key, value);
});
```

Request an immediate callback when a key already has a value:

```ts
store.subscribe("user", onUserChange, { immediate: true });
```

Or consume updates as an async iterator:

```ts
for await (const value of store.subscribe("token", { immediate: true })) {
  await refreshWith(value);
  if (value === "stop") break;
}
```

Leaving the `for await` loop closes the iterator and removes its subscriptions.

### Wait for values

```ts
const user = await store.wait("user");

const config = await store.wait("config", {
  predicate: (value) => value?.ready === true,
  timeout: 5_000,
  signal: abortController.signal,
});

await store.waitChange("user"); // Ignore the current value
await store.waitFor("count", (value) => value >= 10);
```

`wait()` resolves immediately if the key already exists and satisfies its predicate. A timeout rejects with a `TimeoutError`; an aborted signal rejects with an `AbortError`.

### Update helpers

```ts
store.setIfAbsent("user", user);
store.setIfPresent("user", updatedUser);
store.replace("user", updatedUser); // Alias for setIfPresent

store.update("count", (old) => (old ?? 0) + 1, 0);
store.inc("count", 1);
store.touch("pendingKey");
```

`setIfAbsent()`, `setIfPresent()`, `replace()`, and `touch()` indicate whether the operation changed the store. `touch()` creates a key with value `undefined` if it does not already exist.

### Inspect and transform

```ts
store.toJSON();
store.entries();
store.keys();
store.values();
store.snapshot();

store.find((value) => value?.active);
store.findKey((value) => value?.active);
store.group((value) => value.type);
store.pick(["user", "config"]);
store.omit(["secret"]);
store.equals(otherStore);
store.snapshotSubs();
```

`freeze()` prevents subsequent `set()` calls. In the provided implementation, it is not shown guarding every mutation method, so it should not be treated as a universal read-only mode.

## Scoped state

`store.state` organizes values by root, master, slave, then key. Default channel names are exposed as `store.r`, `store.m`, and `store.s`.

```ts
const scope = {
  globalKey: "app",
  ms_reg: "main",
  sl_reg: "settings",
};

store.state.set("theme", "dark", scope);
const theme = store.state.get("theme", scope);
```

Common methods:

```ts
store.state.getMap();
store.state.getMetadata();
store.state.get("theme");
store.state.set("theme", "dark");
store.state.subscribe("theme", (value) => console.log(value));
store.state.has("theme");
store.state.entries();
store.state.delete("theme");
store.state.clear();
```

State writes support options including `triggerRender` and a history `cap`. Notifications are scheduled through the store’s notification pipeline.

Persistence helpers mark keys for the module’s persistence mechanism:

```ts
store.state.persist("theme");
store.state.unpersist("theme");
store.state.clearPersistent();
```

These helpers manage in-memory persistence maps; external storage behavior is not shown in the provided implementation.

## Rifts

A Rift is a named slot that can be opened with a value. Consumers can subscribe or wait for it:

```ts
const ready = store.maelstrom.rift("service.ready");

ready.onOpen((value) => {
  console.log("Service is ready:", value);
});

ready.open({ connected: true });
const service = await ready.wait();
```

`wait()` waits indefinitely by default. Pass a timeout in milliseconds to reject if the Rift is not opened in time:

```ts
await ready.wait(5_000);
```

Retrieve and inspect registry entries:

```ts
store.maelstrom.rift("service.ready"); // Retrieve or create
store.maelstrom.rift.has("service.ready");
store.maelstrom.rift.inspect();
store.maelstrom.rift.read("service.ready");

store.maelstrom.rift.reset("service.ready");
store.maelstrom.rift.delete("service.ready");
store.maelstrom.rift.clear();
```

Create a standalone Rift with `store.maelstrom.rift.make()`.

## Readiness waiters

Register a callback for one signal or for several signals. Multi-signal waiters run once all listed Rifts have opened:

```ts
store.maelstrom.waiter("auth", (value) => {
  console.log("Auth is ready:", value);
});

const waiterId = store.maelstrom.waiter(["auth", "config"], () => {
  console.log("Auth and config are ready");
});

store.maelstrom.waiter.cancel(waiterId);
```

If a single Rift is already open, its callback runs immediately. For a multi-signal waiter, already-open dependencies count as ready.

To get a promise for a Rift:

```ts
const value = await store.maelstrom.waiter.wait_and_promise(
  5_000,
  "service.ready",
  false, // isOpen
  undefined, // current value
);
```

The helper subscribes before checking the supplied `isOpen` state to avoid missing an opening between those steps. Pass the Rift’s current `isOpen` and `current` values.

## Deferred tasks

Deferred tasks run when all their dependencies have open Rifts. Dependency values are passed to the callback in the same order as the dependency list.

```ts
store.maelstrom.defer(["cache", "logger"], (cache, logger) => {
  startService(cache, logger);
});

store.maelstrom.defer.provide("cache", cacheInstance);
store.maelstrom.defer.provide({ logger: loggerInstance });
```

A dependency can also be resolved without a value:

```ts
store.maelstrom.defer.resolve("service.ready");
```

Inspect, cancel, or clear tasks:

```ts
const taskId = store.maelstrom.defer("database", initializeDatabase);

store.maelstrom.defer.cancel(taskId);
store.maelstrom.defer.inspect();
store.maelstrom.defer.clear();
store.maelstrom.defer.drain();
```

`defer.invalidate(key)` deletes the dependency Rift; `defer.has(key)` checks whether it is open, and `defer.get(key)` returns its current value.

Task statistics include registered, executed, completed, failed, and cancelled counts. Tasks that return promises are tracked until they settle. Failures are logged through `defer.onError()`; successful completions are reported through `defer.onSuccess()`.

## Module resolution

```ts
const namespace = await store.maelstrom.module("./module.js");
const resolvedKey = store.maelstrom.key_for("./module.js");

store.maelstrom.module.isLoaded("./module.js");
store.maelstrom.module.getLoaded("./module.js");

const fs = store.maelstrom.module.require("node:fs");
```

`module()` tries available synchronous resolution paths before falling back to dynamic import, so its result may be a value or a promise. `module.require()` returns `undefined` when `require` is unavailable.

Look up or check exports:

```ts
const exported = store.maelstrom.module.export_of("createClient");
const fromModule = store.maelstrom.module.export_of("createClient", "./client.js");

const namespace = await store.maelstrom.module("some-package");
const named = store.maelstrom.module.extract_named(namespace, "createClient");

const exists = await store.maelstrom.module.check("optional-package");
```

Calling `export_of()` without a module specifier throws if more than one loaded module provides the requested export.

### Optional imports

`probe()` starts a named-export import in the background and returns the fallback immediately. Later calls with the same label return the resolved export or fallback:

```ts
const client = store.maelstrom.rift.probe(
  "optional.client",
  "./optional-client.js",
  "client",
  fallbackClient,
);
```

Use distinct labels for distinct values.

For more configurable imports, use `rift.conjure()`:

```ts
const result = store.maelstrom.rift.conjure({
  moduleName: "optional-package",
  fallback: () => fallbackValue,
  cache: true,
  preferRequire: false,
});
```

Options include a fallback value or factory, caching, `preferRequire`, an `importPromise`, a forced value, and environment-specific candidates. The exact resolution path can be synchronous or asynchronous.

## Environment detection

```ts
store.maelstrom.detect.capability("shared_worker");
store.maelstrom.detect.bundler();

const first = await store.maelstrom.detect.firstMatch(["vitest", "jest"]);
const all = await store.maelstrom.detect.all(["vite", "rollup"]);

store.maelstrom.detect.environment();
const env = store.maelstrom.useEnvState();
```

`detect.environment()` starts asynchronous detection and records its result when complete. `useEnvState()` returns the current state; if detection has not completed, it warns once and returns defaults.

The value returned by `detect.type(value)` classifies common values such as thenables, async iterables, arrays, maps, sets, dates, errors, and primitives.

## Apparations and safe fallbacks

Apparations are placeholders for common types:

```ts
const emptyList = store.maelstrom.apparation.array<string>();
const emptyMap = store.maelstrom.apparation.map<string, number>();
const placeholder = store.maelstrom.apparation.object<MyType>();
const noop = store.maelstrom.apparation.func<MyType>();
```

For optional module access, Maelstrom also provides a safe proxy:

```ts
const safeFallback = store.maelstrom.createSafeProxy();
```

The proxy suppresses many missing-module property, call, and construction errors. It is a fallback—not a replacement for validating required dependencies or their behavior.

## Results, logging, and reset

Maelstrom records resolution outcomes on Rift entries:

```ts
store.maelstrom.record("service", "manual", service);

store.maelstrom.results;
store.maelstrom.size;
store.maelstrom.rift.result("service");
store.maelstrom.rift.resultsFrom("manual");

const unsubscribe = store.maelstrom.rift.onResult((result) => {
  console.log(result);
});
```

Log a Maelstrom event:

```ts
store.maelstrom.log("MODULE", { module: "optional-package" }, "info");
```

Log levels are `info`, `success`, `warn`, and `error`.

Reset Maelstrom registries, deferred tasks, statistics, and environment state:

```ts
store.maelstrom.reset();
```

Resetting clears Maelstrom’s coordination state; it does not imply that the ordinary Store data or scoped state is cleared.

## Usage Quick Reference Sheet

```tsx
/*  ==========================================================================================================================
     SET / GET
     Store a value                                                                                   Store.set("user", user)
     Store a lazily-created value                                                  Store.setLazy("user", () => createUser())
     Retrieve a value                                                                                      Store.get("user")
     Retrieve with fallback                                                                      Store.get("user", fallback)
     Check whether a key exists                                                                            Store.has("user")
     Delete a value                                                                                     Store.delete("user")
     Remove all values                                                                                         Store.clear()
     Retrieve all values                                                                                      Store.getAll()
     Freeze further writes                                                                                    Store.freeze()

     SUBSCRIPTIONS
     Subscribe to changes on a specific key                                                      Store.subscribe("user", fn)
     Subscribe to all store changes                                                                      Store.subscribe(fn)
     Subscribe and receive the current value immediately                    Store.subscribe("user", fn, { immediate: true })
     Observe changes through an async iterator                                                       Store.subscribe("user")
     Observe with an immediate initial value                                    Store.subscribe("user", { immediate: true })
     Unsubscribe all matching listeners                                                            Store.unsubscribeAll(fns)
     Get subscribers registered for multiple keys                                    Store.subscribersOf(["user", "config"])

     WAITERS
     Wait for the next matching value                                                               await Store.wait("user")
     Wait for a change, ignoring the current value                                            await Store.waitChange("user")
     Wait until a predicate is satisfied                                              await Store.waitFor("user", predicate)
     Wait with a timeout                                                         await Store.wait("user", { timeout: 5000 })
     Wait with an AbortSignal                                                           await Store.wait("user", { signal })

     ATOMIC OPERATIONS
     Set only when a key does not exist                                                      Store.setIfAbsent("user", user)
     Set only when a key already exists                                                     Store.setIfPresent("user", user)
     Replace an existing value                                                                   Store.replace("user", user)
     Update using the previous value                                                            Store.update("count", fn, 0)
     Increment a numeric value                                                                         Store.inc("count", 1)
     Register a key without overwriting its value                                                        Store.touch("user")

     COLLECTION / INSPECTION
     Convert store to a plain object                                                                          Store.toJSON()
     Retrieve entries                                                                                        Store.entries()
     Retrieve keys                                                                                              Store.keys()
     Retrieve values                                                                                          Store.values()
     Find a value                                                                                      Store.find(predicate)
     Find a matching key                                                                            Store.findKey(predicate)
     Group values                                                                                            Store.group(fn)
     Select specific keys                                                                                   Store.pick(keys)
     Exclude specific keys                                                                                  Store.omit(keys)
     Create a snapshot                                                                                      Store.snapshot()
     Compare stores                                                                                      Store.equals(other)
     Inspect subscription state                                                                         Store.snapshotSubs()
     ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
     Store.STATE                                                   Scoped state is organized by root → master → slave → key.

     Retrieve a scoped state map                                                                        Store.state.getMap()
     Retrieve a map using custom channels                                            Store.state.getMap(slave, master, root)
     Retrieve scoped metadata                                                                      Store.state.getMetadata()
     Read a state value                                                                                 Store.state.get(key)
     Read using custom channels                                                                   Store.state.get(key, opts)
     Write a state value                                                                         Store.state.set(key, value)
     Write with notification options                                                       Store.state.set(key, value, opts)
     Subscribe to a state key                                                           Store.state.subscribe(key, listener)
     Check whether a state key exists                                                                   Store.state.has(key)
     Delete a state key                                                                              Store.state.delete(key)
     Retrieve scoped entries                                                                           Store.state.entries()
     Clear scoped state                                                                                  Store.state.clear()
     Schedule a key notification                                                                      Store.state._emit(key)

     PERSISTENCE
     Mark a state key for persistence                                                               Store.state.persist(key)
     Remove a key from persistence                                                                Store.state.unpersist(key)
     Clear persistent values                                                                   Store.state.clearPersistent()

     Notification scheduling is cached and flushed through the Store's
     notification pipeline. State metadata also holds batching, history,
     time-travel, listeners, waiters, contracts, conflicts and scope information.
     ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
     MAELSTROM

     MODULE RESOLUTION
     Dynamically import an ESM module                                                 await Store.maelstrom.module("module")
     Resolve a module relative to the current module                                  Store.maelstrom.key_for("./module.js")
     Synchronously require a module                                                Store.maelstrom.module.require("node:fs")
     Check whether a module has loaded                                        Store.maelstrom.module.isLoaded("./module.js")
     Retrieve a loaded module                                                Store.maelstrom.module.getLoaded("./module.js")
     Extract a named export                                           Store.maelstrom.module.extract_named(ns, "exportName")
     Retrieve a named export                                                  Store.maelstrom.module.export_of("exportName")
     Retrieve a named export from a specific module            Store.maelstrom.module.export_of("exportName", "./module.js")
     Load and resolve a named export                             Store.maelstrom.module.named_export("module", "exportName")
     Initialize module resolution                                                      Store.maelstrom.module.init("module")
     Initialize a named export                              Store.maelstrom.module.init.named_export("module", "exportName")
     Check whether a module exists                                              await Store.maelstrom.module.check("module")
     Index exports from a loaded module                                  Store.maelstrom.module.indexExports(rift, key, mod)

     RIFT REGISTRY
     Retrieve or create a Rift                                                         Store.maelstrom.rift("service.ready")
     Create a Rift directly                                                                      Store.maelstrom.rift.make()
     Check whether a Rift exists                                                   Store.maelstrom.rift.has("service.ready")
     Inspect registered Rifts                                                                 Store.maelstrom.rift.inspect()
     Clear the Rift registry                                                                    Store.maelstrom.rift.clear()
     Read a Rift value                                                            Store.maelstrom.rift.read("service.ready")
     Reset a Rift                                                                Store.maelstrom.rift.reset("service.ready")
     Delete a Rift                                                              Store.maelstrom.rift.delete("service.ready")
     Wait for a Rift                                                      await Store.maelstrom.rift("service.ready").wait()
     Guard execution behind a Rift                                           Store.maelstrom.rift.guard("service.ready", fn)
     Resolve a global Rift                              Store.maelstrom.rift.resolve.global("service.ready", timeout, value)

     RIFT RESOLUTION
     Retrieve or resolve a module through a Rift                                         Store.maelstrom.rift.use("service")
     Create a Rift from a supplied value                                       Store.maelstrom.rift.create("service", value)
     Read a Rift value                                                                  Store.maelstrom.rift.read("service")
     Resolve an existing or claimed Rift                                      Store.maelstrom.rift.resolve.global("service")
     Resolve a module with a fallback                      Store.maelstrom.rift.resolve.global("service", timeout, fallback)
     Probe a named export with a synchs fallback    Store.maelstrom.rift.probe("service", "./module.js", "export", fallback)
     Probe a named export w/o blocking   Store.maelstrom.rift.use_if_available("service", "./module.js", "export", fallback)
     Conjure a module through the Rift resolver                                        Store.maelstrom.rift.conjure(options)
     Conjure without caching                                                  Store.maelstrom.rift.conjure.uncached(options)
     Retrieve a module Rift                                                       Store.maelstrom.rift.conjure.get("module")

     RESULTS
     Retrieve all recorded results                                                                   Store.maelstrom.results
     Retrieve the number of registered Rifts                                                            Store.maelstrom.size
     Retrieve a specific result                                                       Store.maelstrom.rift.result("service")
     Filter results by solver                                                     Store.maelstrom.rift.resultsFrom("solver")
     Subscribe to recorded results                                                         Store.maelstrom.rift.onResult(fn)
     Record a resolution outcome                                                Store.maelstrom.record(label, solver, value)

     WAITERS
     Wait for one or more readiness signals                                               Store.maelstrom.waiter("auth", fn)
     Wait for multiple signals                                                Store.maelstrom.waiter(["auth", "config"], fn)
     Cancel a multi-signal waiter                                                          Store.maelstrom.waiter.cancel(id)
     Wait for a Rift through a Promise                Store.maelstrom.waiter.wait_and_promise(timeout, key, isOpen, current)

     DEFER
     Schedule execution when dependencies become available                                Store.maelstrom.defer("cache", fn)
     Schedule execution after multiple dependencies                           Store.maelstrom.defer(["cache", "logger"], fn)
     Provide a dependency                                              Store.maelstrom.defer.provide("cache", cacheInstance)
     Provide multiple dependencies                                          Store.maelstrom.defer.provide({ cache, logger })
     Resolve a dependency without a value                                     Store.maelstrom.defer.resolve("service.ready")
     Invalidate a dependency                                               Store.maelstrom.defer.invalidate("service.ready")
     Check whether a dependency is available                                              Store.maelstrom.defer.has("cache")
     Retrieve a dependency                                                                Store.maelstrom.defer.get("cache")
     Check whether a task's dependencies are ready                                         Store.maelstrom.defer.ready(task)
     Cancel a pending task                                                                  Store.maelstrom.defer.cancel(id)
     Inspect pending/running tasks and scheduler statistics                                  Store.maelstrom.defer.inspect()
     Clear pending tasks                                                                       Store.maelstrom.defer.clear()
     Drain the scheduler                                                                       Store.maelstrom.defer.drain()

     ENVIRONMENT DETECTION
     Detect runtime and available modules                                               Store.maelstrom.detect.environment()
     Detect a specific module                                                  Store.maelstrom.detect.firstMatch(candidates)
     Detect all available modules                                                     Store.maelstrom.detect.all(candidates)
     Detect a runtime capability                                          Store.maelstrom.detect.capability("shared_worker")
     Detect the package manager                                                             Store.maelstrom.detect.bundler()
     Inspect environment state                                                                 Store.maelstrom.useEnvState()
     APPARATION
     Create a generic array                                                       Store.maelstrom.apparation.array<string>()
     Create a generic object                                                     Store.maelstrom.apparation.object<MyType>()
     Create a generic Map                                                   Store.maelstrom.apparation.map<string, number>()
     Create a generic Set                                                           Store.maelstrom.apparation.set<string>()
     Create a generic Promise                                                   Store.maelstrom.apparation.promise<MyType>()
     Create a generic function                                                     Store.maelstrom.apparation.func<MyType>()
     Create a generic WeakMap                                           Store.maelstrom.apparation.weakMap<object, MyType>()
     Create a generic async iterable                                      Store.maelstrom.apparation.asyncIterable<MyType>()
     Create a generic typed array                                        Store.maelstrom.apparation.typedArray<Uint8Array>()
     Create a generic value placeholder                                             Store.maelstrom.apparation.any<MyType>()

     RESET / LOGGING
     Log a MAELSTROM event                                                               Store.maelstrom.log("AREA", detail)
     Reset MAELSTROM registries, tasks and environment state                                         Store.maelstrom.reset()
	======================================================================== ⇦✦──⇦✦──✦──✦──← 'pew pew' 🧙 [Store/MAELSTROM] */
```
## Maelstrom quick reference

| If you need to… | Use | Example |
|---|---|---|
| Load a module, allowing dynamic import as a fallback | `maelstrom.module()` | `await store.maelstrom.module("some-package")` |
| Load a module synchronously with `require` | `maelstrom.module.require()` | `store.maelstrom.module.require("node:fs")` |
| Check whether a module is installed | `maelstrom.module.check()` | `await store.maelstrom.module.check("optional-package")` |
| Reuse a previously loaded module | `maelstrom.module.isLoaded()` / `getLoaded()` | `store.maelstrom.module.getLoaded("./client.js")` |
| Find a named export in loaded modules | `maelstrom.module.export_of()` | `store.maelstrom.module.export_of("createClient")` |
| Import a named export from one module | `maelstrom.module.named_export()` | `store.maelstrom.module.named_export("./client.js", "createClient")` |
| Resolve a path relative to this module | `maelstrom.key_for()` | `store.maelstrom.key_for("./config.js")` |
| Return a fallback immediately while probing for an export | `maelstrom.rift.probe()` | `store.maelstrom.rift.probe("client", "./client.js", "createClient", fallback)` |
| Load an optional dependency with caching and a fallback | `maelstrom.rift.conjure()` | `store.maelstrom.rift.conjure({ moduleName: "optional-package", fallback })` |
| Create or retrieve a readiness signal | `maelstrom.rift()` | `store.maelstrom.rift("db.ready")` |
| Open a readiness signal with a value | `maelstrom.rift.create()` or `maelstrom.rift.place()` | `store.maelstrom.rift.create("db.ready", db)` |
| Wait for a signal to open | `rift.wait()` | `await store.maelstrom.rift("db.ready").wait()` |
| Wait for multiple signals before running code | `maelstrom.waiter()` | `store.maelstrom.waiter(["db.ready", "auth.ready"], startApp)` |
| Run work once dependencies are available | `maelstrom.defer()` | `store.maelstrom.defer(["cache", "logger"], startService)` |
| Provide one or more deferred dependencies | `maelstrom.defer.provide()` | `store.maelstrom.defer.provide({ cache, logger })` |
| Mark a dependency ready without a value | `maelstrom.defer.resolve()` | `store.maelstrom.defer.resolve("service.ready")` |
| Inspect or cancel deferred work | `maelstrom.defer.inspect()` / `cancel()` | `store.maelstrom.defer.inspect()` |
| Detect runtime capabilities | `maelstrom.detect.capability()` | `store.maelstrom.detect.capability("shared_worker")` |
| Find installed platforms, compilers, or adapters | `maelstrom.detect.environment()` | `store.maelstrom.detect.environment()` |
| Read detected environment information | `maelstrom.useEnvState()` | `const env = store.maelstrom.useEnvState()` |
| Supply a safe placeholder for an unavailable module | `maelstrom.createSafeProxy()` | `const fallback = store.maelstrom.createSafeProxy()` |
| Create an empty value with a particular type | `maelstrom.apparation.*()` | `store.maelstrom.apparation.map<string, number>()` |
| Review recorded resolution outcomes | `maelstrom.results` / `rift.result()` | `store.maelstrom.rift.result("db.ready")` |
| Listen for recorded outcomes | `maelstrom.rift.onResult()` | `store.maelstrom.rift.onResult(console.log)` |
| Log a diagnostic event | `maelstrom.log()` | `store.maelstrom.log("MODULE", { name }, "warn")` |
| Clear Maelstrom coordination state | `maelstrom.reset()` | `store.maelstrom.reset()` |


 