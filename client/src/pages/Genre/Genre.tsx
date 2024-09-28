import { Card } from "antd";
import { array } from "./config/Genres";
import "./Genre.css";
import Meta from "antd/es/card/Meta";
import ReactPlayer from "react-player";
import { useState } from "react";

export const Genre = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div>
      <div>
        <h2>Боевики</h2>
        <div className="video">
          <div className="items">
            {array.map((item) => (
              <Card
                onClick={() => setIsActive(true)}
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={item.img} />}
              >
                <Meta
                  title="Europe Street beat"
                  description={item.description}
                />
                <div className="property">
                  <p>Боевик</p>
                  <p>1ч 23мин</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="player">
            {isActive ? (
              <ReactPlayer
                className="react-player"
                url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
                width="1280px"
                height="720px"
              />
            ) : (
              <div className="notActive">Видео пока не выбрано</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
