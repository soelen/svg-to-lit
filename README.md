# svg-to-lit
Converting svg files for lit.dev based projects.

This package will generate a js or ts file (whatever you specify as output). It will use the *file name* to export all transpiled svg string in camelized *variable names*.

## Example

```
svg-to-lit --input ./icons/* --output ./dist/icons.js
```
May generate a file like this: 
```
// ./dist/icons.js

import { svg } from 'lit';

export const arrow = svg`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.2">...</svg>`

export const happyBunny = svg`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.2">...</svg>`

// etc.
```

## Params

```
-i | --input:  Specify input. Glob patterns are possible. This parameter is required.
-o | --output: Specify output. This parameter is required.
-h | --help:   Call this fancy help once again.
-c | --compress: Compress / Optimize svg in the process.
```