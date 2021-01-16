import { capitalizeFirstLetter } from '../../utils/common'

export const PRIVACY_LEVELS = ['public', 'private', 'collaborators']

export const privacyDropdown = PRIVACY_LEVELS.map(privacy => ({
  'label': capitalizeFirstLetter(privacy),
  'value': privacy
}))
