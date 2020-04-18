import mongoose, { Schema } from 'mongoose'
import { SlideTC, Slide } from './slide'
import { composeWithMongoose } from 'graphql-compose-mongoose'
import { generateQuery, generateMutation } from '.'
import { BaseObjectModel, BaseObjectDTC } from './object'
import { schemaComposer } from 'graphql-compose'

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

const removeByIdResolver = ProjectTC.getResolver('removeById')
mutation[type.toLowerCase() + 'RemoveById'] = removeByIdResolver.wrapResolve(
  (next) => async (rp) => {
    const payload = await next(rp)
    const resultOfFindSlides = await Slide.find({
      '_id': {
        $in: payload.record.slideIds,
      },
    })
    const mergedObjectIds = []
    for (const result of resultOfFindSlides) {
      mergedObjectIds.push(...(result as any).objectIds)
    }
    const resultOfRemoveObject = await BaseObjectModel.remove({
      _id: { $in: mergedObjectIds },
    })
    const resultOfRemoveSlides = await Slide.remove({
      _id: { $in: payload.record.slideIds },
    })

    return payload
  }
)
const removeByIdsResolver = ProjectTC.getResolver('removeMany')
  .removeArg('filter')
  .addArgs({
    _ids: { type: '[MongoID!]', required: true },
  })
  .setType(
    schemaComposer.createObjectTC({
      name: 'RemoveByIdsProjectPayload',
      fields: {
        objectIds: '[MongoID]',
        slideIds: '[MongoID]',
        projectIds: '[MongoID]',
        objects: [BaseObjectDTC],
        slides: [SlideTC],
        projects: [ProjectTC],
      },
    })
  )

mutation[type.toLowerCase() + 'RemoveByIds'] = removeByIdsResolver.wrapResolve(
  (next) => async (rp) => {
    const resultOfFindProjects = await Project.find({
      '_id': {
        $in: rp.args._ids,
      },
    })
    const mergedSlideIds = []
    for (const result of resultOfFindProjects) {
      mergedSlideIds.push(...(result as any).slideIds)
    }
    const resultOfFindSlides = await Slide.find({
      '_id': {
        $in: mergedSlideIds,
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

    const resultOfRemoveObjects = await BaseObjectModel.remove({
      _id: { $in: mergedObjectIds },
    })
    const resultOfRemoveSlides = await Slide.remove({
      _id: { $in: mergedSlideIds },
    })
    const resultOfRemoveProjects = await Project.remove({
      _id: { $in: rp.args._ids },
    })
    return {
      objectIds: mergedObjectIds,
      slideIds: mergedSlideIds,
      projectIds: rp.args._ids,
      objects: resultOfFindObjects,
      slides: resultOfFindSlides,
      projects: resultOfFindProjects,
    }
  },
  'removeByIds'
)
export default { query, mutation }
