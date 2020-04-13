export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Query = {
  __typename?: 'Query'
  Test: Array<Test>
  Test2?: Maybe<Test2>
}

export type QueryTest2Args = {
  id: Scalars['Int']
}

export type Test = {
  __typename?: 'Test'
  id: Scalars['Int']
  name: Scalars['String']
}

export type Test2 = {
  __typename?: 'Test2'
  id: Scalars['Int']
  name: Scalars['String']
}
