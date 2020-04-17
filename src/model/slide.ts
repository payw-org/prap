import mongoose, { Schema } from 'mongoose'
import composeWithMongoose from 'graphql-compose-mongoose'
import { BaseObjectDTC } from './object'
import { generateMutation, generateQuery } from '.'
import { Project } from './project'

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
    const slide = await Project.update(
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
    console.log(payload.recordIds)
    const slide = await Project.update(
      { _id: rp.args.proejctId },
      { $push: { slideIds: { $each: payload.recordIds } } }
    )
    return payload
  }
)
export default { query, mutation }
