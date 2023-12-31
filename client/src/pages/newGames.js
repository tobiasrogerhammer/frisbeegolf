import React, { useState } from "react";
import "chart.js";
import axios from "axios";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import {
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";
import styles from "../css/newGames.module.css";

Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

const getInitialScores = (holeCount, parData) => {
  const scores = [];
  for (let i = 0; i < holeCount; i++) {
    scores.push(parData[i]); // Set the initial scores to the corresponding par values
  }
  return scores;
};

const NewGames = () => {
  const [games, setGames] = useState([]); // State to store the list of games
  const [currentGame, setCurrentGame] = useState(null); // State to track the current game
  const [currentHole, setCurrentHole] = useState(0); // State to track the current hole
  const [currentLocation, setCurrentLocation] = useState("Langhus"); // State to track the current location
  const [isGameSaved, setIsGameSaved] = useState(false);

  const addGame = (location) => {
    const username = sessionStorage.getItem("username"); // Retrieve the username from sessionStorage

    const newGame = {
      id: games.length + 1,
      location: location,
      parData: [], // Update the parData based on the selected location
      userScores: [], // Initialize userScores as an empty array
      startTime: new Date().toISOString(),
      endTime: "", // Initialize the endTime property
      username: username, // Add the username to the new game object
    };

    newGame.endTime = new Date().toISOString(); // Set the endTime to the current date and time
    setGames([...games, newGame]);

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

    setCurrentGame(null);
    setIsGameSaved(false);
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

  const handleSaveGame = () => {
    if (currentGame) {
      const updatedGames = games.map((game) => {
        if (game.id === currentGame) {
          return { ...game, endTime: new Date().toISOString() };
        }
        return game;
      });
      setGames(updatedGames);
      setIsGameSaved(true);

      const savedGame = updatedGames.find((game) => game.id === currentGame);
      const gameData = {
        username: savedGame.username,
        startTime: savedGame.startTime,
        endTime: savedGame.endTime,
        userScores: savedGame.userScores,
        parData: savedGame.parData,
        location: savedGame.location, // Include the location in the gameData object
        id: savedGame.id,
      };

      axios
        .post("https://freesbeegolf.onrender.com/game/create", gameData)
        .then((response) => {
          console.log("Game saved successfully:", response.data);
          // Optionally, you can perform additional actions upon successful save
        })
        .catch((error) => {
          console.error("Error saving game:", error);
          // Optionally, you can handle errors or display an error message
        });
    }
  };

  function logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isAdmin");
    window.location.href = "./signup";
  }

  return (
    <div>
      <div className={styles.navbar}>
        <button className={styles.logout} onClick={logout}>
          Log out
        </button>
        <h1 className={styles.title}> Frisbee Golf</h1>
        <div className={styles.myGames}>
          <a href="./previousGames">Mine runder</a>
        </div>
      </div>
      {games.map((game) => (
        <div key={game.id} className={styles.gameContainer}>
          <h2>Today At {game.location}</h2>
          {currentGame !== game.id && (
            <button
              className={styles.selectGameBtn}
              onClick={() => selectGame(game.id)}
            >
              Start Game
            </button>
          )}

          <div className={styles.totalPar}>
            Total Par: {game.parData.reduce((acc, score) => acc + score, 0)}
          </div>
          <div className={styles.totalScore}>
            Your Score: {game.userScores.reduce((acc, score) => acc + score, 0)}
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
          {currentGame && (
            <button className={styles.saveGameBtn} onClick={handleSaveGame}>
              Save Game
            </button>
          )}
          {isGameSaved && <div>Game saved successfully!</div>}
        </div>
      ))}
      <div className="selectGames">
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

export default NewGames;
