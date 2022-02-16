import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Loading from "../Loading";

function Ayat({ setCurrentAyat, currentAyat, setAllAyat }) {

    const { number, ayat: numberInSurah } = useParams();
    const [ayat, setAyat] = useState({});
    const [summary, setSummary] = useState('');
    const [arti, setArti] = useState([]);
    const [savedAyat, setSavedAyat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [firstTimeLoad, setFirstTimeLoad] = useState(true);
    const [transliteration, setTransliteration] = useState([]);

    useEffect(() => {

        const translation = ['quran-uthmani', 'id.indonesian', 'id.muntakhab', 'en.transliteration']; //harusnya sih object

        const getSpesificAyat = async () => {

            const request = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/${translation[0]},${translation[1]},${translation[3]}`);
            const { data } = await request.json();
            const requestSummary = await fetch(`https://api.alquran.cloud/v1/surah/${number}/${translation[2]}`);
            const { data: dataSummary } = await requestSummary.json();
            const storageAyat = JSON.parse(localStorage.getItem('savedAyat'));


            setAyat({
                ...data[0]
            });

            setArti({
                ...data[1]
            })

            setTransliteration({
                ...data[2]
            })

            setSavedAyat([...storageAyat]);

            setSummary(
                dataSummary.ayahs[0].text
            );

            setAllAyat({
                ...data[0]
            })

            if (numberInSurah === 'start') {
                setCurrentAyat(parseInt(data[0].ayahs[0].number));
                setFirstTimeLoad(false)
                setLoading(false)
                document.getElementById('ayat').scrollIntoView();

            } else {
                setCurrentAyat(parseInt(numberInSurah));
                setFirstTimeLoad(false)
                setLoading(false)
                document.getElementById(`id-${numberInSurah}`).scrollIntoView();
            }

        };

        if (firstTimeLoad) {

            setLoading(true);
            return getSpesificAyat();

        }


        if (!firstTimeLoad && numberInSurah === 'start') {
            setLoading(true);
            return getSpesificAyat();
        }

        return () => {

        };

    }, [number, setCurrentAyat, setAllAyat, numberInSurah, firstTimeLoad, setFirstTimeLoad]);



    useEffect(() => {
        setCurrentAyat(parseInt(numberInSurah));
        const el = document.getElementById(`id-${numberInSurah}`);
        if (el) el.scrollIntoView();

    }, [numberInSurah, setCurrentAyat])


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
                        {/* SUMMARY */}
                        <div className='relative rounded p-5 shadow-md mb-3 mx-2 bg-white'>
                            <h1 className="text-2xl font-bold text-center mb-3">{ayat.englishName}</h1>
                            <div className="mb-10 text-center">
                                <small className='tracking-wider'>{summary} </small>
                                <p className="mt-3">
                                    <b>Muhammad Quraish Shihab</b>
                                </p>
                            </div>

                        </div>


                        {ayat.ayahs.map((ay, index) => {
                            return (
                                <div id={`id-${ay.number}`} className="py-3">
                                    <Link key={`${ay.number}`} to={`/surat/${number}/${ay.number}`}>
                                        <div className={`relative rounded p-5 shadow-md  mx-2 cursor-pointer ${currentAyat === ay.number ? 'bg-gradient-to-br from-blue-200 to-blue-300' : 'bg-white'}`} onClick={(e) => {
                                            setCurrentAyat(ay.number)
                                            // document.getElementById(`id-${ay.number}`).scrollIntoView();
                                        }}>
                                            <div className='flex justify-end mb-3'>
                                                <p className='text-slate-700 text-2xl text-right'>{`${ay.text}`} <span className="bg-blue-400 text-white rounded-md px-1 py-0 text-sm">{ay.numberInSurah.toLocaleString('ar-EG')}</span></p>
                                            </div>

                                            <div className="mb-10">
                                                <p className="pt-2 pb-3 tracking-wider font-bold text-sm italic text-slate-700">{`${transliteration.ayahs[index].text}`}</p>
                                                <small className='tracking-wider'>{`${ay.numberInSurah}) `}{`${arti.ayahs[index].text}`}</small>
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
                                                                transliteration:transliteration.ayahs[index].text,
                                                                arti: arti.ayahs[index].text
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
                                </div>
                            )
                        })}
                    </div>
                )}
        </div>
    )


}


export default Ayat