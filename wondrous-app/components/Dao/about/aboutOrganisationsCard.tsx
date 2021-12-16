import React from 'react';
import {
	OrganisationsCard,
	OrganisationsCardAuthor,
	OrganisationsCardAuthorAvatar,
	OrganisationsCardAuthorPosition,
	OrganisationsCardContent,
	OrganisationsCardHeader,
	OrganisationsCardHeaderButton,
	OrganisationsCardHeaderName, OrganisationsCardHeaderWonderIcon
} from './styles'
import RightArrowIcon from '../../Icons/rightArrow'

export const AboutOrganisationsCard = (props) => {

	const {
		icon,
		title,
		text,
		position,
		avatar,
	} = props;

	const logo = param => {
		switch (param) {
			case 'wonder':
				return <OrganisationsCardHeaderWonderIcon />
			// case: 'upClick':

		}
	}

	return (
		<OrganisationsCard>
			<OrganisationsCardHeader>

				{logo(icon)}

				<OrganisationsCardHeaderName>
					{title}
				</OrganisationsCardHeaderName>
				<OrganisationsCardHeaderButton>
					<RightArrowIcon />
				</OrganisationsCardHeaderButton>
			</OrganisationsCardHeader>
			<OrganisationsCardContent>
				{text}
			</OrganisationsCardContent>
			<OrganisationsCardAuthor>
				<OrganisationsCardAuthorAvatar src={avatar}/>
				<OrganisationsCardAuthorPosition>
					{position}
				</OrganisationsCardAuthorPosition>
			</OrganisationsCardAuthor>
		</OrganisationsCard>
	);
}