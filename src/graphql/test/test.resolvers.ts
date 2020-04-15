import {
  Test,
  QueryResolvers,
  MutationResolvers,
  MutationAddTestArgs,
} from '@/graphql/types'

const data = [
  { id: 3, name: 'test1' },
  { id: 3, name: 'test1' },
]

const resolverMap = {
  Query: {
    Test: (root) => {
      return data
    },
  } as QueryResolvers,
  Mutation: {
    addTest: (root, args: MutationAddTestArgs) => {
      data.push(args)
      return args as Test
    },
  } as MutationResolvers,
}
export default resolverMap
