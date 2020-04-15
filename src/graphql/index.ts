import {
  makeExecutableSchema,
  addSchemaLevelResolveFunction,
} from 'graphql-tools'
import {
  GraphQLSchema,
  GraphQLResolveInfo,
  GraphQLFieldResolver,
} from 'graphql'
import {
  getGraphqlsFromFile,
  getResolversFromFile,
} from 'get-graphql-data-from-files'

const path =
  process.env.NODE_ENV === 'development'
    ? 'src/graphql'
    : require('app-root-path') + '/build/graphql'

const typeDefs = getGraphqlsFromFile(path)
const resolvers = getResolversFromFile(path)

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const rootResolveFunction: GraphQLFieldResolver<undefined, object> = (
  parent,
  args,
  context,
  info: GraphQLResolveInfo
) => {
  // console.log(parent)
  // console.log(args)
  // console.log(context)
  // console.log(info)
}

addSchemaLevelResolveFunction(schema, rootResolveFunction)

export default schema
