# @deecision/resolver

Validate and normalize your data with ease.

* Full tested with [jest](https://facebook.github.io/jest/) (100% coverage).
* Rigorously typed with [flow](https://flowtype.org/).
* Fully and easily extensible.
* Readable and maintainable codebase, no dependency.

## Get started

**How to install:**

* using **npm**: `npm install --save @deecision/resolver`
* using **yarn**: `yarn add @deecision/resolver`

**How to use:**

```js
import Resolver from '@deecision/resolver';

const resolver = Resolver.create('object', { props: {
    email: { type: 'string', required: true, pattern: 'email' }, 
    password: { type: 'string', required: true, length: [ 8, Infinity ] },
    remember: { type: 'boolean' },
}});

// returns normalized data
// throws violations if validation fails
const data = resolver.resolve(data);
```
