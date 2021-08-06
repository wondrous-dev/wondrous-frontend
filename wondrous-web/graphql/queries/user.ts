import { gql } from '@apollo/client'
import { LoggedinUserFragment } from '../fragments/user'

export const WHOAMI = gql`
  query whoami {
    users {
      ...LoggedinUser
    }
  }
  ${LoggedinUserFragment}
`
