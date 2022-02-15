import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../Loading";

function Ayat({ setCurrentAyat, currentAyat, setAllAyat }) {

    const { number, ayat: numberInSurah } = useParams();
    const [ayat, setAyat] = useState({});
    const [arti, setArti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedAyat, setSavedAyat] = useState([]);
    const [firstTimeLoad, setFirstTimeLoad] = useState(true);

    useEffect(() => {

        const getSpesificAyat = async () => {

            const request = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
            const { data } = await request.json();
            const requestArti = await fetch(`https://api.alquran.cloud/v1/surah/${number}/id.indonesian`);
            const { data: dataArti } = await requestArti.json();
            const storageAyat = JSON.parse(localStorage.getItem('savedAyat'));

            setAyat({
                ...data
            });

            setSavedAyat([...storageAyat]);

            setArti([
                ...dataArti.ayahs
            ]);

            setAllAyat({
                ...data
            })



            // if(firstTimeLoad){
            if (numberInSurah === 'start') {
                setCurrentAyat(data.ayahs[0].number);
                document.getElementById('ayat').scrollIntoView();
                setFirstTimeLoad(false)
                setLoading(false)

            } else {
                setCurrentAyat(parseInt(numberInSurah));
                setFirstTimeLoad(false)
                setLoading(false)
                document.getElementById(`id-${numberInSurah}`).scrollIntoView();
            }
            // }


        };

        if (firstTimeLoad || numberInSurah === 'start') {
            setLoading(true);
            getSpesificAyat();
        } 

     

    }, [number, setCurrentAyat, setAllAyat, numberInSurah, firstTimeLoad, setFirstTimeLoad]);




    const saveAyat = (obj) => {

        const newData = {
            ...obj
        };
        const currentData = JSON.parse(localStorage.getItem('savedAyat'));

        currentData.unshift(newData);

        localStorage.setItem('savedAyat', JSON.stringify(currentData, null, 2));

        setSavedAyat([...currentData]);

    }

    const deleteSaveAyat = (idAyat) => {

        const data = JSON.parse(localStorage.getItem('savedAyat'));

        const newData = data.filter((val) => {
            return val.idAyat !== idAyat;
        })

        setSavedAyat([...newData]);

        localStorage.setItem('savedAyat', JSON.stringify(newData, null, 2));
    }


    return (
        <div className='bg-blue-100 relative min-h-full' id="ayat">
            {loading && (
                <Loading text="Getting Ayat..." />
            )}

            {
                !loading && (
                    <div className="py-2">
                        {ayat.ayahs.map((ay, index) => {
                            return (
                                <Link key={`${ay.number}`} to={`/surat/${number}/${ay.number}`}>
                                    <div id={`id-${ay.number}`} className={`relative rounded p-5 shadow-md mb-5 mx-2 cursor-pointer ${currentAyat === ay.number ? 'bg-gradient-to-br from-blue-200 to-blue-300' : 'bg-white'}`} onClick={(e) => {
                                        setCurrentAyat(ay.number)
                                        // document.getElementById(`id-${ay.number}`).scrollIntoView();
                                    }}>
                                        <div className='flex justify-end mb-3'>
                                            <p className='text-slate-700 text-2xl text-right'>{`${ay.text}`} <span className="bg-blue-400 text-white rounded-md px-1 py-0 text-sm">{ay.numberInSurah.toLocaleString('ar-EG')}</span></p>
                                        </div>

                                        <div className="mb-10">
                                            <small className='tracking-wider'>{arti[index].text}</small>
                                        </div>

                                        {currentAyat === ay.number && (

                                            savedAyat.filter((val) => val.idAyat === ay.number).length > 0 ?

                                                <div className="mt-1 flex justify-end absolute bottom-4 right-4">
                                                    <button
                                                        className="bg-blue-100 text-blue-500 rounded  px-2 py-1 drop-shadow text-sm"
                                                        onClick={() => {
                                                            deleteSaveAyat(ay.number)
                                                        }}
                                                    >
                                                        Saved
                                                    </button>
                                                </div>

                                                :

                                                <div className="mt-1 flex justify-end absolute bottom-4 right-4">
                                                    <button onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        const obj = {
                                                            idSurat: ayat.number,
                                                            idAyat: ay.number,
                                                            englishName: ayat.englishName,
                                                            text: ay.text,
                                                            numberInSurah: ay.numberInSurah,
                                                            arti: arti[index].text
                                                        }
                                                        saveAyat(obj);
                                                    }}
                                                        className="bg-blue-500 text-white rounded  px-2 py-1 drop-shadow text-sm hover:bg-blue-400 flex items-center">
                                                        Save Ayat
                                                    </button>
                                                </div>
                                        )
                                        }




                                    </div>

                                </Link>
                            )
                        })}
                    </div>
                )}
        </div>
    )


}


export default Ayat