The upgraded `Store` now has two distinct usage surfaces:

1. Primary Store API — in-memory reactive key/value storage, subscriptions, async iteration, waiters, snapshots, and atomic-style updates.
2. Nested `store` API — channel-scoped state storage with persistence, metadata, history/time-travel integration, and batched notifications.

The old README usage only covers basic subscriptions. Here's an updated replacement that covers the actual implementation.

# Store — Usage & Quick Reference

# Store

A reactive key/value store with scoped storage, subscriptions, async iteration, conditional updates, persistence, and change waiting.

## Installation / Import

```
import store, { Store } from "./store";

// Shared singleton
store.set("user", "Alice");

// Independent store instance
const local = new Store();
local.set("user", "Bob");
```

The default export is a shared `Store` instance. Use `new Store()` when an independent store is required.

---

## 1. Basic Storage

```
store.set("user", "Alice");
store.set("count", 10);

store.get("user");             // "Alice"
store.get("missing");          // undefined
store.get("missing", "Guest"); // "Guest"

store.has("user");             // true

store.delete("user");
store.clear();
```

### Lazy Initialization

```
store.setLazy("config", () => loadConfig());
```

The factory is evaluated when called, and the resulting value is stored.

### Freeze

```
store.freeze();
```

Prevents subsequent calls to `set()` and throws if a write is attempted.

---

## 2. Subscriptions

### Subscribe to a Specific Key

```
const unsub = store.subscribe("user", (value, prev, key) => {
    console.log(`${key}:`, prev, "->", value);
});

store.set("user", "Alice");
store.set("other", 1); // Ignored

unsub();
```

### Subscribe to All Changes

```
const unsub = store.subscribe((value, prev, key) => {
    console.log("Changed:", key, prev, value);
});

store.set("user", "Alice");
store.set("count", 10);

unsub();
```

### Immediate Subscription

```
const unsub = store.subscribe(
    "user",
    (value, prev, key) => {
        console.log(value);
    },
    { immediate: true }
);
```

When enabled, the callback is queued as a microtask with the current value.

### Unsubscribe Multiple Listeners

```
store.unsubscribeAll([listenerA, listenerB]);
```

### Get Subscribers for Multiple Keys

```
const subscribers = store.subscribersOf([
    "user",
    "count",
    "config"
]);
```

Returns a combined `SET2` of subscribers.

### Snapshot Subscriptions

```
const subscriptions = store.snapshotSubs();
```

Returns a cloned map of the current key-specific subscriber sets.

---

## 3. Async Iteration

Subscribe to changes using an async generator.

```
for await (const value of store.subscribe("token", {
    immediate: true
})) {
    await refreshWith(value);

    if (value === "stop") break;
}
```

The iterator supports:

- Immediate initial value.
- Subsequent change notifications.
- Buffered events while the consumer is processing.
- Automatic subscription cleanup when iteration ends.

### Process Changes with Previous Values

```
for await (const change of store.subscribe("user")) {
    console.log(change.value);
    console.log(change.prev);
}
```

---

## 4. Waiting for Changes

### Wait for the Next Change

```
const value = await store.waitChange("status");
```

Ignores the current value and waits for a subsequent notification.

### Wait Until a Condition Is Met

```
const value = await store.waitFor(
    "status",
    value => value === "ready"
);
```

### Wait with Options

```
const value = await store.wait("status", {
    predicate: value => value === "ready",
    timeout: 5000,
    immediate: true,
    signal: abortController.signal
});
```

| Option      | Description                                    |
| ----------- | ---------------------------------------------- |
| `predicate` | Determines whether a change satisfies the wait |
| `timeout`   | Maximum wait time in milliseconds              |
| `immediate` | Check the existing value before waiting        |
| `signal`    | Abort using an `AbortSignal`                   |

Timeouts reject with `TimeoutError`. Aborted waits reject with `AbortError`.

---

## 5. Conditional & Atomic Updates

### Set Only If Absent

```
store.setIfAbsent("user", "Alice");
```

Does not overwrite an existing key.

### Set Only If Present

```
store.setIfPresent("user", "Bob");
```

Does not create a missing key.

### Replace

```
store.replace("user", "Charlie");
```

Convenience alias for `setIfPresent()`.

### Update

```
store.update(
    "count",
    (old, has) => has ? old + 1 : 1,
    0
);
```

Receives the previous value and whether the key existed. The third argument supplies the initial value.

### Increment

```
store.inc("count");
store.inc("count", 5);
```

### Touch

```
store.touch("pending");
```

Registers a key with `undefined` without overwriting an existing value. Notifies subscribers when newly created.

---

## 6. Collection Operations

The Store exposes its underlying `M2` collection operations.

```
store.entries();
store.keys();
store.values();

store.toJSON();
store.snapshot();

store.find(([key, value]) => value > 10);
store.findKey(([key, value]) => value > 10);

store.group(value => value.type);
store.pick(["user", "count"]);
store.omit(["secret"]);

store.equals(otherStore);
```

| Method       | Description                         |
| ------------ | ----------------------------------- |
| `entries()`  | Returns key/value entries           |
| `keys()`     | Returns all keys                    |
| `values()`   | Returns all values                  |
| `toJSON()`   | Converts storage to an object       |
| `snapshot()` | Creates a cloned storage snapshot   |
| `find()`     | Finds an entry matching a predicate |
| `findKey()`  | Finds a key matching a predicate    |
| `group()`    | Groups stored values                |
| `pick()`     | Selects specified keys              |
| `omit()`     | Excludes specified keys             |
| `equals()`   | Compares against another collection |

---

# 7. Scoped Storage — `store.store`

The nested `store` API provides a separate storage layer with three-level addressing:

`globalKey → ms_reg → sl_reg → key`

Default channels:

| Parameter   | Default      | Purpose          |
| ----------- | ------------ | ---------------- |
| `globalKey` | `_root_k_`   | Root context     |
| `ms_reg`    | `_master_k_` | Master registry  |
| `sl_reg`    | `_slave_k_`  | Slave registry   |
| `key`       | Required     | Individual entry |

### Basic Operations

```
store.store.set("user", "Alice");

store.store.get("user");

store.store.has("user");

store.store.delete("user");

store.store.entries();

store.store.clear();
```

### Custom Channels

```
const opts = {
    sl_reg: "USERS",
    ms_reg: "APP",
    globalKey: "MY_ROOT"
};

store.store.set("user", "Alice", opts);

store.store.get("user", opts);

store.store.has("user", opts);

store.store.delete("user", opts);
```

Each combination of root, master, and slave addresses its own storage map.

### Scoped Subscriptions

```
const unsub = store.store.subscribe(
    "user",
    value => {
        console.log("User changed:", value);
    },
    opts
);
```

```
unsub();
```

### Control Notifications

```
store.store.set("user", "Alice", {
    ...opts,
    triggerRender: false
});
```

`triggerRender` defaults to `true`. Disabling it updates storage without scheduling the normal notification callbacks.

### Persistent Keys

```
store.store.persist("user", opts);

store.store.set("user", "Alice", opts);
```

Once registered as persistent, subsequent writes are mirrored into the persistent storage map.

```
store.store.get("user", opts);
```

Retrieves the active value, restoring it from persistent storage when necessary.

### Remove Persistence

```
store.store.unpersist("user", opts);
```

Removes the persistent registration and its stored value.

### Clear Persistent Storage

```
store.store.clearPersistent(opts);
```

Clears persistent values and their registrations.

---

## 8. Scoped Storage API Reference

| Method                                     | Description                                   |
| ------------------------------------------ | --------------------------------------------- |
| `get(key, opts?)`                          | Retrieves a stored value                      |
| `set(key, value, opts?)`                   | Writes a value or applies an updater function |
| `subscribe(key, fn, opts?)`                | Subscribes to a specific key                  |
| `delete(key, opts?)`                       | Deletes an entry                              |
| `entries(opts?)`                           | Returns all entries                           |
| `persist(key, opts?)`                      | Registers a persistent key                    |
| `unpersist(key, opts?)`                    | Removes persistence                           |
| `has(key, opts?)`                          | Checks active or persistent existence         |
| `clear(opts?)`                             | Clears scoped state and listeners             |
| `clearPersistent(opts?)`                   | Clears persistent values                      |
| `_emit(key, sl_reg?, ms_reg?, globalKey?)` | Schedules scoped notifications                |

---

## 9. Metadata & Internal Registries

The Store maintains metadata independently for each root/master/slave combination.

```
const metadata = store.getMetadata(
    "USERS",
    "APP",
    "MY_ROOT"
);
```

Metadata includes:

| Field                 | Purpose                        |
| --------------------- | ------------------------------ |
| `_batches`            | Batch tracking                 |
| `_batchQueue`         | Queued batch changes           |
| `_batchOpts`          | Batch notification options     |
| `_history`            | Per-key history                |
| `_timeTravel`         | Time-travel tracking           |
| `_globalListeners`    | Global change listeners        |
| `_global_subscribers` | Global subscriber registry     |
| `_waiters`            | Waiting callbacks              |
| `_sys`                | System metadata                |
| `_sealed`             | Sealed keys                    |
| `_frozen`             | Frozen keys                    |
| `_keyContracts`       | Key contracts                  |
| `_conflicts`          | Conflict tracking              |
| `_conflictStrategies` | Conflict resolution strategies |
| `_causal`             | Causal history                 |
| `_scopes`             | Scope registry                 |
| `_msgHandlers`        | Message handlers               |
| `_lastWriteSource`    | Last write source              |
| `_mainMap`            | Main-map indexing              |
| `_tupleCache`         | Tuple cache                    |
| `_weakMap`            | Weak object indexing           |
| `_boundaries`         | Boundary tracking              |

The metadata structure is shared according to its root/master/slave addressing.

---

## 10. Quick Reference

| Category       | Methods                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| Storage        | `set`, `setLazy`, `get`, `has`, `delete`, `clear`                       |
| Subscriptions  | `subscribe`, `unsubscribeAll`, `subscribersOf`, `snapshotSubs`          |
| Async          | `wait`, `waitChange`, `waitFor`, async iteration                        |
| Conditional    | `setIfAbsent`, `setIfPresent`, `replace`, `update`                      |
| Numeric        | `inc`                                                                   |
| Registration   | `touch`, `freeze`                                                       |
| Collections    | `entries`, `keys`, `values`, `find`, `findKey`, `group`, `pick`, `omit` |
| Snapshots      | `snapshot`, `equals`, `toJSON`                                          |
| Scoped storage | `store.get`, `store.set`, `store.subscribe`, `store.delete`             |
| Persistence    | `store.persist`, `store.unpersist`, `store.clearPersistent`             |
| Metadata       | `getMap`, `getMetadata`                                                 |

---

## Important Distinction

There are two storage interfaces:

- `store.set()` operates on the instance's private in-memory `M2` collection and uses its own subscription system.
- `store.store.set()` operates on the root/master/slave-scoped registry and integrates with scoped metadata, persistence, and scheduled notifications.

They are separate storage systems. Writing to one does not automatically write to the other.
