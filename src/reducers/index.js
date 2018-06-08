import logger from '../Utils/logger'

const defaultState = {
	authToken: "",
	isLoggedIn: false,
	currentUser: null,
	currentUserUid: null,
	currentBrandId: null,
	ongoingCodes: [],
	offgoingCodes: [],
	machinesData: {}
}

const rootReducer = (state, action) => {
	if (!state || state == null) return defaultState

	switch (action.type) {
		case 'ACCT_LOGIN': {
			logger('Store after reduce', {
				...state,
				isLoggedIn: true,
				currentUser: action.currentUser,
				currentUserUid: action.currentUserUid
			})

			return {
				...state,
				isLoggedIn: true,
				currentUser: action.currentUser,
				currentUserUid: action.currentUserUid
			}
		}

		case 'ACCT_LOGOUT': {
			return defaultState
		}

		case 'SET_BRAND_ID': {
			logger('Store after reduce', {
				...state,
				currentBrandId: action.currentBrandId
			})

			return {
				...state,
				currentBrandId: action.currentBrandId
			}
		}

		case 'SET_OFFGOING_CODES': {
			logger('Store after reduce', {
				...state,
				offgoingCodes: action.offgoingCodes
			})

			return {
				...state,
				offgoingCodes: action.offgoingCodes
			}
		}

		case 'SET_ONGOING_CODES': {
			logger('Store after reduce', {
				...state,
				ongoingCodes: action.ongoingCodes
			})

			return {
				...state,
				ongoingCodes: action.ongoingCodes
			}
		}

		case 'UPDATE_MACHINES_DATA': {
			let machineId = action.machineId
			let newState = Object.assign({}, state)

			let newMachinesData = Object.assign({}, state.machinesData)
			newMachinesData[machineId] = action.machineData
			newState.machinesData = newMachinesData

			logger('Store after reduce', newState)
			return newState
		}

		default:
			return defaultState
	}
}

export default rootReducer