import { IResolvers } from 'graphql-tools'
import { Test2, QueryTest2Args } from '@/graphql/types'

const resolverMap: IResolvers = {
  Query: {
    Test2: (_: void, args: QueryTest2Args) => {
      return { id: 2, name: 'aaaaaa' } as Test2
    },
  },
}
export default resolverMap
