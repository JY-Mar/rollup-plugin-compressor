A plugin for rollup or vite to compress the bundle directory which supports `.zip` `.tar` `.tgz` formats.

> Forked from: https://github.com/lourain/rollup-plugin-compress-dist
> And referred to: https://gitee.com/codercjx/rollup-plugin-compression

## Usage

  1. download from npm
  ```
    npm install rollup-plugin-compressor --dev
  ```
  2. Modify configuration file of project. it would archive `dist` directory to `dist.tar.gz` by default.For example: 
  ```javascript
  //vite.config.ts
  import { defineConfig } from 'vite';
  import compressDist, { CompressOptions } from 'rollup-plugin-compressor';
  ...
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
   };
  export default defineConfig({
    plugins: [compressor(compressOptions)],
    ...
  });
  
  ```
