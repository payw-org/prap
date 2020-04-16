import mongoose from 'mongoose'
import { requireAll } from 'get-graphql-data-from-files'
import { composeWithMongooseDiscriminators } from 'graphql-compose-mongoose'
import { generateMutation, generateQuery } from '@/model'
import { ObjectTypeComposer } from 'graphql-compose'
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
      description: 'Character type Droid or Person',
    },
  },
  {
    timestamps: true,
  }
)

BaseObjectSchema.set('discriminatorKey', 'type')
const BaseObjectModel = mongoose.model(type, BaseObjectSchema)

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
  const objectMutation = generateMutation(objectModel.type, objectTC)
  objectsMutation = {
    ...objectsMutation,
    ...objectMutation,
  }
}

const query = {
  ...generateQuery(type, BaseObjectDTC),
}

const mutation = {
  ...objectsMutation,
}

export default { query, mutation }