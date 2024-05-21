import { useState, useEffect, useRef } from "react";
import pomoWork from "./assets/pomoWork.jpg";
import pomoBreak from "./assets/pomoBreak.jpg";
import phaseSound from "./assets/phaseSound.wav";
import "./App.css";

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workTime, setWorkTime] = useState(25 * 60 * 1000);
  const [workPhasesCompleted, setWorkPhasesCompleted] = useState(0);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60 * 1000);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60 * 1000);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [workTimeInput, setWorkTimeInput] = useState(workTime / (60 * 1000));
  const [shortBreakTimeInput, setShortBreakTimeInput] = useState(
    shortBreakTime / (60 * 1000)
  );
  const [longBreakTimeInput, setLongBreakTimeInput] = useState(
    longBreakTime / (60 * 1000)
  );
  const [longBreakIntervalInput, setLongBreakIntervalInput] =
    useState(longBreakInterval);
  const [phase, setPhase] = useState("work");
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prevElapsedTime) => {
          let totalTime;
          switch (phase) {
            case "work":
              totalTime = workTime;
              break;
            case "shortBreak":
              totalTime = shortBreakTime;
              break;
            case "longBreak":
              totalTime = longBreakTime;
              break;
            default:
              totalTime = workTime;
          }

          if (prevElapsedTime >= totalTime) {
            clearInterval(intervalRef.current);
            new Audio(phaseSound).play();

            // Switch to the next phase
            switch (phase) {
              case "work":
                setWorkPhasesCompleted((prevWorkPhasesCompleted) => {
                  if (prevWorkPhasesCompleted + 1 === longBreakInterval) {
                    setPhase("longBreak");
                    return 0; // reset workPhasesCompleted
                  } else {
                    setPhase("shortBreak");
                    return prevWorkPhasesCompleted + 1; // increment workPhasesCompleted
                  }
                });
                break;
              case "shortBreak":
                setPhase("work");
                break;
              case "longBreak":
                setPhase("work");
                break;
              default:
                setPhase("work");
            }

            return 0; // reset elapsedTime
          } else {
            return prevElapsedTime + 10;
          }
        });
      }, 10);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [
    isRunning,
    phase,
    workTime,
    shortBreakTime,
    longBreakTime,
    longBreakInterval,
    workPhasesCompleted,
  ]);

  function start() {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - elapsedTime;
    }
  }

  function pause() {
    if (isRunning) {
      setIsRunning(false);
    }
  }

  function reset() {
    setElapsedTime(0);
    setIsRunning(false);
    setPhase("work");
    setWorkPhasesCompleted(0);
  }

  function showPhaseStatus() {
    if (!isRunning) {
      if (elapsedTime === 0) {
        return "May your focus be as strong as Totoro's spirit. Happy working!";
      } else {
        return "Paused";
      }
    } else {
      switch (phase) {
        case "work":
          return "Work time";
        case "shortBreak":
          return "Short break time";
        case "longBreak":
          return "Long break time";
        default:
          return "";
      }
    }
  }

  function countdown() {
    let totalTime;
    switch (phase) {
      case "work":
        totalTime = workTime;
        break;
      case "shortBreak":
        totalTime = shortBreakTime;
        break;
      case "longBreak":
        totalTime = longBreakTime;
        break;
      default:
        totalTime = workTime;
    }

    let timeLeft = totalTime - elapsedTime;
    let minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    let seconds = Math.floor(timeLeft / 1000) % 60;

    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }

  function onChangeWorkTime(event) {
    setWorkTimeInput(event.target.value);
  }

  function onChangeShortBreakTime(event) {
    setShortBreakTimeInput(event.target.value);
  }

  function onChangeLongBreakTime(event) {
    setLongBreakTimeInput(event.target.value);
  }

  function onChangeLongBreakInterval(event) {
    setLongBreakIntervalInput(event.target.value);
  }

  function onClickApply() {
    if (workTimeInput > 60 || workTimeInput < 10) {
      alert("Work time should be between 10 and 60 minutes.");
      return;
    }

    if (shortBreakTimeInput > 15 || shortBreakTimeInput < 1) {
      alert("Short break time should be between 1 and 15 minutes.");
      return;
    }

    if (longBreakTimeInput > 30 || longBreakTimeInput < 5) {
      alert("Long break time should be between 5 and 30 minutes.");
      return;
    }

    if (longBreakIntervalInput > 8 || longBreakIntervalInput < 2) {
      alert("Long break interval should be between 2 and 8.");
      return;
    }

    setWorkTime(workTimeInput * 60 * 1000);
    setShortBreakTime(shortBreakTimeInput * 60 * 1000);
    setLongBreakTime(longBreakTimeInput * 60 * 1000);
    setLongBreakInterval(longBreakIntervalInput);
    reset();
  }

  return (
    <>
      <div className="min-h-screen bg-black flex flex-col justify-center items-center p-10">
        <h2 className="text-white text-2xl lg:text-4xl mb-16 lg:mb-24 text-center">
          {showPhaseStatus()}
        </h2>
        <div
          className="flex flex-col items-center px-10 py-20 bg-cover bg-no-repeat bg-center text-white lg:w-4/12 rounded-3xl text-center mb-16 lg:mb-26"
          style={{
            backgroundImage: `url(${phase === "work" ? pomoWork : pomoBreak})`,
          }}
        >
          <div className="mb-10">
            <h1 className="text-7xl mb-6 font-bold">{countdown()}</h1>
            <div className="flex gap-3">
              <button
                onClick={start}
                className="text-3xl font-semibold px-2 rounded-md transition duration-300 ease-in-out  hover:text-blue-700"
              >
                Start
              </button>
              <button
                onClick={pause}
                className="text-3xl font-semibold px-2 rounded-md transition duration-300 ease-in-out  hover:text-blue-700"
              >
                Pause
              </button>
              <button
                onClick={reset}
                className="text-3xl font-semibold px-2 rounded-md transition duration-300 ease-in-out  hover:text-blue-700"
              >
                Reset
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-semibold mb-4">Settings</h3>
            <div className="flex flex-col">
              <label htmlFor="workTime" className="text-2xl font-semibold">
                Work Time
              </label>
              <input
                type="number"
                id="workTime"
                value={workTimeInput}
                onChange={onChangeWorkTime}
                placeholder="25"
                className="text-slate-800 text-lg font-bold xl:px-20 text-center lg:text-2xl"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="shortBreakTime"
                className="text-2xl font-semibold"
              >
                Short Break Time
              </label>
              <input
                type="number"
                id="shortBreakTime"
                value={shortBreakTimeInput}
                onChange={onChangeShortBreakTime}
                placeholder="5"
                className="text-slate-800 text-lg font-bold xl:px-20 text-center lg:text-2xl"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="longBreakTime" className="text-2xl font-semibold">
                Long Break Time
              </label>
              <input
                type="number"
                id="longBreakTime"
                value={longBreakTimeInput}
                onChange={onChangeLongBreakTime}
                placeholder="15"
                className="text-slate-800 text-lg font-bold xl:px-20 text-center lg:text-2xl"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="longBreakInterval"
                className="text-2xl font-semibold"
              >
                Long Break Interval
              </label>
              <input
                type="number"
                id="longBreakInterval"
                value={longBreakIntervalInput}
                onChange={onChangeLongBreakInterval}
                placeholder="4"
                className="text-slate-800 text-lg font-bold xl:px-20 text-center lg:text-2xl"
              />
            </div>
            <button
              onClick={onClickApply}
              className="text-3xl font-semibold px-2 rounded-md transition duration-300 ease-in-out  hover:text-blue-700 mt-3"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
