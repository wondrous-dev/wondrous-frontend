export enum ContractType {
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
        [ContractType.ERC20]: '0xa97EF76725D7A7B3066EA7b6c17C4DAbA469FDbF',
        [ContractType.ERC721]: '0xa97EF76725D7A7B3066EA7b6c17C4DAbA469FDbF',
        [ContractType.ERC1155]: '0xa97EF76725D7A7B3066EA7b6c17C4DAbA469FDbF',
    },
    5: {
        [ContractType.ERC20]: '0x83703892a562d5ec05b5f9453e8a57c8cffc99e6',
        [ContractType.ERC721]: '0x83703892a562d5ec05b5f9453e8a57c8cffc99e6',
        [ContractType.ERC1155]: '0x83703892a562d5ec05b5f9453e8a57c8cffc99e6',
    }
}

export function getMultisendAddress(type: ContractType, chainId: number) {
    switch (chainId) {
        case 1:
            return CHAIN_TO_MULTISEND_ADDRESS[1][type]
        case 4:
            return CHAIN_TO_MULTISEND_ADDRESS[4][type]
        case 137:
            return CHAIN_TO_MULTISEND_ADDRESS[137][type]
        case 5:
            return CHAIN_TO_MULTISEND_ADDRESS[5][type]
        default:
            return ''  
    }
}
