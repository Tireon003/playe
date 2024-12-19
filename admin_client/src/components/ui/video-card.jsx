export function VideoCard({ data }) {
    const { preview_img, title, description, duration, genre } = data;

    return (
        <div className="flex items-center justify-between w-3/4 p-8 mt-4 rounded-lg shadow-lg bg-white">
            <div className="flex-shrink-0">
                <img
                    src={`data:image/jpeg;base64,${preview_img}`}
                    alt={title}
                    className="w-32 h-32 object-cover rounded-lg"
                />
            </div>
            <div className="ml-4 flex-grow">
                <h2 className="text-xl font-bold">{title}</h2>
                {description && <p className="text-gray-600">{description}</p>}
                <p className="text-gray-500">Длительность ~{duration} минут</p>
                <p className="text-gray-500">Жанр: {genre?.genre_name}</p>
            </div>
        </div>
    );
}