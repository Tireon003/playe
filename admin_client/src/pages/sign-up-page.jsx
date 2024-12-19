import {useState} from "react";
import {useNavigate} from "react-router";
import {signupUser} from "../api/signup.js";


export function RegisterPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        const status = signupUser(username, password);
        if (status === 201) {
            navigate("/videos");
        } else {
            alert("В ходе регистрации произошла ошибка!")  // fixme неправлиьная обработка статуса
        }
    }

    return (
        <div className="flex flex-col w-full items-center">
            <h1 className="text-2xl text-center text-black">Регистрация администратора</h1>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col items-center justify-center mt-2 w-[360px]"
            >
                <input
                    className="border-2 text-black border-gray-400 p-2 rounded-xl mt-2 w-3/4"
                    type="text"
                    name="usernamer"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border-2 text-black border-gray-400 p-2 rounded-xl mt-2 w-3/4"
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="border-2 border-gray-400 p-2 rounded-xl mt-2 text-black w-3/4 hover:bg-gray-100"
                >
                    Зарегистрироваться
                </button>
            </form>
        </div>
    )
}