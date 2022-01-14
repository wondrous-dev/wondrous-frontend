import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useLazyQuery, useQuery } from '@apollo/client'

import { InviteWelcomeBox } from '../../../components/Onboarding/email-setup'
import { MainWrapper } from '../../../components/Onboarding/styles'
import { UPDATE_USER } from '../../../graphql/mutations'
import { withAuth } from '../../../components/Auth/withAuth'
import { GET_USER_ORGS } from '../../../graphql/queries/org'

const ContributorBuildProfilePage = () => {
  const router = useRouter()
  const { data: getOrgData } = useQuery(GET_USER_ORGS)
  const [redirect, setRedirect] = useState(false)
  let firstOrg = null
  const orgs = getOrgData?.getUserOrgs

  if (orgs?.length > 0) {
    firstOrg = orgs[0]
  }
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: async () => {
      // Find org associated with user
      setRedirect(true)
    },
  })

  useEffect(() => {
    if (redirect) {
      router.push(`/organization/${firstOrg?.username}/boards`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirect])
  return (
    <MainWrapper>
      <InviteWelcomeBox updateUser={updateUser} />
    </MainWrapper>
  )
}

export default withAuth(ContributorBuildProfilePage)
