import { Card } from "antd";
import "./Genre.css";
import Meta from "antd/es/card/Meta";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { formDuration } from "../utils/formDuration";

interface CardInterface {
  id: number | string;
  title: string;
  img: string;
  description?: string;
  duration: number;
  file_name: string;
  genre_id: number;
}

export const Genre = () => {
  const [isActive, setIsActive] = useState(false);
  const location = useLocation();
  const [videos, setVideos] = useState<CardInterface[] | null>(null);
  const [property, setProperty] = useState({ id: 0, filename: "" });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const setVideoProperties = (filename: string, id: number) => {
    setProperty({ filename: filename, id: id });
  };

  const fetchVideos = async (genreId: number) => {
    try {
      const response = await axios.get<CardInterface[]>(`http://localhost:8080/api/videos/?genre_id=${genreId}`);
      setVideos(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке видео:', error);
      setVideos(null);
    }
  };

  const handleActive = (item: CardInterface) => {
    setIsActive(true);
    setVideoProperties(item.file_name, item.genre_id);
  };

  const fetchVideo = async () => {
    if (!property.filename || property.id === 0) return;

    const response = await fetch(`http://localhost:8080/api/videos/watch?video_filename=${property.filename}&genre_id=${property.id}`);
    if (!response.ok) {
      console.error('Failed to fetch video:', response.status);
      return;
    }

    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');
    let receivedLength = 0; // Количество полученных байтов
    const chunks: Uint8Array[] = []; // Массив для хранения чанков

    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // Если данные закончились, выходим из цикла

      chunks.push(value);
      receivedLength += value.length;

      // Выводим прогресс загрузки
      console.log(`Received ${receivedLength} of ${contentLength}`);
    }

    // Создаем Blob из полученных чанков
    const blob = new Blob(chunks);
    const url = URL.createObjectURL(blob);
    if (videoRef.current) {
      videoRef.current.src = url; // Устанавливаем URL в элемент video
      videoRef.current.play(); // Автоматически начинаем воспроизведение
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const pathParts = currentPath.split("/");
    const genreId = Number(pathParts[2]);

    fetchVideos(genreId);
  }, [location.pathname]);

  useEffect(() => {
    if (isActive) {
      fetchVideo();
    }
  }, [isActive, property]);

  return (
      <div>
        <div>
          <h2>Боевики</h2>
          <div className="video">
            <div className="items">
              {videos?.map((item: CardInterface) => (
                  <Card
                      key={item.id}
                      onClick={() => handleActive(item)}
                      hoverable
                      style={{ width: 240 }}
                      cover={<img alt={item.title} src={item.img} />}
                  >
                    <Meta
                        title={item.title}
                        description={item.description}
                    />
                    <div className="property">
                      <p>{formDuration(item.duration)}</p>
                    </div>
                  </Card>
              ))}
            </div>
            <div className="player">
              {isActive ? (
                  <video ref={videoRef} controls>
                    Your browser does not support the video tag.
                  </video>
              ) : (
                  <div className="notActive">Видео пока не выбрано</div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};