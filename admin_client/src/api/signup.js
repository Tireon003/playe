import axios from "axios";

export async function signupUser(username, password) {
    let status;
    const url = `${window.CONSTS.serverUrl}/api/auth/signup`;
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
        status = res.status;
    }).catch(err => {
        console.error(`Error while registration: ${err}`);
        status = err.status;
    })
    return status;
}