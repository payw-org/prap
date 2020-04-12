import { IResolvers } from 'graphql-tools'
const resolverMap: IResolvers = {
  Query: {
    Test2s: () => {
      return [
        { id: 1, name: 'aaa' },
        { id: 2, name: 'bbb' },
      ]
    },
    Test2: (_: void, args: any[]) => {
      return { id: 2, name: 'aaaaaa' }
    },
  },
}
export default resolverMap
