import React from 'react'
import { useRouter } from 'next/router'
import { useMutation, useLazyQuery } from '@apollo/client'

import { InviteWelcomeBox } from '../../../components/Onboarding/build-profile'
import { MainWrapper } from '../../../components/Onboarding/styles'
import { UPDATE_USER } from '../../../graphql/mutations'
import { GET_PRESIGNED_IMAGE_URL } from '../../../graphql/queries/media'
import { withAuth } from '../../../components/Auth/withAuth'

const ContributorBuildProfilePage = () => {
  const router = useRouter()
  const [updateImage] = useLazyQuery(GET_PRESIGNED_IMAGE_URL)
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      router.push('/onboarding/email-setup')
    },
  })
  return (
    <MainWrapper>
      <InviteWelcomeBox updateUser={updateUser} />
    </MainWrapper>
  )
}

export default withAuth(ContributorBuildProfilePage)
