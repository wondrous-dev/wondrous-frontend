import { gql } from '@apollo/client'
import { PodFragment } from '../fragments/pod'

export const CREATE_POD = gql`
  mutation createPod($input: PodInput) {
    createPod(input: $input) {
      ...PodFragment
    }
  }
  ${PodFragment}
`
