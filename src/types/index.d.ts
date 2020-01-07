export type SlideObject = {
  type: 'text' | 'image' | 'shape'
  pos: {
    x: number
    y: number
  }
}

export type SlideTextObject = SlideObject & {
  content: string
  align: string
  family: string
  size: number
  weight: number
  color: string
  lineHeight: number
}

export type Slide = {
  objects: (SlideObject | SlideTextObject)[]
}

export type Slides = Slide[]

export type BlackoutFile = {
  slides: Slides
}
