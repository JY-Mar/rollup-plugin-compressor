// Forked from: https://github.com/lourain/rollup-plugin-compress-dist
// And referred to: https://gitee.com/codercjx/rollup-plugin-compression

import { cwd } from 'process'
import path from 'path'
import compressing from 'compressing'
import chalk from 'chalk'
import fs from 'fs'

enum ExtnameType {
  zip = 'zip',
  tar = 'tar',
  tgz = 'tar.gz'
}
const ExtnameTypeList = Object.keys(ExtnameType) as (keyof typeof ExtnameType)[]
type CompressType = keyof typeof ExtnameType

export interface CompressOptions<Type extends CompressType = CompressType> {
  sourceName?: string
  type: Type
  targetName?: TargetName<Type>
  /**
   * 默认打包源文件夹本身,配置为 true 则只打包文件夹内文件
   */
  ignoreBase?: boolean
}
type TargetName<T> = T extends 'zip' | 'tar' ? string | `${string}.${T}` : T extends 'tgz' ? string | `${string}.tar.gz` : never

const defaultOption: CompressOptions<'tgz'> = {
  type: 'tgz',
  sourceName: 'dist',
  targetName: 'dist.tar.gz',
  ignoreBase: false
}

/**
 * 删除 目录 及 目录中的所有 目录和文件
 * @return       {*}
 */
function deleteDir(targetPath: string): void {
  // 1. 判断 路径是否存在
  if (!targetPath) return
  if (!fs.existsSync(targetPath)) return
  // 2. 获取该路径下所有目录名和文件名
  const files = fs.readdirSync(targetPath)
  files.forEach((file) => {
    // 3. 拼接 目录下的目录路径 和 文件路径
    const curPath = path.resolve(targetPath, file)
    // 4. 判断是否 是目录
    if (fs.statSync(curPath).isDirectory()) {
      // 是目录  递归删除里面的 文件
      deleteDir(curPath)
    } else {
      // 是文件 删除
      fs.unlinkSync(curPath)
    }
  })
  // 删除 目录
  fs.rmdirSync(targetPath)
}

function deleteDirFile(targetPath: string, type: CompressType = defaultOption.type): void {
  if (!targetPath) return
  const rootPathFiles = fs.readdirSync(targetPath)
  // console.log("获取==根路径下文件", rootPathFiles);
  rootPathFiles.forEach((file) => {
    const currentPath = path.resolve(targetPath, file)
    // 判断是否是目录
    if (!fs.statSync(currentPath).isDirectory()) {
      // 不是目录 说明是文件
      // 获取文件扩展名
      const extname = path.extname(file)
      const _type = (type === 'tgz' ? 'gz' : type) ?? defaultOption.type
      if (extname === `.${_type}`) {
        // 判断是否 是 打包的文件  是 就删除文件
        fs.unlinkSync(currentPath)
      }
    }
    // console.log("根路劲下目录和文件", currentPath);
  })
}
function validExtAndType(targetPath: string, type: string): boolean {
  return targetPath && type && new RegExp(`\.+\\.${ExtnameType[type]}\$`).test(targetPath)
}

function compressorBuild(options: CompressOptions | undefined = defaultOption) {
  const sourceName = options?.sourceName ?? defaultOption.sourceName
  const targetName = options?.targetName ?? defaultOption.targetName
  let type = options?.type ?? defaultOption.type
  type = ExtnameTypeList.indexOf(type) > -1 ? type : defaultOption.type
  const ignoreBase = options?.ignoreBase ?? defaultOption.ignoreBase
  const rootPath = cwd()
  const buildPath = path.resolve(rootPath, sourceName)

  return {
    name: 'compressor',
    buildStart() {
      //1. 删除 build 构建目录
      deleteDir(buildPath)
      //2. 删除 目录下 指定的扩展名 文件
      deleteDirFile(rootPath, type)
    },
    closeBundle() {
      console.log('closeBundle')
      chalk.bgBlue(`buildPath: ${buildPath}`)
      const extname = ExtnameType[type]
      let basename: string
      if (validExtAndType(targetName, type)) {
        basename = targetName.substring(0, targetName.indexOf(`.${extname}`))
      } else {
        basename = targetName
      }

      const destStream = fs.createWriteStream(path.resolve(rootPath, `${basename}.${extname}`))
      const sourceStream = new compressing[type].Stream()

      destStream.on('finish', () => {
        console.log(chalk.cyan(`✨[rollup-plugin-compressor]: ${sourceName} compress completed: `))
        console.log(chalk.hex('#757575')(path.resolve(rootPath, `${basename}.${extname}`)))
      })

      destStream.on('error', (err) => {
        throw err
      })

      sourceStream.addEntry(buildPath, { ignoreBase: ignoreBase })
      sourceStream.pipe(destStream)
    }
  }
}

export default compressorBuild
