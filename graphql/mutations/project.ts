import { gql } from '@apollo/client'

import { PublicProjectFragment } from '../fragments/project'

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: ProjectUpdateInput, $firstTime: Boolean) {
    createProject(input: $input, firstTime: $firstTime) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`
export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID, $input: ProjectUpdateInput, $firstTime: Boolean) {
    updateProject(projectId: $projectId, input: $input, firstTime: $firstTime) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`

export const CREATE_PROJECT_TAGS = gql`
  mutation CreateProjectTags($projectId: ID, $input: ProjectTagsInput, $firstTime: Boolean) {
    createProjectTags(projectId: $projectId, input: $input, firstTime: $firstTime) {
      ...PublicProject
    }
  }
  ${PublicProjectFragment}
`