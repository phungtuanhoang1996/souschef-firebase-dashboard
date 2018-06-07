const ongoingCodes = (state=[], action) => {
	if (action.ongoingCodes != null) {
		return action.ongoingCodes
	} else {
		return state
	}
}

export default ongoingCodes