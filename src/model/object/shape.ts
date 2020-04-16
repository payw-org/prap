import mongoose from 'mongoose'

const enumShape = {
  TRAIANGLE: 'Triangle',
  RECTANGLE: 'Rectangle',
}
const colorValidator = (v: string) => /^#([0-9a-f]{3}){1,2}$/i.test(v)

export const type = 'Shape'
export const schema = new mongoose.Schema({
  shape: {
    type: String,
    enum: Object.values(enumShape),
    required: true,
  },
})
