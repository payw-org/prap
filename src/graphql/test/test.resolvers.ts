import { IResolvers } from 'graphql-tools'
const resolverMap: IResolvers = {
  Query: {
    Test: () => {
      return [
        { id: 3, name: 'test1' },
        { id: 4, name: 'test2' },
      ]
    },
  },
}
export default resolverMap
