import mongoose, { Schema } from 'mongoose'
import { SlideTC } from './slide'
import { composeWithMongoose } from 'graphql-compose-mongoose'
import { generateQuery, generateMutation } from '.'

const type = 'Project'
const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    slideIds: [Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
)

export const Project = mongoose.model(type, ProjectSchema)

export const ProjectTC = composeWithMongoose(Project)

ProjectTC.addRelation('slides', {
  resolver: () => SlideTC.getResolver('findByIds'),
  prepareArgs: { _ids: (source: { slideIds: any[] }) => source.slideIds },
  projection: { slideIds: 1 },
})
interface AddObjectArgs {
  args: {
    _id: string
    slideIds: string
  }
}
ProjectTC.addResolver({
  name: 'addSlide',
  type: ProjectTC,
  args: { _id: 'MongoID!', slideIds: 'MongoID!' },
  resolve: async (arg: AddObjectArgs) => {
    const args = arg.args
    const slide = await Project.update(
      { _id: args._id },
      { $push: { slideIds: args.slideIds } }
    )
    if (!slide) return null // or gracefully return an error etc...
    return Project.findOne({ _id: args._id }) // return the record
  },
})
const query = {
  ...generateQuery(type, ProjectTC),
}

const mutation = {
  ...generateMutation(type, ProjectTC),
  addSlide: ProjectTC.getResolver('addSlide'),
}

export default { query, mutation }
