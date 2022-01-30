import SafeServiceClient, { OwnerResponse } from '@gnosis.pm/safe-service-client'

export const useWonderSafe = () => {

    /**
     * Connects to the Safe
     * 
     * @param safeAddress safe address 
     * @param ownerAddress owner address (the current wallet holder)
     * @returns boolean if the safe exists and safeAddress is owner of the safe
     */
    const onConnect = async (safeAddress, ownerAddress) => {
        const safeService = new SafeServiceClient('https://safe-transaction.gnosis.io')
        const safes: OwnerResponse = await safeService.getSafesByOwner(ownerAddress)
        
        console.log(safes)

        return true;
    }


    /**
     * Constructs the transaction code to be sent to the Gnosis Safe.
     * 
     * @param recipientAddress to whom send this amount
     * @param value amount of ETH in gwei
     * @param originText text attached to the transaction
     * @returns transactionCode to be sent to the backend
     */
    const createTransaction = async (recipientAddress, value, originText) => {
        const transactionCode = {}
        return transactionCode
    }
}

