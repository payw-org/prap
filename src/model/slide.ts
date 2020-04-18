import mongoose, { Schema } from 'mongoose'
import composeWithMongoose from 'graphql-compose-mongoose'
import { BaseObjectDTC, BaseObjectModel } from './object'
import { generateMutation, generateQuery } from '.'
import { Project } from './project'
import { schemaComposer } from 'graphql-compose'

export const type = 'Slide'
const SlideSchema = new mongoose.Schema(
  {
    name: String,
    objectIds: {
      type: [Schema.Types.ObjectId],
    },
  },
  {
    timestamps: true,
  }
)
export const Slide = mongoose.model(type, SlideSchema)
export const SlideTC = composeWithMongoose(Slide)

SlideTC.addRelation('objects', {
  resolver: () => BaseObjectDTC.getResolver('findByIds'),
  prepareArgs: { _ids: (source: { objectIds: any[] }) => source.objectIds },
  projection: { objectIds: 1 },
})
interface AddObjectArgs {
  args: {
    _id: string
    objectIds: string
  }
}
SlideTC.addResolver({
  name: 'addObject',
  type: SlideTC,
  args: { _id: 'MongoID!', objectIds: 'MongoID!' },
  resolve: async (arg: AddObjectArgs) => {
    const args = arg.args
    const slide = await Slide.update(
      { _id: args._id },
      { $push: { objectIds: args.objectIds } }
    )
    if (!slide) return null // or gracefully return an error etc...
    return Slide.findOne({ _id: args._id }) // return the record
  },
})

const query = {
  ...generateQuery(type, SlideTC),
}

const mutation = {
  ...generateMutation(type, SlideTC),
  addObject: SlideTC.getResolver('addObject'),
}
const createOneResolver = SlideTC.getResolver('createOne').addArgs({
  proejctId: { type: 'MongoID!', required: true },
})
mutation[type.toLowerCase() + 'CreateOne'] = createOneResolver.wrapResolve(
  (next) => async (rp) => {
    const payload = await next(rp)
    const project = await Project.update(
      { _id: rp.args.proejctId },
      { $push: { slideIds: payload.record._id } }
    )
    return payload
  }
)
const createManyResolver = SlideTC.getResolver('createMany').addArgs({
  proejctId: { type: 'MongoID!', required: true },
})
mutation[type.toLowerCase() + 'CreateMany'] = createManyResolver.wrapResolve(
  (next) => async (rp) => {
    const payload = await next(rp)
    const project = await Project.update(
      { _id: rp.args.proejctId },
      { $push: { slideIds: { $each: payload.recordIds } } }
    )
    return payload
  }
)
const removeByIdResolver = SlideTC.getResolver('removeById').addArgs({
  proejctId: { type: 'MongoID!', required: true },
})
mutation[type.toLowerCase() + 'RemoveById'] = removeByIdResolver.wrapResolve(
  (next) => async (rp) => {
    const payload = await next(rp)
    const resultOfRemoveObject = await BaseObjectModel.remove({
      _id: { $in: payload.record.objectIds },
    })
    const resultOfUpdateProject = await Project.update(
      { _id: rp.args.proejctId },
      { $pull: { slideIds: payload.record._id } }
    )
    return payload
  }
)
const removeByIdsResolver = SlideTC.getResolver('removeMany')
  .removeArg('filter')
  .addArgs({
    proejctId: { type: 'MongoID!', required: true },
    _ids: { type: '[MongoID!]', required: true },
  })
  .setType(
    schemaComposer.createObjectTC({
      name: 'RemoveByIdsSlidePayload',
      fields: {
        objectIds: '[MongoID]',
        slideIds: '[MongoID]',
        objects: [BaseObjectDTC],
        slides: [SlideTC],
      },
    })
  )

mutation[type.toLowerCase() + 'RemoveByIds'] = removeByIdsResolver.wrapResolve(
  (next) => async (rp) => {
    const resultOfFindSlides = await Slide.find({
      '_id': {
        $in: rp.args._ids,
      },
    })
    const mergedObjectIds = []
    for (const result of resultOfFindSlides) {
      mergedObjectIds.push(...(result as any).objectIds)
    }
    const resultOfFindObjects = await BaseObjectModel.find({
      '_id': {
        $in: mergedObjectIds,
      },
    })
    const resultOfRemoveSlide = await Slide.remove({
      _id: { $in: rp.args._ids },
    })
    const resultOfRemoveObject = await BaseObjectModel.remove({
      _id: { $in: mergedObjectIds },
    })
    const resultOfUpdateProject = await Project.update(
      { _id: rp.args.proejctId },
      { $pull: { slideIds: { $in: rp.args._ids } } }
    )
    return {
      objectIds: mergedObjectIds,
      slideIds: rp.args._ids,
      objects: resultOfFindObjects,
      slides: resultOfFindSlides,
    }
  },
  'removeByIds'
)
export default { query, mutation }
