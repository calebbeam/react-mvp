import "./index.css";
import Result from "./Result.jsx";
import React, { useState, useRef, useEffect } from "react";

function App() {
  const [gender, setGender] = useState("");
  const [bodyWeight, setBodyWeight] = useState(0);
  const [squat, setSquat] = useState(0);
  const [bench, setBench] = useState(0);
  const [deadlift, setDeadlift] = useState(0);
  const [event, setEvent] = useState("");
  const [lifterData, setlifterData] = useState([]); // setting result state to an object of all the lifters in the db

  // const resultRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/powerlifters");
        const data = await response.json();
        setlifterData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
  }, [lifterData]);

  function handleCheckboxClickGender(event) {
    const checkboxName = event.target.name;

    if (checkboxName === "male") {
      document.getElementById("femaleCheckbox").checked = false;
      setGender("male");
    } else if (checkboxName === "female") {
      document.getElementById("maleCheckbox").checked = false;
      setGender("female");
    }
  }

  function handleCheckboxClickEvent(event) {
    const checkboxName = event.target.name;

    if (checkboxName === "equipped") {
      setEvent("equipped");
      document.getElementById("rawCheckbox").checked = false;
    } else if (checkboxName === "raw") {
      setEvent("raw");
      document.getElementById("equippedCheckbox").checked = false;
    }
  }

  async function submitInfo() {
    const resultState = {
      gender,
      bodyWeight,
      squat,
      bench,
      deadlift,
      isEquipped: event=='equipped',
    };
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(resultState)
    }
    const postData= await fetch(`http://localhost:5000/api/powerlifters `,options)
    const response = await postData.json();
    setlifterData([...lifterData, response])
   }

  const deletePost = async (value)=>{
    const options = {
      method: 'DELETE',
    }
    let id = value.id
    const deleteData= await fetch(`http://localhost:5000/api/powerlifters/${id}`, options )
    let newContainer = lifterData.filter(element=>element.id != id);
    setlifterData(newContainer);
  }
  return (
    <>
      <div className="container">
        <div className="inputs">
          <h2>Calculate Scores</h2>
          <div className="gender">
            Gender
            <p className="genderSelect">
              <label>
                Male
                <input
                  type="checkbox"
                  id="maleCheckbox"
                  name="male"
                  defaultChecked={gender === "male"}
                  onChange={handleCheckboxClickGender}
                />
              </label>
              <label>
                Female
                <input
                  type="checkbox"
                  id="femaleCheckbox"
                  name="female"
                  defaultChecked={gender === "female"}
                  onChange={handleCheckboxClickGender}
                />
              </label>
            </p>
          </div>
          <div className="weight">
            <label>
              Body Weight:
              <input
                type="number"
                value={bodyWeight}
                onChange={(e) => setBodyWeight(e.target.value)}
              />
            </label>
            <label>
              Squat:
              <input
                type="number"
                value={squat}
                onChange={(e) => setSquat(e.target.value)}
              />
            </label>
            <label>
              Bench:
              <input
                type="number"
                value={bench}
                onChange={(e) => setBench(e.target.value)}
              />
            </label>
            <label>
              Deadlift:
              <input
                type="number"
                value={deadlift}
                onChange={(e) => setDeadlift(e.target.value)}
              />
            </label>
          </div>
          <div className="event">
            Event
            <p className="eventSelect">
              <label>
                Equipped
                <input
                  type="checkbox"
                  name="equipped"
                  id="equippedCheckbox"
                  defaultChecked={event === "equipped"}
                  onChange={handleCheckboxClickEvent}
                />
              </label>
              <label>
                Raw
                <input
                  type="checkbox"
                  name="raw"
                  id="rawCheckbox"
                  defaultChecked={event === "raw"}
                  onChange={handleCheckboxClickEvent}
                />
              </label>
            </p>
          </div>
          <button className="submitButton" onClick={submitInfo}>
            Submit
          </button>
        </div>

        {lifterData.length==0? null :<Result lifterData={lifterData} deletePost= {deletePost}/>}
      </div>
    </>
  );
}

export default App;
