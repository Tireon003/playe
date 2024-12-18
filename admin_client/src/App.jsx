import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import {MainPageLayout} from "./components/layouts/main-page-layout.jsx";
import {NotFoundPage} from "./pages/not-found-page.jsx";
import {LoginPage} from "./pages/log-in-page.jsx";
import {RegisterPage} from "./pages/sign-up-page.jsx";
import {useUser} from "./hooks/use-admin-hook.js";
import {GenresPage} from "./pages/genres-page.jsx";
import {EditGenrePage} from "./pages/edit-genre-page.jsx";
import Cookies from "js-cookie";
import {NewGenrePage} from "./pages/new-genre-page.jsx";
import {VideosPage} from "./pages/videos-page.jsx";
import {NewVideoPage} from "./pages/new-video-page.jsx";

function App() {

    const {currentUser, token} = useUser();
    // const token = Cookies.get('access_token');
    // console.log(token)

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainPageLayout />}>
                    <Route path="/videos" element={token ? <VideosPage /> : <Navigate to="/login" />} />
                        {/*<Route path=":id" element={<EditVideoPage />} />*/}
                    <Route path="/videos/new" element={<NewVideoPage />} />

                    <Route path="/genres" element={token ? <GenresPage /> : <Navigate to="/login" />} />
                    <Route path="/genres/:id" element={<EditGenrePage/>} />
                    <Route path="/genres/new" element={<NewGenrePage/>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
