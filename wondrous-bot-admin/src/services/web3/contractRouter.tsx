enum ContractType {
    ERC20 = 'ERC20',
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155',
}
const CHAIN_TO_MULTISEND_ADDRESS = {
    1: {
        [ContractType.ERC20]: '',
        [ContractType.ERC721]: '',
        [ContractType.ERC1155]: '',
    },
    4: {
        [ContractType.ERC20]: '',
        [ContractType.ERC721]: '',
        [ContractType.ERC1155]: '',
    },
    137: {
        [ContractType.ERC20]: '',
        [ContractType.ERC721]: '',
        [ContractType.ERC1155]: '',
    },
}
function getMultisendAddress(type: ContractType, chainId: number) {
    switch (chainId) {
        case 1:
            return CHAIN_TO_MULTISEND_ADDRESS[1][type]
        case 4:
            return CHAIN_TO_MULTISEND_ADDRESS[4][type]
        case 137:
            return CHAIN_TO_MULTISEND_ADDRESS[137][type]
        default:
            return ''  
    }
}

