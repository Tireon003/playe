import axios from "axios";

export async function fetchVideos() {
    const url = `${window.CONSTS.serverUrl}/api/videos/all`;
    let result = [];
    await axios.get(
        url
    ).then(res => {
        result = res.data;
    }).catch(err => {
        console.error(`Error while fetching videos: ${err}`);
    })
    return result
}