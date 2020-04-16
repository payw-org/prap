import mongoose from 'mongoose'

const colorValidator = (v: string) => /^#([0-9a-f]{3}){1,2}$/i.test(v)

export const type = 'Textbox'
export const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    font_size: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
      validator: [colorValidator, 'Invalid color'],
    },
    background_color: {
      type: String,
      required: true,
      validator: [colorValidator, 'Invalid color'],
    },
  },
  {
    timestamps: true,
  }
)
