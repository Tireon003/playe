import { useNavigate } from "react-router-dom";
import { array } from "./config/Genres";
import { Card } from "antd";
import "./Main.css";
export const Main = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="title">Выберите категорию</h2>
      <div className="content">
        {array.map((item) => (
          <Card
            onClick={() => navigate("/genre")}
            title={item.name}
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
