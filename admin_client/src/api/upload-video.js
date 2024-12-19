import axios from 'axios';
import {useUser} from "../hooks/use-admin-hook.js";

const uploadVideo = async (videoFile, previewImage, title, description, genreId) => {
    const formData = new FormData();
    const {token} = useUser();
    // Добавляем видеофайл
    formData.append("video", videoFile);

    // Добавляем превью, если оно есть
    if (previewImage) {
        formData.append('preview_image', previewImage);
    }

    const url = `${window.CONSTS.serverUrl}/api/videos/upload?title=${title}&description=${description}&genre_id=${genreId}`;

    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data; // Возвращаем данные ответа
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error; // Обработка ошибок
    }
};

export default uploadVideo;