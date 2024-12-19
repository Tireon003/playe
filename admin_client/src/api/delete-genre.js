import axios from "axios";

export async function deleteGenre(id, token) {
    const url = `${window.CONSTS.serverUrl}/api/genres/${id}`
    await axios.delete(
        url,
        {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return null;
}