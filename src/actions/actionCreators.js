// Stores the authentication token delivered by Firebase Auth
export function login(authToken) {
    return {
        type: 'AUTH_TOKEN',
        authToken
    }
}