import React, { useEffect, useState } from 'react'
import { ToggleViewWrapper, ToggleViewOption } from './styles'


// Toggler between views (i.e. grid vs list)
export const ToggleViewButton = ({ options }) => {
	
    
    const [active, setActive] = useState(0)
    
	const activateOption = (index) => {
        setActive(index)
    }

    useEffect(() => {
        // Set active based on input
        options.map((o, k) => { if(o.active) { setActive(k)} })
    }, [])

	return (
		<ToggleViewWrapper>
			{options.map((opt, key) => (
				<ToggleViewOption
					key={'toggle-option-' + opt.name}
					className={key == active ? 'active' : ''}
					onClick={() => {
						activateOption(key)
                        opt.action()
					}}
				>
					{opt.name}
				</ToggleViewOption>
			))}
		</ToggleViewWrapper>
	)
}
