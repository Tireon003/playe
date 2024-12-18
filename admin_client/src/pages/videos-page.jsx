import {useEffect, useState} from "react";
import {VideoCard} from "../components/ui/video-card.jsx";
import {useNavigate} from "react-router";
import {fetchVideos} from "../api/fetch-videos.js";


export function VideosPage() {

    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const getVideos = async () => {
            const result = await fetchVideos();
            setVideos(result);
        }

        getVideos();
    }, []);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between mt-4">
                <h1 className="text-4xl font-bold ml-4">Список видео</h1>
                <button
                    onClick={() => navigate("/videos/new")}
                    className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Загрузить видео
                </button>
            </div>

            <div className="overflow-x-hidden overflow-y-auto scroll-smooth flex flex-col items-center py-8">
                {videos.map(video => <VideoCard key={video["id"]} data={video}/>)}
            </div>
        </div>
    )
}