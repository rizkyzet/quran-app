import { useEffect, useState } from "react";


export default function Loading({ text,setAsd }) {

    const [waitingText, setWaitingText] = useState(false);

    useEffect(() => {
    
        setTimeout(() => {
            setWaitingText(true)
        }, 1000)

    }, [])

 

    return (
        <div className="bg-gradient-to-t from-blue-200 to-white w-full h-full opacity-100 flex justify-center z-10 absolute m-0">
            <div className="absolute top-1/3 z-20 flex justify-center items-center flex-col">

                <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" className="stroke-blue-500">
                    <g fill="none" fillRule="evenodd" strokeWidth="1">
                        <circle cx="22" cy="22" r="1">
                            <animate attributeName="r"
                                begin="0s" dur="1.8s"
                                values="1; 20"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.165, 0.84, 0.44, 1"
                                repeatCount="indefinite" />
                            <animate attributeName="stroke-opacity"
                                begin="0s" dur="1.8s"
                                values="1; 0"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.3, 0.61, 0.355, 1"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="22" cy="22" r="1">
                            <animate attributeName="r"
                                begin="-0.9s" dur="1.8s"
                                values="1; 20"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.165, 0.84, 0.44, 1"
                                repeatCount="indefinite" />
                            <animate attributeName="stroke-opacity"
                                begin="-0.9s" dur="1.8s"
                                values="1; 0"
                                calcMode="spline"
                                keyTimes="0; 1"
                                keySplines="0.3, 0.61, 0.355, 1"
                                repeatCount="indefinite" />
                        </circle>
                    </g>
                </svg>
                <div className="text-blue-500 font-bold tracking-widest pl-2">{text}</div>


                {waitingText && (
                    <small className="text-blue-500 font-bold tracking-widest pl-2">jika terlalu lama, silahkan refresh halaman...</small>
                )}


            </div>

        </div>


    )
}