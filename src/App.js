import './App.css';

import { useEffect, useRef, useState } from 'react';
import { NavLink, Routes, Route, useLocation, useMatch } from 'react-router-dom';
import Surat from './pages/Surat';
import Ayat from './pages/Ayat';


function App() {


  const [searchKeyword, setSearchKeyword] = useState('');
  const location = useLocation();
  const [searchSurat, setSearchSurat] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAyat, setCurrentAyat] = useState(null);
  const [allAyat, setAllAyat] = useState({});
  const quranAudioRef = useRef(null);

  const activeClass = 'font-bold tracking-wider px-2 text-white bg-white';
  const standartClass = 'tracking-wider px-1 text-blue-500 bg-white rounded';



  useEffect(() => {



    const getSurat = async () => {
      const request = await fetch('http://api.alquran.cloud/v1/surah');
      const { data } = await request.json();

      setSurat(data);
      setLoading(false)

    }

    getSurat();



  }, []);

  useEffect(() => {

    if (quranAudioRef.current) {
      quranAudioRef.current.play()
    }

  }, [currentAyat])



  const matchedBack = useMatch('/surat/:number/:ayat', { path: location.pathname });



  const doSearchSurat = (searchKey) => {

    if (searchKey === '') {
      return setSearchMode(false);
    }

    setSearchMode(true);
    const searchData = surat.filter((surat) => {
      return surat.englishName.toLowerCase().includes(searchKey.toLowerCase());
      // return surat.englishName.toLowerCase() === searchKey.toLowerCase();
    })

    setSearchSurat([...searchData]);

  }




  return (
    <div className='app flex flex-col relative'>
      <header className='flex-none bg-gradient-to-r from-blue-400 to-blue-500 drop-shadow-md sticky'>
        <nav className={`flex ${matchedBack ? 'justify-between' : 'justify-end'} p-2 text-center `}>
          {matchedBack && (
            <>
              <NavLink className={({ isActive }) =>
                isActive ? activeClass : standartClass
              } to="/" onClick={() => {
                setSearchKeyword('');
                setSearchSurat([]);
                setSearchMode(false);
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </NavLink>

              <h1 className='text-md tracking-wider text-white'>
                {allAyat.englishName}
              </h1>
            </>
          )}

          {location.pathname === '/' && (
            <input type="text" className='basis-1 px-2 text-md transition-all rounded-md focus:border-0 focus:outline focus:outline-offset-1 focus:outline-1 focus:outline-blue-300 ' value={searchKeyword} placeholder='search surah...' onChange={(event) => {
              setSearchKeyword(event.target.value)
              doSearchSurat(event.target.value)
            }} />
          )}
        </nav>
      </header>

      <section className='grow shrink overflow-y-scroll'>
        <Routes>
          <Route path="/" element={<Surat searchSurat={searchSurat} searchMode={searchMode} loading={loading} surat={surat} setCurrentAyat={setCurrentAyat} />} ></Route>
          <Route path="/surat/:number/:ayat" element={<Ayat currentAyat={currentAyat} setCurrentAyat={setCurrentAyat} setAllAyat={setAllAyat} quranAudioRef={quranAudioRef} />} ></Route>
        </Routes>
      </section>


      <footer className='flext-none py-3 px-2 mt-auto text-center border-t-gray-100 border-t-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white sticky'>

        {currentAyat && (
          <div className='flex gap-5'>
            <select value={currentAyat} className='text-sm px-1 text-slate-900 text-center bg-white rounded focus:outline focus:outline-offset-1 focus:outline-1 focus:outline-blue-300' onChange={(e) => {
              setCurrentAyat(parseInt(e.target.value));
              document.getElementById(`id-${e.target.value}`).scrollIntoView();

            }}>

              {allAyat.ayahs.map((ayat) => {
                return (
                  <option key={`option-${ayat.number}`} value={ayat.number}>{`Ayat ${ayat.numberInSurah}`}</option>
                )
              })}
            </select>
            <audio ref={quranAudioRef} id='quranAudio' key={`audio-${currentAyat}`} controls="controls" className="w-full h-5 text-sm p-0">
              <source src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${currentAyat}.mp3`} type="audio/mp3" />
            </audio>
          </div>
        )}

        {!currentAyat && (
          <small key={`small-${currentAyat}`} className="tracking-widest">
            Source Code : <a href="https://github.com/rizkyzet/quran-app" className='underline' target="_blank" rel='noreferrer'>Github</a> @ 2022
          </small>
        )}

      </footer>
    </div>
  );
}

export default App;
