import { useContext } from 'react'

import { IsMobileContext } from './contexts'

export const useIsMobile = () => useContext(IsMobileContext)
