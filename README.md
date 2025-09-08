A plugin for rollup or vite to compress the bundle directory which supports `.zip` `.tar` `.tgz` formats.

> Forked from: https://github.com/lourain/rollup-plugin-compress-dist
>
> And referred to: https://gitee.com/codercjx/rollup-plugin-compression

## Module formats

Plugin that supports multiple module formats — `ESModule`, `UMD`, and `CommonJS` — and automatically applies the most appropriate import strategy based on the runtime environment.

> Added support for `ESModule`, `UMD`, and `CommonJS` environments in version 1.0.3.

| Module formats   | CommonJS       | ESModule              | UMD                            |
| ---------------------- | -------------- | --------------------- | ------------------------------ |
| Applicable Environment | Node.js        | Browser & Node.js     | Universal (Browser, Node, AMD) |

## Installaion

```bash
npm install rollup-plugin-compressor --dev
```

## Usage

Modify configuration file of project. it would archive `dist` directory to `dist.tar.gz` by default. For example:

```js
// vite.config.ts
import { defineConfig } from 'vite'
import compressor, { CompressOptions } from 'rollup-plugin-compressor'

/* ...Your code... */

const compressOpts: CompressOptions = {
  type: 'tgz',
  // The extname of targetName will not No longer necessary
  // If the extname not exactly corresponds to the type, extname will up to the type
  // Example: type = 'tgz', targetName = 'dist.tar.gz' => result = 'dist.tar.gz'
  // Example: type = 'tgz', targetName = 'dist.zip' => result = 'dist.zip.tar.gz'
  // Example: type = 'tgz', targetName = 'dist' => result = 'dist.tar.gz'
  targetName: 'dist.tar.gz',
  sourceName: 'dist',
  // Default package source folder, and only package the internal files if ignoreBase is true
  ignoreBase: false
}
export default defineConfig({
  /* ...Your code... */
  plugins: [compressor(compressOptions)]
  /* ...Your code... */
})
```

## Advanced Usage

"Multiple" mode enables full permutation of combinations when `type` or `targetName` is an array of strings. For example:

```js
// vite.config.ts
import { defineConfig } from 'vite'
import compressor, { CompressOptions } from 'rollup-plugin-compressor'

/* ...Your code... */

const compressOpts: CompressOptions = {
  sourceName: 'dist',

  // ** [e.g.1] The following code will generate compressed files(packaging 'dist' into zip archive and tar.gz archive):
  // result files: [dist/pkg.zip, dist/pkg.tar.gz]
  type: ['zip', 'tgz'],
  targetName: 'dist/pkg',
  // ** [e.g.1]

  // ** [e.g.2] The following code will generate compressed files(packaging 'dist' into zip archive and tar.gz archive):
  // result files: [dist/pkg1.zip, dist/pkg2.zip]
  type: 'zip',
  targetName: ['dist/pkg1', 'dist/pkg2'],
  // ** [e.g.2]

  // ** [e.g.3] The following code will generate compressed files(packaging 'dist' into zip archive and tar.gz archive):
  // result files: [dist/pkg1.zip, dist/pkg1.tar.gz, dist/pkg2.zip, dist/pkg2.tar.gz]
  type: ['zip', 'tgz'],
  targetName: ['dist/pkg1', 'dist/pkg2'],
  // ** [e.g.3]

  ignoreBase: false
}
export default defineConfig({
  /* ...Your code... */
  plugins: [compressor(compressOptions)]
  /* ...Your code... */
})
```

## Apologize

This README was translated with the help of Copilot. We apologize for any potential inaccuracies.
