import { useState, useEffect } from "react";
import { useParams,Link } from "react-router-dom";
import Loading from "../Loading";

function Ayat({ setCurrentAyat, currentAyat, setAllAyat }) {

    const { number,ayat:numberInSurah } = useParams();
    const [ayat, setAyat] = useState({});
    const [arti, setArti] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getSpesificAyat = async () => {

            const request = await fetch(`https://api.alquran.cloud/v1/surah/${number}`);
            const { data } = await request.json();
            const requestArti = await fetch(`https://api.alquran.cloud/v1/surah/${number}/id.indonesian`);
            const { data: dataArti } = await requestArti.json();

            setAyat({
                ...data
            });

            setArti([
                ...dataArti.ayahs
            ]);

            setAllAyat({
                ...data
            })
            setLoading(false)

            if(numberInSurah === 'start'){
                setCurrentAyat(data.ayahs[0].number);
                  document.getElementById('ayat').scrollIntoView();
            }else{

                setCurrentAyat(parseInt(numberInSurah));
                document.getElementById(`id-${numberInSurah}`).scrollIntoView();
            }


        };


        getSpesificAyat();
      

    }, [number, setCurrentAyat, setAllAyat,numberInSurah]);


    // useEffect(() => {

    //     if (quranAudioRef.current) {
    //         quranAudioRef.current.play()
    //     }

    // }, [currentAyat, quranAudioRef])

    return (
        <div className='bg-blue-100 py-2 relative min-h-screen' id="ayat">
            {loading && (
                <Loading />
            )}

            {
                !loading && (
                    ayat.ayahs.map((ay, index) => {
                        return (
                            <Link key={`${ay.number}`} to={`/surat/${number}/${ay.number}`}>
                                <div id={`id-${ay.number}`}  className={`rounded p-5 shadow-md mb-5 mx-2 cursor-pointer ${currentAyat === ay.number ? 'bg-blue-200' : 'bg-white'}`} onClick={() => {
                                    setCurrentAyat(ay.number)


                                }}>
                                    <div className='flex justify-end mb-3'>
                                        <p className='text-slate-700 text-2xl text-right'>{`${ay.text}`} <span className="bg-blue-400 text-white rounded-md px-1 py-0 text-sm">{ay.numberInSurah.toLocaleString('ar-EG')}</span></p>
                                    </div>
                                    <small className='tracking-wider pt'>{arti[index].text}</small>


                                </div>
                            </Link>
                        )
                    })
                )}
        </div>
    )


}


export default Ayat