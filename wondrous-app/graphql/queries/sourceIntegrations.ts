import { gql } from '@apollo/client'

export const GET_GITHUB_ORGANIZATIONS = gql`
	query getGithubOrganizations($code: String!) {
		getUserGithubOrganizations(code: $code) {
			id
			name
		}
	}
`
