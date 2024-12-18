import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {fetchGenre} from "../api/fetch-genre.js";
import {updateGenre} from "../api/update-genre.js";
import {deleteGenre} from "../api/delete-genre.js";
import {useUser} from "../hooks/use-admin-hook.js";

export function EditGenrePage() {

    const navigate = useNavigate();
    const {id} = useParams();

    const {currentUser, token} = useUser();

    const [genre, setGenre] = useState({});

    useEffect(() => {

        const pullGenre = async () => {
            const result = await fetchGenre(id);
            setGenre(result);
        }

        pullGenre();
    }, []);


    function handleSaveGenre() {
        updateGenre(genre, token);
        alert("Название жанра успешно изменено!")
        navigate(-1);
    }

    function handleDeleteGenre() {
        const toDelete = confirm("Вы действительно хотите удалить данный жанр?")
        if (toDelete) {
            deleteGenre(id, token);
            navigate(-1);
        }
    }

    return (
        <div className="px-16 flex flex-col w-full items-center justify-center">
            <h3
                className="cursor-pointer hover:text-blue-500 self-start text-md text-gray-500 font-bold"
                onClick={() => navigate(-1)}
            >
                &lt; назад
            </h3>
            <h1>Изменить название жанра</h1>
            <input
                className="mt-2 w-56 p-2 text-lg text-gray-700 border border-gray-300 rounded-lg"
                type="text"
                value={genre["genre_name"]}
                onChange={(e) => setGenre({...genre, genre_name: e.target.value})}
            />
            <button
                className="w-56 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => handleSaveGenre()}
            >

                Сохранить
            </button>
            <button
                className="w-56 mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => handleDeleteGenre()}
            >

                Удалить жанр
            </button>
        </div>
    )
}