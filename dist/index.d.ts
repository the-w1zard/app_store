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
export {};
