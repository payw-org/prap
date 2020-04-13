import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from '@/graphql'
import Config from '@/config'

if (process.env.NODE_ENV === 'development') {
  console.log('development mode')
  process.env.NODE_ENV = 'development'
}

const app = express()
app.use(
  '/graphql',
  graphqlHTTP(async (request) => {
    return {
      schema: schema,
      graphiql: process.env.NODE_ENV === 'development' ? true : false,
    }
  })
)
const port =
  process.env.NODE_ENV === 'development' ? Config.DEV_PORT : Config.PORT
app.listen(4000, () => console.log(`listening on port ${port}`))
