import {useNavigate} from "react-router";


export function GenreCard({ name, id }) {

    const navigate = useNavigate();


    return (
        <div className="p-8 flex justify-between items-center w-3/4 h-20 mt-2 shadow-lg rounded-2xl">
            <h2 className="text-lg font-bold ml-8">{name}</h2>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-8"
                onClick={() => navigate(`/genres/${id}`)}
            >
                Изменить
            </button>
        </div>
    )
}