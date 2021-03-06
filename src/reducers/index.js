import logger from '../Utils/logger'

const defaultState = {
	authToken: "",
	isLoggedIn: false,
	currentUser: null,
	currentUserUid: null,
	currentBrandId: null,
	currentEvent: null,
	currentDashboardPage: 'overview',
	codes: {},
	machinesData: {}
}

const rootReducer = (state, action) => {
	if (!state || state == null) return defaultState

	switch (action.type) {
		case 'ACCT_LOGIN': {
			// logger('Store after reduce', {
			// 	...state,
			// 	isLoggedIn: true,
			// 	currentUser: action.currentUser,
			// 	currentUserUid: action.currentUserUid
			// })

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
			// logger('Store after reduce', {
			// 	...state,
			// 	currentBrandId: action.currentBrandId
			// })

			return {
				...state,
				currentBrandId: action.currentBrandId
			}
		}

		case 'SET_OFFGOING_CODES': {
			// logger('Store after reduce', {
			// 	...state,
			// 	offgoingCodes: action.offgoingCodes
			// })

			return {
				...state,
				offgoingCodes: action.offgoingCodes
			}
		}

		case 'SET_CODES': {
			logger('Store after reduce', {
				...state,
				codes: action.codes
			})

			return {
				...state,
				codes: action.codes
			}
		}

		case 'SET_ONGOING_CODES': {
			// logger('Store after reduce', {
			// 	...state,
			// 	ongoingCodes: action.ongoingCodes
			// })

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

			//logger('Store after reduce', newState)
			return newState
		}

		case 'SET_CURRENT_BRAND_NAME': {
			// logger('Store after reduce:', {
			// 	...state,
			// 	currentBrandName: action.currentBrandName
			// })

			return {
				...state,
				currentBrandName: action.currentBrandName
			}
		}

		case 'SET_CURRENT_EVENT': {

			return {
				...state,
				currentEvent: action.currentEvent
			}
		}

		case 'SET_CURRENT_DASHBOARD_PAGE': {

			return {
				...state,
				currentDashboardPage: action.currentDashboardPage
			}
		}

		default:
			return state
	}
}

export default rootReducer