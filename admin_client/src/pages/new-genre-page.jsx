import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {fetchGenre} from "../api/fetch-genre.js";
import {updateGenre} from "../api/update-genre.js";
import {deleteGenre} from "../api/delete-genre.js";
import {useUser} from "../hooks/use-admin-hook.js";
import {createGenre} from "../api/create-genre.js";

export function NewGenrePage() {

    const navigate = useNavigate();
    const {id} = useParams();

    const {currentUser, token} = useUser();

    const [genre, setGenre] = useState("");

    function handleSaveGenre() {
        createGenre(genre, token);
        alert("Жанр успешно добавлен!")
        navigate(-1);
    }

    return (
        <div className="px-16 flex flex-col w-full items-center justify-center">
            <h3
                className="cursor-pointer hover:text-blue-500 self-start text-md text-gray-500 font-bold"
                onClick={() => navigate(-1)}
            >
                &lt; назад
            </h3>
            <h1>Добавить жанр</h1>
            <input
                className="mt-2 w-56 p-2 text-lg text-gray-700 border border-gray-300 rounded-lg"
                type="text"
                value={genre["genre_name"]}
                onChange={(e) => setGenre(e.target.value)}
            />
            <button
                className="w-56 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() => handleSaveGenre()}
            >
                Сохранить
            </button>
        </div>
    )
}