import { File, SlideTextObject } from 'types'

const file: File = {
  slides: [
    {
      objects: [
        {
          type: 'text',
          content: 'Hello World',
          align: 'center',
          pos: {
            x: 50,
            y: 50
          }
        } as SlideTextObject
      ]
    },
    {
      objects: [
        {
          type: 'text',
          content: 'Hello World',
          align: 'center',
          pos: {
            x: 50,
            y: 50
          }
        } as SlideTextObject
      ]
    }
  ]
}

export default file
