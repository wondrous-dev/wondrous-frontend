import { useQuery } from "@apollo/client"
import { WHOAMI, GET_LOGGED_IN_USER } from "../graphql/queries"
import apollo from "../services/apollo"
import { getAuthHeader, storeAuthHeader } from "../components/withAuth"

export const useSessionStoreManager = () => {
  const { data } = useQuery(WHOAMI, {
    fetchPolicy: "cache-only",
    onCompleted: async (data) => {
      const token = await getAuthHeader()
      if (token) {
        const user = data?.users?.[0]
        if (!user) {
          console.log("not logged user in cache. loading...")
          const userResponse = await apollo.query({
            query: GET_LOGGED_IN_USER,
          })
          if (userResponse?.data?.getLoggedinUser) {
            await storeAuthHeader(token, userResponse?.data?.getLoggedinUser)
          }
        }
      }
    },
    onError: async error => {
      console.log("Error while loading user from cache. " + error)
    }
  })

  console.log("datadata = " + data)
}