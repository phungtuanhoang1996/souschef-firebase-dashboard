import logger from '../Utils/logger'

// Stores the authentication token delivered by Firebase Auth
export function login(currentUser, currentUserUid) {
	//logger('A login action is created')

    return {
        type: 'ACCT_LOGIN',
        currentUser: currentUser,
        currentUserUid: currentUserUid,
    }
}

export function logout() {
	//logger('A logout action is created')

    return {
        type: 'ACCT_LOGOUT'
    }
}

export const setCurrentBrandId = (brandId) => {
	//logger('A set current brand id action is created')

	return {
		type: 'SET_BRAND_ID',
		currentBrandId: brandId
	}
}

export const setOngoingCodes = (ongoingCodes) => {
	//logger('A set ongoing codes action is created')

	return {
		type: 'SET_ONGOING_CODES',
		ongoingCodes: ongoingCodes
	}
}

export const setOffgoingCodes = (offgoingCodes) => {
	//logger('A set offgoing codes action is created')

	return {
		type: 'SET_OFFGOING_CODES',
		offgoingCodes: offgoingCodes
	}
}

export const updateMachinesData = (machineId, machineData) => {
	//logger('An update machine data action is created')

	return {
		type: 'UPDATE_MACHINES_DATA',
		machineId: machineId,
		machineData: machineData
	}
}

export const setCurrentBrandName = (brandName) => {
	//logger('A set current brand name action is created')

	return {
		type: 'SET_CURRENT_BRAND_NAME',
		currentBrandName: brandName
	}
}