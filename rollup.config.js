import path from 'path'
import typescript2 from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import strip from '@rollup/plugin-strip'
import alias from '@rollup/plugin-alias'

export default [
  {
    input: path.join('src', 'index.ts'),
    output: [
      // ESModule
      {
        file: path.join('dist', 'index.esm.js'),
        format: 'esm',
        sourcemap: false
      },
      // CommonJS
      {
        file: path.join('dist', 'index.cjs.js'),
        format: 'cjs',
        sourcemap: false
      },
      // Browser
      {
        file: path.join('dist', 'index.umd.js'),
        format: 'umd',
        name: 'index.umd', // UMD 需要一个全局变量名
        sourcemap: false
      }
    ],
    plugins: [
      alias({ entries: [{ find: /^node:(.+)$/, replacement: '$1' }] }),
      resolve({ preferBuiltins: true }), // 解析 node_modules 中的依赖
      commonjs(), // 支持 CommonJS 模块
      terser(),
      json(),
      // 清除调试代码
      strip({
        debugger: true,
        functions: ['console.!(warn|error)', 'assert.*'],
        sourceMap: true
      }),
      typescript2()
    ],
    external: ['fs', 'path', 'process', 'chalk', 'compressing']
  }
]
