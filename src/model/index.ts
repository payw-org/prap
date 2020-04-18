import { schemaComposer, ObjectTypeComposer } from 'graphql-compose'

export function generateQuery(type: string, tc: ObjectTypeComposer): any {
  type = type.toLowerCase()
  const query: any = {}
  query[type + 'FindById'] = tc.getResolver('findById')
  query[type + 'FindByIds'] = tc.getResolver('findByIds')
  query[type + 'FindOne'] = tc.getResolver('findOne')
  query[type + 'FindMany'] = tc.getResolver('findMany')
  query[type + 'Count'] = tc.getResolver('count')
  query[type + 'Connection'] = tc.getResolver('connection')
  query[type + 'Pagination'] = tc.getResolver('pagination')
  return query
}
export function generateMutation(type: string, tc: ObjectTypeComposer): any {
  type = type.toLowerCase()
  const mutation: any = {}
  mutation[type + 'CreateOne'] = tc.getResolver('createOne')
  mutation[type + 'CreateMany'] = tc.getResolver('createMany')
  mutation[type + 'UpdateById'] = tc.getResolver('updateById')
  mutation[type + 'UpdateOne'] = tc.getResolver('updateOne')
  mutation[type + 'UpdateMany'] = tc.getResolver('updateMany')
  mutation[type + 'RemoveById'] = tc.getResolver('removeById')
  mutation[type + 'RemoveOne'] = tc.getResolver('removeOne')
  mutation[type + 'RemoveMany'] = tc.getResolver('removeMany')
  return mutation
}

import projectDatas from './project'
schemaComposer.Query.addFields({
  ...projectDatas.query,
})

schemaComposer.Mutation.addFields({
  ...projectDatas.mutation,
})
export default schemaComposer.buildSchema()
