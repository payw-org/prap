const { ApolloServer } = require('apollo-server')
import schema from '@/graphql'
import Config from '@/config'

let playground = false
let introspection = false
let port = Config.PORT

if (process.env.NODE_ENV === 'development') {
  console.log('development mode')
  process.env.NODE_ENV = 'development'
  playground = true
  introspection = true
  port = Config.DEV_PORT
}

const server = new ApolloServer({
  schema,
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

server
  .listen({
    port,
  })
  .then(() => {
    console.log(`🚀 Server ready at ${port}`)
  })
