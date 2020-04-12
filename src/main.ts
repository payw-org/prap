import express from 'express'
import graphqlHTTP from 'express-graphql'
import schema from '@/graphql'
const app = express()
app.use(
  '/graphql',
  graphqlHTTP(async (request) => {
    return {
      schema: schema,
      graphiql: true, // GraphQL 쿼리를 테스트할 수 있는 Dev Tool입니다.
    }
  })
)

app.listen(4000, () => console.log('start'))
