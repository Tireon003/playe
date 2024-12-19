import axios from "axios";

export async function loginUser(username, password) {
    let result;
    const url = `${window.CONSTS.serverUrl}/api/auth/login`;
    await axios.post(
        url,
        new URLSearchParams({
            username: username,
            password: password,
            grant_type: 'password'
        }),
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    ).then(res => {
        result = res
    }).catch(err => {
            console.error(`Error while logging in: ${err}`);
            result = err;
        })
    return result;
}