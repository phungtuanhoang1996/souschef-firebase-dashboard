function currentBrandId(state=[], action) {
    if (action.currentBrandId != null) {
        return action.currentBrandId;
    }
    return state;
}

export default currentBrandId;