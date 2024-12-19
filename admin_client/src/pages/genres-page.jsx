import {GenreCard} from "../components/ui/genre-card.jsx";
import {useEffect, useState} from "react";
import {fetchGenres} from "../api/fetch-genres.js";
import {useNavigate} from "react-router";


export function GenresPage() {

    const navigate = useNavigate();

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        const pullGenres = async () => {
            const result = await fetchGenres();
            setGenres(result);
        }

        pullGenres();
    }, []);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex justify-between mt-4">
                <h1 className="text-4xl font-bold ml-4">Список жанров</h1>
                <button
                    onClick={() => navigate("/genres/new")}
                    className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Добавить жанр
                </button>
            </div>

            <div className="overflow-x-hidden overflow-y-auto scroll-smooth flex flex-col items-center py-8">
                {genres.map(genre => <GenreCard key={genre["id"]} name={genre["genre_name"]} id={genre["id"]} />)}
            </div>
        </div>
    )
}