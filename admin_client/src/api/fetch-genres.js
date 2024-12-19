import axios from 'axios';


export async function fetchGenres() {
    const url = `${window.CONSTS.serverUrl}/api/genres/`;
    let result = [];
    await axios.get(
        url
    ).then(res => {
        result = res.data;
    }).catch(err => {
        console.error(`Error while fetching genres: ${err}`);
    })
    return result
}