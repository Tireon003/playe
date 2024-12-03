import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Card } from "antd";
import "./Main.css";
import axios from 'axios';
import { CardInterface } from "../../types/Card";



export const Main = () => {
  const navigate = useNavigate();

  const [genres, setGenres] = useState([]);

  const getGenres = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/genres/"
    )
    setGenres(response.data)
  }

  useEffect(() => { getGenres() }, []);

  return (
    <div>
      <h2 className="title">Выберите категорию </h2>
      <div className="content">
        {genres.map((item: CardInterface) => (
          <Card
            onClick={() => { navigate(`genre/${item.id}`) }}
            title={item.genre_name}
            hoverable
            style={{
              width: 300,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              cursor: "pointer",
            }}
          >
            <img className={"img"} src={item.img} alt="img" />
          </Card>
        ))}
      </div>
    </div>
  );
};
