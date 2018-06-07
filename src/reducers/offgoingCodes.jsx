const offgoingCodes = (state=[], action) => {
	if (action.offgoingCodes != null) {
		return action.offgoingCodes
	} else {
		return state
	}
}
export default offgoingCodes
