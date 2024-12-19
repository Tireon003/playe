import axios from "axios";

export async function createGenre(genre, token) {

    const url = `${window.CONSTS.serverUrl}/api/genres/?name=${genre}`;

    await axios.post(
        url,
        {},
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    ).then(res => res.status).catch(err => {
        console.log(err);
        return err.status
    });
}