// Stores the authentication token delivered by Firebase Auth
export function login() {
    return {
        type: 'ACCT_LOGIN',
        isLoggedIn: true,
    }
}

export function logout() {
    return {
        type: 'ACCT_LOGOUT',
        isLoggedIn: false,
    }
}
