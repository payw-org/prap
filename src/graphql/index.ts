import { importSchema } from 'graphql-import'
import { makeExecutableSchema, IResolvers } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'
import requireAll from '@/modules/require-all'

const typeDefs = importSchema('./**/*.graphql')
const resolvers = requireAll<IResolvers>(
  process.env.NODE_ENV === 'development'
    ? 'src/graphql'
    : require('app-root-path') + '/build/graphql',
  (fileName: string) => {
    const splitedFileName = fileName.split('.')
    if (splitedFileName[splitedFileName.length - 2] === 'resolvers') {
      return true
    }
    return false
  }
)

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default schema
