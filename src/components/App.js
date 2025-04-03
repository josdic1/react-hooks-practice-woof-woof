import { useState, useEffect } from 'react';

function App() {

  const [ pups, setPups ] = useState([])
  const [ goodDogs, setGoodDogs ] = useState(false)
  const [ selectedDog, setSelectedDog ] = useState({
    id: '',
    name: '',
    image: '',
    isGoodDog: false
  })

useEffect(() => {
  fetchPups()
},[])



const listToShow = goodDogs ? pups.filter(p => p.isGoodDog) : pups;


//pup header list
const pupData = listToShow.map(p => (
  <span key={p.id} onClick={() => onPupClick(p)}>{p.name}</span>
))

const onPupClick = (pup) => {
  setSelectedDog(pup); 
};

let dogDisplay = null;
if (selectedDog && selectedDog.id) {
  dogDisplay = (
    <>
      <img src={selectedDog.image} alt={selectedDog.name} />
      <h2>{selectedDog.name}</h2>
      <button onClick={onGoodBadToggle}>{selectedDog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
    </>
  );
}

async function onGoodBadToggle() {
  try {
  const updatedPup = {
    ...selectedDog,
    isGoodDog: !selectedDog.isGoodDog
  }
  const r = await fetch(`http://localhost:3001/pups/${updatedPup.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(updatedPup)
  })
  if(!r.ok) {
    throw new Error("💥 Error");
    }
    const data = await r.json()
    const updatedList = pups.map(p => (
      p.id === data.id ? data : p
    ))
    setPups(updatedList)
    setSelectedDog(data);
}catch (error) {console.error("❌ Caught error:", error)
}}

async function fetchPups() {
  try {
    const r = await fetch(`http://localhost:3001/pups`)
    if(!r.ok) {
      throw new Error("💥 Error");
    }
    const data = await r.json()
    setPups(data)

  }catch (error) {console.error("❌ Caught error:", error);}
}

  return (
    <div className="App">
        <div id="filter-div">
        <button id="good-dog-filter" onClick={() => setGoodDogs(!goodDogs)}>Filter good dogs: {goodDogs ? "ON" : "OFF"}</button>
      </div>
      <div id="dog-bar">{pupData}</div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <div id="dog-info">{dogDisplay}</div> 
      </div>
    
    </div>
  );
}

export default App;
