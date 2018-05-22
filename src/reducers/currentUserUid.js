const currentUserUid = (state=[], action) => {
	if (action.currentUserUid != null) {
		return action.currentUserUid;
	}
	return state;
}

export default currentUserUid