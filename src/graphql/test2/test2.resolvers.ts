import { Test2, QueryTest2Args, QueryResolvers } from '@/graphql/types'

const resolverMap = {
  Query: {
    Test2: (root, args: QueryTest2Args) => {
      return { id: 2, name: 'aaaaaa' } as Test2
    },
  } as QueryResolvers,
}
export default resolverMap
