import { importSchema } from 'graphql-import'
import user from './test2/test2.resolvers'
import test from './test/test.resolvers'

import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

const typeDefs = importSchema('./**/*.graphql')

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: [user, test],
})

export default schema
