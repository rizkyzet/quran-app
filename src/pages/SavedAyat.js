import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SavedAyat({ setCurrentAyat, currentAyat, deleteSavedAyat, savedAyat, setSavedAyat, searchSavedAyatMode, searchSavedAyat, }) {


    useEffect(() => {

        const data = JSON.parse(localStorage.getItem('savedAyat'));

        if (data.length > 0) {
            setSavedAyat([...data]);
            setCurrentAyat(parseInt(data[0].idAyat));
        } else {
            setSavedAyat([...data]);
            setCurrentAyat('');
        }


        // setSearchSavedAyatMode(false);
        // setSearchKeywordSavedAyat('');

    }, [setCurrentAyat, setSavedAyat])



    useEffect(() => {

        const el = document.getElementById(`savedId-${currentAyat}`);

        if (el) {
            el.scrollIntoView()
        }

    }, [currentAyat])

    return (
        <div className='bg-blue-100 relative min-h-full' id="ayat">

            <div className="py-2">

                {searchSavedAyatMode ?
                    searchSavedAyat.map((ay, index) => {
                        return (

                            <div key={`keySavedAyat-${ay.idAyat}`} id={`savedId-${ay.idAyat}`} className={`rounded p-5 shadow-md mb-5 mx-2 cursor-pointer ${currentAyat === ay.idAyat ? 'bg-gradient-to-br from-blue-200 to-blue-300' : 'bg-white'}`} onClick={(e) => {
                                setCurrentAyat(ay.idAyat)
                            }}>
                                <div className='flex items-center justify-between mb-8 border-b pb-2'>
                                    <span className='text-sm tracking-wider'>{`${ay.englishName} (${ay.numberInSurah})`}</span>
                                    <button className='bg-blue-500 hover:bg-blue-400 text-white rounded p-1'
                                        onClick={(e) => {
                                            e.stopPropagation();

                                            deleteSavedAyat(index, ay.idAyat);

                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex justify-end my-3'>
                                    <p className='text-slate-700 text-2xl text-right'>{`${ay.text}`} <span className="bg-blue-400 text-white rounded-md px-1 py-0 text-sm">{ay.numberInSurah.toLocaleString('ar-EG')}</span></p>
                                </div>

                                <div className="mb-0">
                                    <p className="pt-2 pb-3 tracking-wider font-bold text-sm italic text-slate-700">{`${ay.transliteration}`}</p>
                                    <small className='tracking-wider'>{`${ay.numberInSurah}) ${ay.arti}`}</small>
                                </div>


                                <div className="mt-1 flex justify-end">
                                    <Link to={`/surat/${ay.idSurat}/${ay.idAyat}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="bg-blue-500 text-white rounded  px-2 py-1 drop-shadow text-sm hover:bg-blue-400 flex items-center">
                                        Go to surat
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                    :
                    savedAyat.map((ay, index) => {
                        return (

                            <div key={`keySavedAyat-${ay.idAyat}`} id={`savedId-${ay.idAyat}`} className={`rounded p-5 shadow-md mb-5 mx-2 cursor-pointer ${currentAyat === ay.idAyat ? 'bg-gradient-to-br from-blue-200 to-blue-300' : 'bg-white'}`} onClick={(e) => {
                                setCurrentAyat(ay.idAyat)
                            }}>
                                <div className='flex items-center justify-between mb-8 border-b pb-2'>
                                    <span className='text-sm tracking-wider'>{`${ay.englishName} (${ay.numberInSurah})`}</span>
                                    <button className='bg-blue-500 hover:bg-blue-400 text-white rounded p-1'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSavedAyat(index, ay.idAyat);

                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex justify-end my-3'>
                                    <p className='text-slate-700 text-2xl text-right'>{`${ay.text}`} <span className="bg-blue-400 text-white rounded-md px-1 py-0 text-sm">{ay.numberInSurah.toLocaleString('ar-EG')}</span></p>
                                </div>

                                <div className="mb-0">
                                    <p className="pt-2 pb-3 tracking-wider font-bold text-sm italic text-slate-700">{`${ay.transliteration}`}</p>
                                    <small className='tracking-wider'>{`${ay.numberInSurah}) ${ay.arti}`}</small>
                                </div>


                                <div className="mt-1 flex justify-end">
                                    <Link to={`/surat/${ay.idSurat}/${ay.idAyat}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className="bg-blue-500 text-white rounded  px-2 py-1 drop-shadow text-sm hover:bg-blue-400 flex items-center">
                                        Go to surat
                                    </Link>
                                </div>
                            </div>
                        )
                    })


                }



            </div>
        </div>
    )

}