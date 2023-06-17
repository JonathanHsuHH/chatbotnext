import {postWrapper} from './api/fetchWrapper';

let userIdCache: string|null = null;
let userTokenCache: string|null = null;

export const login = async (username: string, password: string) => {
    const response = await postWrapper('/api/auth', JSON.stringify({username: username, password: password}));
    if (response.ok) {
        const result = await response.json()
        if (result.error) {
            return {error: `Username or password is incorrect`, ok: false}
        } else {
            localStorage.setItem('user', JSON.stringify(result));
            return {data: result, ok: true}
        }
    } else {
        return {error: `Username or password is incorrect`, ok: false}
    }
}
export const logout = () => {
    userIdCache = null;
    userTokenCache = null;
    localStorage.removeItem("user");
 };

export const getCurrentUser = () => {
    if (userIdCache) {
        return userIdCache;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
        const user = JSON.parse(userStr);
        userIdCache = user.id;
        return user.id;
    }
    return null;
};

export const getCurrentUserToken = () => {
    if (userTokenCache) {
        return userTokenCache;
    }
    const userStr = localStorage.getItem("user");
    if (userStr) {
        const user = JSON.parse(userStr);
        userTokenCache = user.token;
        return user.token;
    }
    return null;
};

const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

export const authVerify = ():boolean => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user) {
            const decodedJwt = parseJwt(user.token);
            if (decodedJwt?.exp * 1000 >= Date.now()) {
                return true;
            }
          }
    }
    return false;
};