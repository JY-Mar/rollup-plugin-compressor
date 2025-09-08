import path from 'path'
import compressing from 'compressing'
import chalk from 'chalk'
import fs from 'fs'
import type { Plugin } from 'rollup'
import { defaultOption, deleteDir, deleteDirFile, isTypeMatchExt, resolveOption, validItem, type CompressOptions, type CompressType, type ResolvedCompressOption } from './utils'

export type { CompressOptions } from './utils'

/**
 * rollup plugins
 */
const queue: ResolvedCompressOption[] = []

/**
 * return Rollup plugin Object
 * @param        {CompressOptions} options
 * @return       {*}
 */
function compressor(options: CompressOptions[] | CompressOptions<CompressType | CompressType[]> | undefined = defaultOption): Plugin {
  if (typeof options === 'object' && options) {
    if (Object.prototype.toString.call(options) === '[object Object]') {
      queue.push(...resolveOption(options as CompressOptions))
    } else if (options instanceof Array) {
      options.forEach((opt) => {
        typeof opt === 'object' && Object.prototype.toString.call(opt) === '[object Object]' && queue.push(...resolveOption(opt as CompressOptions))
      })
    }
  }

  return {
    name: 'Compressor',
    buildStart() {
      queue.forEach((que) => {
        if (validItem(que?.pkgPath) && validItem(que?.cwdPath) && validItem(que?.type)) {
          //1. Deletes packaged directory, default `dist`
          deleteDir(que.pkgPath)
          //2. Deletes all files with the specified extension from the `cwdPath`.
          deleteDirFile(que.cwdPath, que.type)
        }
      })
    },
    closeBundle() {
      queue.forEach((que, queIndex) => {
        if (validItem(que.sourceName) && validItem(que.targetName) && validItem(que.type) && validItem(que.extname) && validItem(que.pkgPath) && validItem(que.cwdPath) && validItem(que.ignoreBase)) {
          let basename: string
          if (isTypeMatchExt(que.targetName, que.type)) {
            basename = que.targetName.substring(0, que.targetName.indexOf(`.${que.extname}`))
          } else {
            basename = que.targetName
          }
          const destStream = fs.createWriteStream(path.resolve(que.cwdPath, `${basename}.${que.extname}`))
          const sourceStream = new compressing[que.type].Stream()

          destStream.on('finish', () => {
            console.log(chalk.cyan(`✨[rollup-plugin-compressor#${queIndex + 1}]: ${que.sourceName} compress completed: `))
            console.log(chalk.hex('#757575')(path.resolve(que.cwdPath, `${basename}.${que.extname}`)))
          })
          destStream.on('error', (err) => {
            console.log(chalk.hex('#e74856')(`‼️[rollup-plugin-compressor#${queIndex + 1}]: ${que.sourceName} compress failed`))
            throw err
          })

          sourceStream.addEntry(que.pkgPath, { ignoreBase: que.ignoreBase })
          sourceStream.pipe(destStream)
        }
      })
    }
  }
}

export default compressor
