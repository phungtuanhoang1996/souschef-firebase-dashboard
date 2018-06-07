import { routerActions } from 'react-router-redux'

// Stores the authentication token delivered by Firebase Auth
export function login(currentUser, currentUserUid) {
    return {
        type: 'ACCT_LOGIN',
        isLoggedIn: true,
        currentUser: currentUser,
        currentUserUid: currentUserUid,
    }
}

export function logout() {
    return {
        type: 'ACCT_LOGOUT',
        isLoggedIn: false,
	    currentUser: null,
	    currentUserUid: null,
	    currentBrandId: null,
	    currentBrandName: null
    }
}

export const setCurrentBrandId = (brandId) => {
	return {
		type: 'SET_BRAND_ID',
		currentBrandId: brandId
	}
}

export const setOngoingCodes = (ongoingCodes) => {
	return {
		type: 'SET_ONGOING_CODES',
		ongoingCodes: ongoingCodes
	}
}

export const setOffgoingCodes = (offgoingCodes) => {
	return {
		type: 'SET_OFFGOING_CODES',
		offgoingCodes: offgoingCodes
	}
}