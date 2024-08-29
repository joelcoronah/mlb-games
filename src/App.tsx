import React, { useState, useEffect } from "react";
import axios from "axios";

interface Team {
  id: number;
  name: string;
}

interface GameTeam {
  leagueRecord: {
    wins: number;
    losses: number;
    pct: string;
  };
  score?: number;
  team: Team;
  isWinner?: boolean;
}

interface Game {
  gamePk: number;
  status: {
    abstractGameState: string;
    detailedState: string;
  };
  teams: {
    away: GameTeam;
    home: GameTeam;
  };
  venue: {
    name: string;
  };
}

interface ApiResponse {
  dates: [
    {
      games: Game[];
    }
  ];
}

const GameCard: React.FC<{ game: Game }> = ({ game }) => {
  const { teams, status, venue } = game;
  const { away, home } = teams;

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span className="text-gray-300">{away.team.name}</span>
        </div>
        <span className="text-white font-bold">{away.score ?? "-"}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-gray-300">{home.team.name}</span>
        </div>
        <span className="text-white font-bold">{home.score ?? "-"}</span>
      </div>
      <div className="mt-2 text-center text-sm text-gray-500">
        {status.detailedState} - {venue.name}
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md animate-pulse">
    <div className="flex justify-between items-center mb-2">
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-600 rounded w-8"></div>
    </div>
    <div className="flex justify-between items-center mb-2">
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      <div className="h-4 bg-gray-600 rounded w-8"></div>
    </div>
    <div className="mt-2 h-4 bg-gray-600 rounded w-3/4 mx-auto"></div>
  </div>
);

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          "http://localhost:3000/schedules"
        );
        setGames(response.data.dates[0].games);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Today's MLB Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : games.map((game) => <GameCard key={game.gamePk} game={game} />)}
      </div>
    </div>
  );
}

export default App;
