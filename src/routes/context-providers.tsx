import { useEffect, useState, FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GamesContext } from "../contexts/gamesContext";
import { OpponentsContext } from "../contexts/opponentsContext";
import { TableLoadContext } from "../contexts/tableLoadContext";
import { socket } from "../socket";
import { getGamesState } from "../services/gameStateService";
import { getGames, getOpponents } from "../services/postService";
import handleError from "../util/error-handler";
import { Outlet, useNavigate } from "react-router-dom";

const ContextProviders: FC = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;
  const username: string | undefined = user && user[`${clientURL}/username`];
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [opponents, setOpponents] = useState<string[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  useEffect(() => {
    socket.connect();

    // const onConnect = () => {
    //   console.log(`${socket.id} connected`);
    // };

    // const onDisconnect = () => {
    //   console.log(`${socket.id} disconnected`);
    // }

    const onGameStateChange = async (updatedGame: Game): Promise<void> => {
      if (
        updatedGame.inviter === username ||
        updatedGame.invitee === username
      ) {
        const updatedGames = getGamesState(games, updatedGame);
        setGames(updatedGames);
      }
    };

    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);
    socket.on("gameStateClient", onGameStateChange);

    return () => {
      // socket.off("connect", onConnect);
      // socket.off("disconnect", onDisconnect);
      socket.off("gameStateClient", onGameStateChange);
      socket.disconnect();
    };
  }, [games]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      try {
        if (username) {
          setIsLoadingTable(true);
          const token = await getAccessTokenSilently();
          const fetchedGames = await getGames(username, token);
          const fetchedOpponents = await getOpponents(token, username);
          setGames(fetchedGames);
          setOpponents(fetchedOpponents);
          setIsLoadingTable(false);
        }
      } catch (err) {
        setIsLoadingTable(false);
        navigate("/error", {
          state: {
            error: handleError(err),
          },
        });
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <GamesContext.Provider
        value={{
          games,
          setGames,
        }}
      >
        <OpponentsContext.Provider
          value={{
            opponents,
            setOpponents,
          }}
        >
          <TableLoadContext.Provider
            value={{
              isLoadingTable,
              setIsLoadingTable,
            }}
          >
            <Outlet />
          </TableLoadContext.Provider>
        </OpponentsContext.Provider>
      </GamesContext.Provider>
    </>
  );
};

export default ContextProviders;
