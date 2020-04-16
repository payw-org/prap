import mongoose, { Schema } from 'mongoose'
import composeWithMongoose from 'graphql-compose-mongoose'
import { BaseObjectDTC } from './object'
import { generateMutation, generateQuery } from '.'

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

export default { query, mutation }
