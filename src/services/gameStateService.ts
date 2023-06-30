export const getGamesState = (games: Game[], updatedGame: Game): Game[] => {
  let updatedGames = [];

  if (updatedGame.status === "pending") {
    updatedGames = [...games, updatedGame];
  } else if (updatedGame.status === "cancelled") {
    updatedGames = games.filter(
      (existingGame) => existingGame.id !== updatedGame.id
    );
  } else {
    updatedGames = games.map((existingGame) => {
      if (existingGame.id === updatedGame.id) {
        return updatedGame;
      }
      return existingGame;
    });
  }

  return updatedGames;
};
