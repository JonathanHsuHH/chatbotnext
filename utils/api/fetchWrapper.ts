import {getCurrentUserToken} from '../LoginUtils';

export function postWrapper(url: string, body: string) {
    const token = getCurrentUserToken();
    return fetch(url, {
        method: 'POST',
        headers: token ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } : {'Content-Type': 'application/json'},
        credentials: 'include',
        body: body,
    });
}