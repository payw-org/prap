import fs from 'fs'
import 'graphql-import-node'
import { DocumentNode } from 'graphql'
import { IResolvers } from 'graphql-tools'
import { mergeTypeDefs } from '@graphql-toolkit/schema-merging'

export function requireAll<T>(dir: string): T[]
export function requireAll<T>(
  dir: string,
  filter: (fileName: string) => boolean
): T[]
export function requireAll<T>(
  dir: string,
  filter: (fileName: string) => boolean = () => {
    return true
  }
): T[] {
  const modules = []
  const files = fs.readdirSync(dir)
  for (const fileName of files) {
    const filePath = dir + '/' + fileName
    if (fs.statSync(filePath).isDirectory()) {
      modules.push(...requireAll<T>(filePath, filter))
    } else {
      if (filter(fileName)) {
        modules.push(require(filePath))
      }
    }
  }
  return modules
}
export function getGraphqlsFromFile(dir: string): DocumentNode
export function getGraphqlsFromFile(
  dir: string,
  filter: (fileName: string) => boolean
): DocumentNode
export function getGraphqlsFromFile(
  dir: string,
  filter: (fileName: string) => boolean = () => {
    return true
  }
): DocumentNode {
  const results = requireAll<DocumentNode>(dir, (fileName: string) => {
    const splitedFileName = fileName.split('.')
    if (
      splitedFileName[splitedFileName.length - 1] === 'graphql' &&
      filter(fileName)
    ) {
      return true
    }
    return false
  })
  return mergeTypeDefs(results)
}

export function getResolversFromFile(dir: string): IResolvers[]
export function getResolversFromFile(
  dir: string,
  filter: (fileName: string) => boolean
): IResolvers[]
export function getResolversFromFile(
  dir: string,
  filter: (fileName: string) => boolean = () => {
    return true
  }
): IResolvers[] {
  const resolversBeforePreProcessing = requireAll<IResolvers>(
    dir,
    (fileName: string) => {
      const splitedFileName = fileName.split('.')
      if (
        splitedFileName[splitedFileName.length - 2] === 'resolvers' &&
        filter(fileName)
      ) {
        return true
      }
      return false
    }
  )
  const resolvers: IResolvers[] = []
  for (const resolver of resolversBeforePreProcessing) {
    resolvers.push(resolver.default as IResolvers)
  }
  return resolvers
}
