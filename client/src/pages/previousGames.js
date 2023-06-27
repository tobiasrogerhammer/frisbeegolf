import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import styles from "../css/previousGames.module.css";

const PreviousGames = () => {
  const [games, setGames] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [averageScores, setAverageScores] = useState([]);

  useEffect(() => {
    const fetchPreviousGames = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const response = await axios.get(
          `https://freesbeegolf.onrender.com/game/${username}`
        );
        setGames(response.data);
      } catch (error) {
        console.error("Error fetching previous games:", error);
      }
    };

    fetchPreviousGames();
  }, []);

  function logout() {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("isAdmin");
    window.location.href = "./signup";
  }

  useEffect(() => {
    const calculateAverageScores = () => {
      const locations = Array.from(new Set(games.map((game) => game.location)));
      const averageScoresData = [];

      locations.forEach((location) => {
        const gamesAtLocation = games.filter(
          (game) => game.location === location
        );

        const numHoles = gamesAtLocation[0].userScores.length;
        const totalScores = Array(numHoles).fill(0);

        gamesAtLocation.forEach((game) => {
          game.userScores.forEach((score, index) => {
            totalScores[index] += score;
          });
        });

        const averageScoresAtLocation = totalScores.map(
          (totalScore) => totalScore / gamesAtLocation.length
        );

        const newGame = {
          location,
          averageScores: averageScoresAtLocation,
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

        averageScoresData.push(newGame);
      });

      setAverageScores(averageScoresData);
    };

    calculateAverageScores();
  }, [games]);

  const renderGraphs = (filteredGames) => {
    return filteredGames.map((game, index) => {
      const data = {
        labels: game.userScores.map((_, index) => `Hole ${index + 1}`),
        datasets: [
          {
            label: "User Scores",
            data: game.userScores,
            fill: false,
            borderColor: "blue",
            borderWidth: 1,
          },
          {
            label: "Par Scores",
            data: game.parData,
            fill: false,
            borderColor: "red",
            borderWidth: 1,
          },
        ],
      };

      const options = {
        scales: {
          y: {
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
      };

      const totalScore = game.userScores.reduce((sum, score) => sum + score, 0);

      return (
        <div key={`${game.id}-${index}`} className={styles.gameContainer}>
          <h3>
            {game.location} Round {game.id}
          </h3>
          <p>Start Time: {formatDate(game.startTime)}</p>
          <p>End Time: {formatDate(game.endTime)}</p>
          <p>Total Score: {totalScore}</p>
          <Line data={data} options={options} />
        </div>
      );
    });
  };

  const renderAverageScoresGraph = (locationData) => {
    const filteredLocationData = locationData.filter((data) =>
      selectedLocation ? data.location === selectedLocation : true
    );

    return filteredLocationData.map((data, index) => {
      const { location, averageScores, parData } = data;

      const chartData = {
        labels: averageScores.map((_, index) => `Hole ${index + 1}`),
        datasets: [
          {
            label: "Average Scores",
            data: averageScores,
            fill: false,
            borderColor: "green",
            borderWidth: 1,
          },
          {
            label: "Par Scores",
            data: parData,
            fill: false,
            borderColor: "red",
            borderWidth: 1,
          },
        ],
      };

      const options = {
        scales: {
          y: {
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
      };

      const compareWithPar = averageScores.map((score, index) => {
        const par = parData[index];
        const difference = score - par;
        return {
          hole: index + 1,
          score,
          par,
          difference,
        };
      });

      let totalPar = 0;
      let totalScore = 0;
      let totalDifference = 0;

      compareWithPar.forEach((data) => {
        totalPar += data.par;
        totalScore += data.score;
        totalDifference += data.difference;
      });

      return (
        <div key={index} className={styles.averageScoresContainer}>
          <h3>{location} Average Scores</h3>
          <Line data={chartData} options={options} />
          <table>
            <thead>
              <tr>
                <th>Hole</th>
                <th>Average Score</th>
                <th>Par</th>
                <th>Average Difference</th>
              </tr>
            </thead>
            <tbody>
              {compareWithPar.map((data) => (
                <tr key={data.hole}>
                  <td>{data.hole}</td>
                  <td>{data.score}</td>
                  <td>{data.par}</td>
                  <td>{data.difference}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>{totalScore}</td>
                <td>{totalPar}</td>
                <td>{totalDifference}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      );
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredGames = selectedLocation
    ? games.filter((game) => game.location === selectedLocation)
    : games;

  return (
    <div className={styles.container}>
      <div className="styles.navbar">
        <h1>Previous Games</h1>
        <button className={styles.logoutButton}>
          <a href="./newGames">Ny runde</a>
        </button>
      </div>
      <div className={styles.locationSelector}>
        <label htmlFor="location">Select Location:</label>
        <select
          id="location"
          name="location"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All</option>
          <option value="Langhus">Langhus</option>
          <option value="Ekeberg">Ekeberg</option>
          <option value="Myrvoll">Myrvoll</option>
        </select>
      </div>
      <div className={styles.averageScoresContainer}>
        {renderAverageScoresGraph(averageScores)}
      </div>
      <div className={styles.gamesContainer}>{renderGraphs(filteredGames)}</div>
      <button className={styles.logoutButton} onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default PreviousGames;
