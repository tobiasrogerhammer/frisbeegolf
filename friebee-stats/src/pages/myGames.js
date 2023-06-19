import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import styles from "../css/myGames.module.css";

const PreviousGames = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchPreviousGames = async () => {
      try {
        const username = sessionStorage.getItem("username");
        const response = await axios.get(`http://localhost:5000/game/${username}`);
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
  }

  const renderGraphs = () => {
    return games.map((game) => {
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
            borderColor: "green",
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
  
      return (
        <div key={game.id} className={styles.gameContainer}>
          <h3>Game ID: {game.id}</h3>
          <p>Location: {game.location}</p>
          <p>Start Time: {formatDate(game.startTime)}</p>
          <p>End Time: {formatDate(game.endTime)}</p>
          <Line data={data} options={options} />
        </div>
      );
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <div className={styles.navbar}>
        <button className={styles.logout} onClick={logout}>Log out</button>
        <h1 className={styles.title}>Frisbee Golf</h1>
        <div className={styles.myGames}><a href="./onePlayer">Ny runde</a></div>
      </div>
      <h1>Previous Games</h1>
      {games.length === 0 ? (
        <p>No previous games found.</p>
      ) : (
        <div className={styles.graphContainer}>
          {renderGraphs()}
        </div>
      )}
    </div>
  );
};

export default PreviousGames;
