import mongoose, { Schema } from 'mongoose'
import { requireAll } from 'get-graphql-data-from-files'
import { composeWithMongooseDiscriminators } from 'graphql-compose-mongoose'
import { generateMutation, generateQuery } from '@/model'
import { ObjectTypeComposer, schemaComposer } from 'graphql-compose'
import { Slide } from './slide'

const enumObjectType: string[] = []

const objectModules = requireAll<{ type: string; schema: mongoose.Schema }>(
  'src/model/object',
  {
    beforeGet: (file: any) => {
      enumObjectType.push(file.type)
      return file
    },
  }
)
export const type = 'BaseObject'
const BaseObjectSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
      enum: enumObjectType,
    },
  },
  {
    timestamps: true,
  }
)

BaseObjectSchema.set('discriminatorKey', 'type')

export const BaseObjectModel = mongoose.model('Object', BaseObjectSchema)

const objectModels: {
  type: string
  model: mongoose.Model<mongoose.Document, {}>
}[] = []

objectModules.forEach((objectModule) => {
  objectModels.push({
    type: objectModule.type,
    model: BaseObjectModel.discriminator(
      objectModule.type,
      objectModule.schema
    ),
  })
})

export const BaseObjectDTC = composeWithMongooseDiscriminators(BaseObjectModel)

export const objectDatas: {
  type: string
  objectTypeComposer: ObjectTypeComposer
}[] = []

let objectsMutation: any = {}

for (const objectModel of objectModels) {
  const objectTC = BaseObjectDTC.discriminator(objectModel.model)

  objectDatas.push({
    type: objectModel.type,
    objectTypeComposer: objectTC,
  })

  objectsMutation = {
    ...objectsMutation,
    ...generateMutation(objectModel.type, objectTC),
  }
  const createOneResolver = objectTC.getResolver('createOne').addArgs({
    slidId: { type: 'MongoID!', required: true },
  })
  objectsMutation[
    objectModel.type.toLowerCase() + 'CreateOne'
  ] = createOneResolver.wrapResolve((next) => async (rp) => {
    const payload = await next(rp)
    const slide = await Slide.update(
      { _id: rp.args.slidId },
      { $push: { objectIds: payload.record._id } }
    )
    return payload
  })
  const createManyResolver = objectTC.getResolver('createMany').addArgs({
    slidId: { type: 'MongoID!', required: true },
  })
  objectsMutation[
    objectModel.type.toLowerCase() + 'CreateMany'
  ] = createManyResolver.wrapResolve((next) => async (rp) => {
    const payload = await next(rp)
    const slide = await Slide.update(
      { _id: rp.args.slidId },
      { $push: { objectIds: { $each: payload.recordIds } } }
    )
    return payload
  })

  const removeOneResolver = objectTC.getResolver('removeOne').addArgs({
    slidId: { type: 'MongoID!', required: true },
  })
  objectsMutation[
    objectModel.type.toLowerCase() + 'RemoveOne'
  ] = removeOneResolver.wrapResolve((next) => async (rp) => {
    const payload = await next(rp)
    const slide = await Slide.update(
      { _id: rp.args.slidId },
      { $pull: { objectIds: payload.record._id } }
    )
    return payload
  })
}

const removeByIdResolver = BaseObjectDTC.getResolver('removeById').addArgs({
  slidId: { type: 'MongoID!', required: true },
})
objectsMutation[
  type.toLowerCase() + 'RemoveById'
] = removeByIdResolver.wrapResolve((next) => async (rp) => {
  const payload = await next(rp)
  const slide = await Slide.update(
    { _id: rp.args.slidId },
    { $pull: { objectIds: payload.recordId } }
  )
  return payload
})
const removeByIdsResolver = BaseObjectDTC.getResolver('removeMany')
  .removeArg('filter')
  .addArgs({
    slidId: { type: 'MongoID!', required: true },
    _ids: { type: '[MongoID!]', required: true },
  })
  .setType(
    schemaComposer.createObjectTC({
      name: 'RemoveByIdsObjectPayload',
      fields: {
        objectIds: '[MongoID]',
        objects: [BaseObjectDTC],
      },
    })
  )

objectsMutation[
  type.toLowerCase() + 'RemoveByIds'
] = removeByIdsResolver.wrapResolve(
  (next) => async (rp) => {
    const resultOfFindObjects = await BaseObjectModel.find({
      '_id': {
        $in: rp.args._ids,
      },
    })
    const resultOfRemoveObjects = await BaseObjectModel.remove({
      '_id': {
        $in: rp.args._ids,
      },
    })
    const slide = await Slide.update(
      { _id: rp.args.slidId },
      { $pull: { objectIds: { $in: rp.args._ids } } }
    )
    return {
      objectIds: rp.args._ids,
      objects: resultOfFindObjects,
    }
  },
  'removeByIds'
)
const query = {
  ...generateQuery(type, BaseObjectDTC),
}

const mutation = {
  ...objectsMutation,
}

export default { query, mutation }
