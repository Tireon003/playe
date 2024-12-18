import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

export function useUser() {
    const token = Cookies.get("access_token");
    console.log(token);
    let currentUser = null;
    if (token) {
        try {
            currentUser = jwtDecode(token);
        } catch (e) {
            console.error(`Error while authenticating user: ${e}`);
        }
    }
    return {currentUser, token}
}