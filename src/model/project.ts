import mongoose from 'mongoose'
import { SlideSchema } from './slide'
import { composeWithMongoose } from 'graphql-compose-mongoose'
import { generateQuery, generateMutation } from '.'

const type = 'Project'
const ProjectSchema = new mongoose.Schema(
  {
    name: String,
    slides: [SlideSchema],
  },
  {
    timestamps: true,
  }
)

export const Project = mongoose.model(type, ProjectSchema)

export const ProjectTC = composeWithMongoose(Project)

const query = {
  ...generateQuery(type, ProjectTC),
}

const mutation = {
  ...generateMutation(type, ProjectTC),
}

export default { query, mutation }
