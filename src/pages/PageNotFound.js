import { Link } from "react-router-dom"

export default function PageNotFound() {
    return (
        <div className="bg-gradient-to-t from-blue-200 to-white w-full h-full opacity-100 flex justify-center z-10 absolute m-0">
            <div className="absolute top-1/3 z-20 flex justify-center items-center flex-col">
                <h1 className="text-6xl text-blue-500 font-mono font-thin">404</h1>
                <Link to="/" className="hover:text-blue-500 text-blue-700 text-xl">&laquo; Back to home.</Link>
            </div>

        </div>


    )
}