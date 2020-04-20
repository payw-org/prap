const { ApolloServer } = require('apollo-server')
import schema from '@/graphql'
import Config from '@/config'
import modelSchema from '@/model'
import mongoose from 'mongoose'
let playground = false
let introspection = false
let port = Config.PORT
let dbName = Config.DB_NAME
if (process.env.NODE_ENV === 'development') {
  console.log('development mode')
  process.env.NODE_ENV = 'development'
  playground = true
  introspection = true
  port = Config.DEV_PORT
  dbName = Config.DB_NAME_DEV
}
const server = new ApolloServer({
  schema: modelSchema,
  playground,
  introspection,
  context: ({ req }: any) => {
    if (!req.headers.accesstoken) return { authority: undefined }
    //check user with token
    return {
      authority: {
        userId: 1,
        isAdmin: 2,
      },
    }
  },
})

const db = mongoose.connection
db.on('error', console.error)
db.once('open', function () {
  server
    .listen({
      port,
    })
    .then(() => {
      console.log(`🚀 Server ready at ${port}`)
    })

  console.log('Connected to mongod server')
})
mongoose.connect(
  'mongodb://' +
    Config.DB_USER +
    ':' +
    Config.DB_PASSWORD +
    '@' +
    Config.DB_HOST +
    ':' +
    Config.DB_PORT +
    '/' +
    dbName,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
