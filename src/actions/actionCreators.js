// Stores the authentication token delivered by Firebase Auth
export function login(currentUser, currentUserUid, currentBrandId, currentBrandName) {
    return {
        type: 'ACCT_LOGIN',
        isLoggedIn: true,
        currentUser: currentUser,
        currentUserUid: currentUserUid,
        currentBrandId: currentBrandId,
        currentBrandName: currentBrandName
    }
}

export function logout() {
    return {
        type: 'ACCT_LOGOUT',
        isLoggedIn: false,
    }
}
