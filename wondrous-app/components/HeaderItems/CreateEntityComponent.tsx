import { CreateLayoutTaskIcon, CreateLayoutMilestoneIcon, CreateLayoutPodsIcon, CreateLayoutDaoIcon, CreateLayoutBountyIcon, CreateLayoutProposalIcon, CreateLayoutGrantIcon } from "components/CreateEntity/styles"
import { ENTITIES_TYPES } from "utils/constants"
import { useBoards } from "utils/hooks"

const BOARD_ITEMS_CONFIG = {
    label: 'Board item',
    items: {
        [ENTITIES_TYPES.TASK]: {
            icon: CreateLayoutTaskIcon,
            label: 'Task',
          },
          [ENTITIES_TYPES.MILESTONE]: {
            icon: CreateLayoutMilestoneIcon,
            label: 'Milestone',
          },
          [ENTITIES_TYPES.POD]: {
            icon: CreateLayoutPodsIcon,
            label: 'Pod',
          },
          [ENTITIES_TYPES.ORG]: {
            icon: CreateLayoutDaoIcon,
            label: 'Organization',
          },
          [ENTITIES_TYPES.BOUNTY]: {
            icon: CreateLayoutBountyIcon,
            label: 'Bounty',
          },
          [ENTITIES_TYPES.PROPOSAL]: {
            icon: CreateLayoutProposalIcon,
            label: 'Proposal',
          },
          [ENTITIES_TYPES.GRANT]: {
            icon: CreateLayoutGrantIcon,
            label: 'Grant',
          },        
    }
}

const SPACE_ITEMS_CONFIG = {
    label: 'Space',
    items: []
}

const CreateEntityComponent = () => {
    const board = useBoards()
    console.log(board)
    return <div>Create</div>
}


export default CreateEntityComponent