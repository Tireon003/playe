import axios from "axios";

export async function updateGenre(genre, token) {
    const url = `${window.CONSTS.serverUrl}/api/genres/${genre["id"]}?name=${genre["genre_name"]}`;
    console.log(url);
    await axios.patch(
        url,
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return null;
}