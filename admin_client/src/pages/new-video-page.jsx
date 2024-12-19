import React, { useState, useEffect } from 'react';
import {fetchGenres} from "../api/fetch-genres.js";
import uploadVideo from "../api/upload-video.js";
import {useNavigate} from "react-router";

export function NewVideoPage() {

    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [genre, setGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Загрузка жанров из API
        const getGenres = async () => {
            const result = await fetchGenres();
            setGenres(result);
        };

        getGenres();
    }, []);

    const handlePreviewChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg') && file.size <= 5 * 1024 * 1024) {
            setPreview(file); // Устанавливаем файл, а не URL
        } else {
            alert('Выберите файл формата PNG или JPEG размером до 5 МБ.');
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'video/mp4' && file.size <= 100 * 1024 * 1024) {
            setVideoFile(file);
        } else {
            alert('Выберите файл формата MP4 размером до 100 МБ.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await uploadVideo(videoFile, preview, title, description, genre.id);
            alert("Видео успешно загружено!");
            navigate(-1);
        } catch (error) {
            error("Во время загрузки видео произошла непредвиденная ошибка: ", error);
        }
    };

    const handleGenreChange = (e) => {
        const selectedGenreName = e.target.value; // Получаем выбранное имя жанра
        const selectedGenre = genres.find(genre => genre.genre_name === selectedGenreName); // Находим соответствующий объект жанра
        setGenre(selectedGenre); // Устанавливаем найденный объект жанра в состояние
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow overflow-auto">
            <h3
                className="cursor-pointer hover:text-blue-500 self-start text-md text-gray-500 font-bold"
                onClick={() => navigate(-1)}
            >
                &lt; назад
            </h3>
            <h1 className="text-xl font-bold mb-4">Загрузка видео</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Название видео (обязательное):</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border rounded w-full p-2"
                        required
                    />
                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Превью для видео (необязательно):</label>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handlePreviewChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Загрузка видеофайла (обязательное):</label>
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={handleVideoChange}
                        className="border rounded w-full p-2"
                        required
                    />
                    {errors.videoFile && <p className="text-red-500">{errors.videoFile}</p>}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Жанр:</label>
                    <select
                        value={genre["genre_name"]}
                        onChange={(e) => handleGenreChange(e)}
                        className="border rounded w-full p-2"
                    >
                        <option value="">Выберите жанр</option>
                        {genres.map((g) => (
                            <option key={g["id"]} value={g["genre_name"]}>{g["genre_name"]}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="bg-blue-500 text-white rounded p-2">Загрузить видео</button>
            </form>
        </div>
    );
};
