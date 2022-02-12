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

  const activeClass = 'font-bold tracking-wider px-2 text-white';
  const standartClass = 'tracking-wider px-2 text-white';



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



  const matchedBack = useMatch('/surat/:number', { path: location.pathname });



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
    <div className='app flex flex-col'>
      <header className='flex-none bg-gradient-to-r from-cyan-500 to-blue-500 rounded drop-shadow-md'>
        <nav className={`flex ${matchedBack ? 'justify-start' : 'justify-end'} p-2 text-center `}>
          {matchedBack && (
            <NavLink className={({ isActive }) =>
              isActive ? activeClass : standartClass
            } to="/">Back</NavLink>
          )}

          {location.pathname === '/' && (
            <input type="text" className='basis-1 px-2 outline-none outline-1 outline-offset-1 outline-gray-300 transition-all rounded-sm  focus:border-0 focus:border-white focus:outline focus:outline-offset-1 focus:outline-1 focus:outline-blue-300 ' value={searchKeyword} placeholder='search surah...' onChange={(event) => {
              setSearchKeyword(event.target.value)
              doSearchSurat(event.target.value)
            }} />
          )}
        </nav>
      </header>

      <section className='grow shrink overflow-y-scroll'>
        <Routes>
          <Route path="/" element={<Surat searchSurat={searchSurat} searchMode={searchMode} loading={loading} surat={surat} setCurrentAyat={setCurrentAyat} />} ></Route>
          <Route path="/surat/:number" element={<Ayat currentAyat={currentAyat} setCurrentAyat={setCurrentAyat} setAllAyat={setAllAyat} quranAudioRef={quranAudioRef} />} ></Route>
        </Routes>
      </section>


      <footer className='flext-none py-3 px-2 mt-auto text-center border-t-gray-100 border-t-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded'>

        {currentAyat && (
          <div className='flex gap-5'>
            <select value={currentAyat} className='text-slate-700 text-center' onChange={(e) => {
              setCurrentAyat(parseInt(e.target.value));
              document.getElementById(`id-${e.target.value}`).scrollIntoView();

            }}>

              {allAyat.ayahs.map((ayat) => {
                return (
                  <option key={`option-${ayat.number}`} value={ayat.number}>{ayat.numberInSurah}</option>
                )
              })}
            </select>
            <audio ref={quranAudioRef} id='quranAudio' key={`audio-${currentAyat}`} controls="controls" className="w-full h-5 text-sm p-0">
              <source src={`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${currentAyat}.mp3`} type="audio/mp3" />
            </audio>
          </div>
        )}

        {!currentAyat && (
          <small key={`small-${currentAyat}`}>
            Rizkyzet All Rights Reserved
          </small>
        )}

      </footer>
    </div>
  );
}

export default App;
