import React, { useState } from "react";
import "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import {
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";
import styles from "./frisbee.module.css";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

const getInitialScores = (holeCount, parData) => {
  const scores = [];
  for (let i = 0; i < holeCount; i++) {
    scores.push(parData[i]); // Set the initial scores to the corresponding par values
  }
  return scores;
};

const App = () => {
  const [games, setGames] = useState([]); // State to store the list of games
  const [currentGame, setCurrentGame] = useState(null); // State to track the current game
  const [currentHole, setCurrentHole] = useState(0); // State to track the current hole
  const [currentLocation, setCurrentLocation] = useState("Ekeberg"); // State to track the current location

  const addGame = (location) => {
    const newGame = {
      id: games.length + 1,
      location: location,
      parData: [], // Update the parData based on the selected location
      userScores: [], // Initialize userScores as an empty array
    };

    switch (location) {
      case "Langhus":
        newGame.parData = [
          3, 3, 4, 4, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        ]; // Example par data for Langhus
        break;
      case "Ekeberg":
        newGame.parData = [
          3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
        ]; // Example par data for Ekeberg
        break;
      case "Myrvoll":
        newGame.parData = [3, 3, 3, 3, 3, 3, 3, 3, 3]; // Example par data for Myrvoll
        break;
      default:
        break;
    }

    newGame.userScores = getInitialScores(
      newGame.parData.length,
      newGame.parData
    ); // Set the userScores to the corresponding par values

    setGames([...games, newGame]);
  };

  const handleScoreChange = (gameId, index, score) => {
    if (score < 1) {
      // If the score is lower than 1, display an error message or take appropriate action
      alert("Score cannot be lower than 1");
      return;
    }

    setGames((prevGames) => {
      const updatedGames = prevGames.map((game) => {
        if (game.id === gameId) {
          const updatedScores = [...game.userScores];
          updatedScores[index] = score;
          return { ...game, userScores: updatedScores };
        }
        return game;
      });
      return updatedGames;
    });
  };

  const handlePrevHole = () => {
    if (currentHole > 0) {
      setCurrentHole(currentHole - 1);
    }
  };

  const handleNextHole = () => {
    if (currentHole < 17) {
      setCurrentHole(currentHole + 1);
    }
  };

  const selectGame = (gameId) => {
    setCurrentGame(gameId);
    setCurrentHole(0);
  };

  return (
    <div>
      <h1 className={styles.title}>Ekeberg Frisbee Golf</h1>
      {games.map((game) => (
        <div key={game.id} className={styles.gameContainer}>
          <h2>
            Game {game.id} At {game.location}
          </h2>
          <button
            className={styles.selectGameBtn}
            onClick={() => selectGame(game.id)}
          >
            Select Game
          </button>
          <div className={styles.totalPar}>
            Total Par: {game.parData.reduce((acc, score) => acc + score, 0)}
          </div>
          <div className={styles.totalScore}>
            Total Score:{" "}
            {game.userScores.reduce((acc, score) => acc + score, 0)}
          </div>
          <Line
            data={{
              labels: game.parData.map((_, index) => `Hole ${index + 1}`),
              datasets: [
                {
                  label: "Par",
                  data: game.parData,
                  borderColor: "red",
                  borderWidth: 1,
                  fill: false,
                },
                {
                  label: "User",
                  data: game.userScores,
                  borderColor: "blue",
                  borderWidth: 1,
                  fill: false,
                },
              ],
            }}
            options={{
              scales: {
                y: {
                  type: "linear",
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Scores",
                  },
                  ticks: {
                    stepSize: 1,
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: "Holes",
                  },
                },
              },
            }}
          />
          <div className={styles.holeInfo}>
            <button
              className={styles.prevHoleBtn}
              onClick={handlePrevHole}
              disabled={currentHole === 0}
            >
              Previous Hole
            </button>
            <button
              className={styles.nextHoleBtn}
              onClick={handleNextHole}
              disabled={currentHole === 17}
            >
              Next Hole
            </button>
          </div>
          {currentGame && (
            <div>
              <h3 className={styles.updateScoreTitle}>
                Score for hole: {currentHole + 1}
              </h3>
              <input
                type="number"
                value={games[currentGame - 1].userScores[currentHole]}
                onChange={(e) =>
                  handleScoreChange(
                    currentGame,
                    currentHole,
                    parseInt(e.target.value)
                  )
                }
                className={styles.scoreInput}
              />
            </div>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="locationSelect" className={styles.label}>
          New game at{" "}
        </label>
        <select
          id="locationSelect"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className={styles.select}
        >
          <option value="Langhus">Langhus</option>
          <option value="Ekeberg">Ekeberg</option>
          <option value="Myrvoll">Myrvoll</option>
        </select>
      </div>
      <button
        className={styles.addGameBtn}
        onClick={() => addGame(currentLocation)}
      >
        Create Game
      </button>
    </div>
  );
};

export default App;
