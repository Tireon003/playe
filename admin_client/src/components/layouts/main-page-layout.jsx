import {Link, Outlet, useNavigate} from "react-router";
import {useUser} from "../../hooks/use-admin-hook.js";
import {useEffect} from "react";
import Cookies from "js-cookie";


export function MainPageLayout() {

    const navigate = useNavigate();

    const {currentUser, token} = useUser();


    const handleLogout = () => {
        Cookies.remove("access_token");
        window.location.reload();
        // navigate("/login");
    }

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token])

    return (
        <section className="flex h-screen">
            <aside className="flex flex-col place-items-center w-[320px] shadow-xl">
                <h2 className="text-2xl font-bold text-blue-500 mt-4">
                    Playe
                </h2>
                <h4 className="text-gray-600 text-sm">панель адинистратора</h4>
                <div className="h-px w-5/6 bg-gray-600 mt-2 shadow-sm"></div>
                <div className="flex flex-col items-center justify-between h-full">
                    <nav className="mt-4 text-center">
                        <ul className="text-gray-600 font-bold text-md space-y-2">
                            <li className="hover:text-blue-500">
                                <Link to="/videos">Список видео</Link>
                            </li>
                            <li className="hover:text-blue-500">
                                <Link to="/genres">Список жанров</Link>
                            </li>
                            <li className="hover:text-blue-500">
                                <Link to="/videos/new">Добавить видео</Link>
                            </li>
                        </ul>
                    </nav>
                    { currentUser !== null ?
                        (
                            <button
                                className="mb-4 bg-blue-500 text-white rounded-lg w-36 h-8 hover:bg-blue-600"
                                onClick={() => handleLogout()}
                            >
                                Выйти
                            </button>
                        ) : (
                            <div className="flex mb-4 space-x-1">
                                <button className="bg-white text-blue-500 rounded-lg w-fit h-8 hover:bg-blue-50 hover:border-blue-500">
                                    <Link to="/register">Зарегистрироваться</Link>
                                </button>
                                <button className="bg-blue-500 text-white rounded-lg w-16 h-8 hover:bg-blue-600">
                                    <Link to="/login">Войти</Link>
                                </button>
                            </div>

                        )
                    }
                </div>
            </aside>
            <main className="flex w-full h-full place-items-center overflow-y-auto">
                <Outlet/>
            </main>
        </section>

    )
}