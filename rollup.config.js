import rollupEsbuild from 'rollup-plugin-esbuild'
import rollupDts from 'rollup-plugin-dts'
import rollupNodeResolve from '@rollup/plugin-node-resolve'
import rollupCommonjs from '@rollup/plugin-commonjs'
import rollupJson from '@rollup/plugin-json'
import rollupAlias from '@rollup/plugin-alias'
import rollupTerser from '@rollup/plugin-terser'
import rollupStrip from '@rollup/plugin-strip'

const entries = ['./src/index.ts']

const plugins = [
  rollupAlias({
    entries: [{ find: /^node:(.+)$/, replacement: '$1' }]
  }),
  // 处理外部依赖
  rollupNodeResolve({
    preferBuiltins: true
  }),
  rollupJson(),
  // 支持基于 CommonJS 模块引入
  rollupCommonjs(),
  rollupTerser(),
  rollupEsbuild({
    target: 'ESNext'
  }),
  // 清除调试代码
  rollupStrip({
    debugger: true,
    functions: ['console.!(warn|error)', 'assert.*'],
    sourceMap: true
  })
]

export default [
  ...entries.map((input) => ({
    strictDeprecations: true,
    input,
    output: [
      // cjs：CommonJS，适用于 Node 环境和其他打包工具
      // es：将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器，别名：esm，module
      // umd：通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
      {
        // file: 'dist/libs.es.mjs',
        file: 'dist/libs.es.js',
        format: 'esm'
        // 也可以单独配置压缩
        // plugins: [rollupTerser()]
      },
      {
        // file: 'dist/libs.umd.cjs',
        file: 'dist/libs.umd.js',
        name: 'libs.umd', // umd必须填name
        format: 'umd'
      }
    ],
    external: [],
    plugins
  })),
  ...entries.map((input) => ({
    strictDeprecations: true,
    input,
    output: {
      file: 'dist/index.d.ts',
      name: 'index.d',
      format: 'umd'
    },
    external: [],
    plugins: [rollupDts({ respectExternal: true, compilerOptions: { module: 'NodeNext' } })]
  }))
  // ...entries.map((input) => ({
  //   strictDeprecations: true,
  //   input,
  //   output: {
  //     file: 'index.d.ts',
  //     name: 'index.d',
  //     format: 'umd'
  //   },
  //   external: [],
  //   plugins: [rollupDts({ respectExternal: true, compilerOptions: { module: 'NodeNext' } })]
  // }))
]