import './App.css';

import { useEffect, useRef, useState } from 'react';
import { NavLink, Routes, Route, useLocation, useMatch } from 'react-router-dom';
import Surat from './pages/Surat';
import Ayat from './pages/Ayat';
import SavedAyat from './pages/SavedAyat';


function App() {


  const location = useLocation();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchSurat, setSearchSurat] = useState([]);
  const [searchMode, setSearchMode] = useState(false);

  const [searchKeywordSavedAyat, setSearchKeywordSavedAyat] = useState('');
  const [searchSavedAyat, setSearchSavedAyat] = useState([]);
  const [searchSavedAyatMode, setSearchSavedAyatMode] = useState(false);

  const [surat, setSurat] = useState([]);
  const [savedAyat, setSavedAyat] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentAyat, setCurrentAyat] = useState('');
  const [allAyat, setAllAyat] = useState({});
  const quranAudioRef = useRef(null);

  const activeClass = 'tracking-wider px-2 text-white bg-white text-blue-500 rounded text-sm pointer-events-none';
  const standartClass = 'tracking-wider text-sm text-white hover:bg-white hover:text-blue-500 rounded px-2';



  useEffect(() => {
    const storage = localStorage.getItem('savedAyat');

    if (!storage) {
      const emptyArray = JSON.stringify([], null, 1);
      localStorage.setItem("savedAyat", emptyArray);
    }

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





  const matchedAyat = useMatch('/surat/:number/:ayat', { path: location.pathname });
  const matchedSavedAyat = useMatch('/save-ayat', { path: location.pathname });


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

  const deleteSavedAyat = (index, idAyat) => {
    const data = JSON.parse(localStorage.getItem('savedAyat'));

    if (!searchSavedAyatMode) {

      data.splice(index, 1);

      setSavedAyat([...data]);

      if (parseInt(idAyat) === currentAyat) {
        setCurrentAyat('');
      }

      localStorage.setItem('savedAyat', JSON.stringify(data, null, 2));

    } else {

      const newData = data.filter((val) => {
        return val.idAyat !== idAyat
      });


      const searchData = newData.filter((ayat) => {
        const string = `${ayat.englishName} (${ayat.numberInSurah})`;
        return string.toLocaleLowerCase().includes(searchKeywordSavedAyat.toLowerCase());
      })


      localStorage.setItem('savedAyat', JSON.stringify(newData, null, 2));
      setSavedAyat([...newData]);
      setSearchSavedAyat([...searchData]);

      if (parseInt(idAyat) === currentAyat) {
        setCurrentAyat('');
      }


    }


  }


  const doSearchSavedAyat = (searchKey) => {

    if (searchKey === '') {
      return setSearchSavedAyatMode(false);
    }

    setSearchSavedAyatMode(true);
    const searchData = savedAyat.filter((ayat) => {
      const string = `${ayat.englishName} (${ayat.numberInSurah}) `;
      return string.toLocaleLowerCase().includes(searchKey.toLowerCase()) || ayat.arti.includes(searchKey);
      // return surat.englishName.toLowerCase() === searchKey.toLowerCase();
    })

    setSearchSavedAyat([...searchData]);

  }

  return (
    <div className='app flex flex-col relative'>
      <header className='flex-none bg-gradient-to-r from-blue-400 to-blue-500 drop-shadow-md sticky'>
        <nav className={`flex ${matchedAyat ? 'justify-between' : 'justify-between'} p-2 text-center `}>

          {matchedAyat && (
            <>
              <div className='flex justify-start gap-1 items-center'>
                <NavLink className={({ isActive }) =>
                  isActive ? activeClass : standartClass
                } to="/" onClick={()=>{
                  setSearchMode(false)
                  setSearchKeyword('');
                }}>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg> */}
                  Surat
                </NavLink>

                <NavLink className={({ isActive }) =>
                  isActive ? activeClass : standartClass
                } to="/save-ayat" onClick={() => {
                  setSearchSavedAyatMode(false);
                  setSearchKeywordSavedAyat('');
                }}>
                  My Ayat
                </NavLink>
              </div>

              <div className='flex gap-2'>
                <h1 className='text-md tracking-wider text-blue-500 bg-white rounded px-2 text-sm pointer-events-none'>
                  {allAyat.englishName}
                </h1>

                {
                  !matchedSavedAyat && (
                    Object.keys(allAyat).length !== 0 && (
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
                    )
                  )
                }
              </div>

            </>
          )}


          {matchedSavedAyat && (

            <>
              <div className='flex justify-start gap-1 items-center'>
                <NavLink className={({ isActive }) =>
                  isActive ? activeClass : standartClass
                } to="/" onClick={()=>{
                  setSearchMode(false)
                  setSearchKeyword('');
                }}>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg> */}
                  Surat
                </NavLink>

                <NavLink className={({ isActive }) =>
                  isActive ? activeClass : standartClass
                } to="/save-ayat" onClick={() => {
                  setSearchSavedAyatMode(false);
                  setSearchKeywordSavedAyat('');
                }}>
                  My Ayat
                </NavLink>
              </div>

              <input type="text" className='basis-1 px-2 text-md transition-all rounded-sm focus:outline-none' value={searchKeywordSavedAyat} placeholder='search saved ayat...' onChange={(event) => {
                setSearchKeywordSavedAyat(event.target.value)
                doSearchSavedAyat(event.target.value)
              }} />
            </>


          )}



          {location.pathname === '/' && (
            <>
              <div className='flex justify-start gap-1 items-center'>
                <NavLink className={({ isActive }) =>
                  isActive ? activeClass : standartClass
                } to="/" onClick={()=>{
                  setSearchMode(false)
                  setSearchKeyword('');
                }}>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg> */}
                  Surat
                </NavLink>

                <NavLink className={({ isActive }) =>
                  isActive ? activeClass : standartClass
                } to="/save-ayat" onClick={() => {
                  setSearchSavedAyatMode(false);
                  setSearchKeywordSavedAyat('');
                }}>
                  My Ayat
                </NavLink>
              </div>
              <input type="text" className='basis-1 px-2 text-md transition-all rounded-sm focus:outline-none' value={searchKeyword} placeholder='search surah...' onChange={(event) => {
                setSearchKeyword(event.target.value)
                doSearchSurat(event.target.value)
              }} />
            </>
          )}


        </nav>
      </header>

      <section className='grow shrink overflow-y-auto'>
        <Routes>
          <Route path="/" element={<Surat searchSurat={searchSurat} searchMode={searchMode} loading={loading} surat={surat} setCurrentAyat={setCurrentAyat} />} ></Route>
          <Route path="/surat/:number/:ayat" element={<Ayat currentAyat={currentAyat} setCurrentAyat={setCurrentAyat} setAllAyat={setAllAyat} quranAudioRef={quranAudioRef} />} ></Route>
          <Route path="/save-ayat" element={<SavedAyat setCurrentAyat={setCurrentAyat} currentAyat={currentAyat} searchSavedAyat={searchSavedAyat} searchSavedAyatMode={searchSavedAyatMode} deleteSavedAyat={deleteSavedAyat} savedAyat={savedAyat} setSavedAyat={setSavedAyat} setSearchSavedAyatMode={setSearchSavedAyatMode} setSearchKeywordSavedAyat={setSearchKeywordSavedAyat} />} />
        </Routes>
      </section>


      <footer className='flext-none py-3 px-2  text-center shadow bg-gradient-to-r from-blue-400 to-blue-500 text-white sticky'>

        {currentAyat && (
          <div className='flex gap-5'>

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
