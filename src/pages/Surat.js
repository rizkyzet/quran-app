import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

export default function Surat({ searchMode, searchSurat, loading, surat, setCurrentAyat }) {

    useEffect(() => {
        setCurrentAyat(null)
    }, [setCurrentAyat])

    return (
        <div className='bg-blue-100 py-2 relative min-h-screen text-slate-700'>
            {loading && (
                <Loading />
            )}


            {
                !loading && (

                    searchMode ? (
                        <div className='grid grid-cols-2 gap-3 px-2'>
                            {searchSurat.map((surat) => {
                                return (
                                    <Link key={surat.number} to={`surat/${surat.number}`}>
                                        <div className='bg-white rounded px-2 py-2 shadow-md'>
                                            <div className='flex justify-between'>
                                                <p className='font-bold text-1xl'>{surat.englishName}</p>
                                                <p className='font-bold text-1xl'>{surat.name}</p>
                                            </div>
                                            <small className='tracking-wider'>{`${surat.numberOfAyahs} ayat`}</small>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    ) : (

                        <div className='grid grid-cols-2 gap-3 px-2'>
                            {surat.map((surat) => {
                                return (
                                    <Link key={surat.number} to={`surat/${surat.number}`}>
                                        <div className='bg-white rounded px-2 py-2 shadow-md'>
                                            <div className='flex justify-between'>
                                                <p className='font-bold text-1xl'>{surat.englishName}</p>
                                                <p className='font-bold text-1xl'>{surat.name}</p>
                                            </div>
                                            <small className='tracking-wider'>{`${surat.numberOfAyahs} ayat`}</small>
                                        </div>
                                    </Link>
                                )
                            })}

                        </div>

                    )

                )
            }
        </div>
    )


}