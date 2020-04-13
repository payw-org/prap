import { importSchema } from 'graphql-import'
import require_all from 'require-all'
import { makeExecutableSchema } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

const typeDefs = importSchema('./**/*.graphql')
const controllers = require_all({
  dirname: 'src/graphql',
  filter: function (fileName) {
    const parts = fileName.split('.')
    if (parts[parts.length - 2] !== 'resolvers') return
    return fileName
  },
})
const modules = []
for (const folder in controllers) {
  for (const module in controllers[folder]) {
    modules.push(controllers[folder][module].default)
  }
}
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: modules,
})

export default schema
