export type SlideObject = {
  type: string
  pos: {
    x: number
    y: number
  }
}

export type SlideTextObject = SlideObject & {
  content: string
  align: string
  family: string
  size: string
  weight: string
  color: string
}

export type Slide = {
  objects: SlideTextObject[]
}

export type Slides = Slide[]

export type File = {
  slides: Slides
}
