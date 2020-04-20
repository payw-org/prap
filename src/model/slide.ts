import mongoose from 'mongoose'
import { requireAll } from 'get-graphql-data-from-files'

const objectModules = requireAll<{ type: string; schema: mongoose.Schema }>(
  'src/model/object'
)
const objectSchemas: mongoose.SchemaDefinition = {}
for (const objectModule of objectModules) {
  objectSchemas[objectModule.type.toLowerCase() + 's'] = [objectModule.schema]
}
export const type = 'Slide'
export const SlideSchema = new mongoose.Schema(
  {
    name: String,
    ...objectSchemas,
  },
  {
    timestamps: true,
  }
)
