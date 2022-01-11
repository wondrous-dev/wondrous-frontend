import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
    Black70,
	Black80,
	Black95,
	Black97,
	Black98,
	Blue20,
	Grey250,
	Grey57,
	Grey65,
	Grey75,
	HighlightBlue,
	HighlightPurple,
    White,
} from '../../../theme/colors'
import { Done, InProgress, InReview, ToDo } from '../../Icons'
import FilterIcon from '../../Icons/filter'
import { Chevron } from '../../Icons/sections'
import Tabs from '../Tabs'

export const FilterHandle = styled.div`
	display: flex;
	position: relative;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	min-width: 323px;
	height: 40px;
	padding: 1px;

	margin: 0 23px;

	${(props) =>
		props.open
			? `background: ${Grey75};`
			: `background: linear-gradient(180deg, ${Black80} 0%, ${Black95} 70%);`}

	border-top-left-radius: 3px;
	border-top-right-radius: 3px;
`

export const FilterHandleInner = styled.div`
	display: flex;
	flex: 1 0 0;

	flex-direction: row;
	align-items: center;
	justify-content: flex-start;

	width: 321px;
	height: 38px;
	padding: 15px;

	border-top-left-radius: 3px;
	border-top-right-radius: 3px;

	cursor: pointer;

	${(props) =>
		props.open
			? `background: linear-gradient(272.34deg, ${Black95} 4.36%, ${Black97} 42.75%);`
			: `background: linear-gradient(270.93deg,  ${Black95} 3.85%, ${Black97} 101.76%);`}

	color: ${(props) => (props.open ? Grey75 : Grey250)};
	font-size: 14px;
`
export const FilterChevronContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-self: flext-end;

	transition: transform 0.2s;

	&.active {
		transform: rotate(180deg);
	}
`

export const FilterHandleContainer = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
`

export const FilterBox = styled.div`
    position: absolute;
    top: 40px;

    display: ${(props) => (props.open ? 'flex' : 'none')};
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    margin-top: 
    width: 323px;
    height: 400px;

    padding: 0px 1px 1px 1px;

    background: linear-gradient(270.93deg,  ${Black95} 3.85%, ${Black97} 101.76%);

    z-index: 100;
`

export const FilterBoxInner = styled.div`
    position: relative;

	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;

	padding: 15px;
	width: 321px;
	height: 400px;
	overflow: hidden;

	background: linear-gradient(270.93deg, ${Black95} 3.85%, ${Black97} 101.76%);
`

export const FilterStatus = styled.div`
    display: flex;
    flex-direction: row;
    align-elements: center;
    justify-content: space-evenly;

    width: 100%;
    height: 28px;
    line-height: 28px;

    height: 28px;
    margin: 15px 0 20px 0;
`

export const FilterCount = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    font-size: 13px;
    color: ${Grey57};

    padding-left: 10px;
`

export const FilterClear = styled(Button)`
    && {
        display: flex;
        background: ${Black70};
        color: ${White};
        border-radius: 4px;

        font-size: 13px;
    }
`

export const FilterItemsContainer = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 100%;
`

export const FilterItemList = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;

    width: 100%;
    max-height: 286px;

    overflow-y: auto;
    padding-right: 15px;

    scrollbar-color: ${HighlightPurple};
`

export const FilterItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    width: 100%;
    height: 35px;

    background: ${Black98};
    border-radius: 4px;
    margin: 4px 0;
    padding: 7px;

    cursor: pointer;

    ${props => props.selected
        ? `border: 1px solid ${HighlightBlue};`
        : `border: 1px solid transparent;`
    }
`

export const FilterItemIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    margin-right: 7px;
`

export const FilterItemName = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`

export const FilterItemCount = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    font-size: 14px;
    color: ${Grey65};

`

export const FilterItemListShade = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;

    display: flex;

    width: 290px;
    height: 55px;

    background: linear-gradient(0deg, ${Black97} 0%, rgba(20, 20, 20, 0) 80.07%);
`

/**
 *
 * @param filterSchema ( tabs: [{ name: String, multiChoice: boolean, items: [{ id: String, name: String }] }])
 * @param filter State where this component will store the filter options in the form of { group: { item: boolean }
 * @param setFilter State setter to propagate the filter additions
 * @returns
 */

const Filter = ({ filterSchema = [], filter, setFilter }) => {
	
    const [selected, setSelected] = useState(null)
    const [items, setItems] = useState([])
    const [multiChoice, setMultichoice] = useState(true)
    const [open, setOpen] = useState(false)

	const toggleOpen = () => {
		setOpen(!open)
	}

    // Changes the display list.
    const displayList = (tabName) => {
        filterSchema.map(tab => {
            if(tab.name == tabName) {
                setItems(tab.items)
                setMultichoice(tab.multiChoice)
            }
        })
        setSelected(tabName)
    }

    // adds / removes an item from the filter
    const toggleInFilter = (itemId) => {
        const newItems = [ ...items ]
        newItems.map(it => {
            if(!multiChoice) {
                it.selected = false
            }
            if(it.id === itemId) {
                it.selected = !it.selected
            }
        })
        setItems(newItems)
    }

    const setFilterList = async () => {
        await filterSchema.map(tab => {
            tab.label = tab.name
            tab.action = () => {console.log('Tab ' + tab.name + ' pressed.'); displayList(tab.name)}
        })
    }

    const clearItems = () => {
        const newItems = [ ...items ]
        newItems.map(it => {
            it.selected = false
        })
        setItems(newItems)
    }

    useEffect(() => {
        setFilterList()
        displayList(filterSchema[0].name)
    },[open])

    useEffect(() => {
        setFilterList()
    }, [selected])

	return (
		<FilterHandle open={open}>
			<FilterHandleInner open={open} onClick={toggleOpen}>
				<FilterHandleContainer>
					{open ? (
						`<Filter>`
					) : (
						<>
							<FilterIcon /> &nbsp; Filter
						</>
					)}
				</FilterHandleContainer>
				<FilterChevronContainer className={open ? 'active' : ''}>
					<Chevron />
				</FilterChevronContainer>
			</FilterHandleInner>
			<FilterBox open={open}>
				<FilterBoxInner>
					<Tabs tabs={filterSchema} selected={selected} />
                    <FilterStatus>
                        <FilterCount>
                            {items.filter(i => i.selected ).length} selected
                        </FilterCount>
                        <FilterClear onClick={clearItems}>Clear</FilterClear>
                    </FilterStatus>
                    <FilterItemsContainer>
                        <FilterItemList>
                            {items.map((item) => (
                                <FilterItem onClick={() => {toggleInFilter(item.id)}} selected={item.selected} key={item.id}>
                                    <FilterItemIcon>
                                        {item.icon}
                                    </FilterItemIcon>
                                    <FilterItemName>
                                        {item.name}
                                    </FilterItemName>
                                    <FilterItemCount>
                                        {item.count}
                                    </FilterItemCount>
                                </FilterItem>
                            ))}
                        </FilterItemList>
                        <FilterItemListShade />
                    </FilterItemsContainer>
				</FilterBoxInner>
			</FilterBox>
		</FilterHandle>
	)
}

export default Filter
