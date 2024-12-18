import axios from "axios";

export async function fetchGenre(id) {
    const url = `${window.CONSTS.serverUrl}/api/genres/${id}`;
    let result = {};

    await axios.get(url).then(res => {
        result = res.data;
    }).catch(err => console.error(`Error while fetching genre: ${err}`));

    return result;
}