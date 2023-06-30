import { useState, useContext, FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { GamesContext, GamesContextType } from "../contexts/gamesContext";
import {
  OpponentsContext,
  OpponentsContextType,
} from "../contexts/opponentsContext";
import {
  TableLoadContext,
  TableLoadContextType,
} from "../contexts/tableLoadContext";
import { socket } from "../socket";
import { getGamesState } from "../services/gameStateService";
import { getOpponents } from "../services/postService";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import handleError from "../util/error-handler";

const Opponents: FC = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently, user } = useAuth0();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;
  const username: string | undefined = user && user[`${clientURL}/username`];

  const { games, setGames } = useContext(GamesContext) as GamesContextType;

  const { isLoadingTable, setIsLoadingTable } = useContext(
    TableLoadContext
  ) as TableLoadContextType;

  const { opponents, setOpponents } = useContext(
    OpponentsContext
  ) as OpponentsContextType;

  const [alert, setAlert] = useState<{
    message: string;
    variant: string;
  } | null>(null);

  const [show, setShow] = useState<boolean>(false);

  const rows: GridRowsProp = opponents.map((opponent, index) => {
    return {
      id: index,
      opponents: opponent,
    };
  });

  const columns: GridColDef[] = [
    {
      field: "opponents",
      headerName: "Available opponents",
      flex: 1,
      renderCell: (opponent) => (
        <Button variant="link" onClick={() => sendInvitation(opponent.value)}>
          {opponent.value}
        </Button>
      ),
    },
  ];

  const reloadOpponents = async (): Promise<void> => {
    setIsLoadingTable(true);
    try {
      if (username) {
        const token = await getAccessTokenSilently();
        const fetchedOpponents = await getOpponents(token, username);
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
  };

  const sendInvitation = (opponent: string): void => {
    setIsLoadingTable(true);
    const players = [username!, opponent];
    const randomNumber = Math.floor(Math.random() * players.length);
    const firstPlayer = players[randomNumber];
    const secondPlayer = players[Math.abs(randomNumber - 1)];
    const newGame: GameInviteAttributes = {
      invitee: opponent,
      inviter: username!,
      roundTurns: [[firstPlayer, secondPlayer]],
      turn: firstPlayer,
    };
    if (
      games.some(
        (game) =>
          game.status !== "completed" &&
          (game.invitee === opponent || game.inviter === opponent)
      )
    ) {
      setAlert({
        message: `There is already a game or challenge pending with ${opponent}`,
        variant: "danger",
      });
      setShow(true);
      setIsLoadingTable(false);
      window.scrollTo(0, 0);
    } else {
      socket
        .timeout(15000)
        .emit(
          "gameStateServer",
          newGame,
          (err: Error, response: EmitCallbackResponse): void => {
            if (response && response.updatedGame) {
              const updatedGames = getGamesState(games, response.updatedGame);
              setGames(updatedGames);
              setAlert({
                message: `Challenge with ${opponent} created!`,
                variant: "success",
              });
              setShow(true);
              setIsLoadingTable(false);
              window.scrollTo(0, 0);
            } else {
              const error =
                (response && response.errorMsg) || (err && err.message);
              setIsLoadingTable(false);
              navigate("/error", {
                state: {
                  error,
                },
              });
            }
          }
        );
    }
  };

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        {show && alert && (
          <Alert
            variant={alert.variant}
            onClose={() => setShow(false)}
            dismissible
          >
            {alert.message}
          </Alert>
        )}
        <Button onClick={() => reloadOpponents()}>Refresh</Button>
        <br />
        <br />
        <small>
          <i>* Click user to send challenge</i>
        </small>
        <br />
        <br />
        <div style={{ height: 400, backgroundColor: "white" }}>
          <DataGrid
            columns={columns}
            rows={rows}
            loading={!opponents || isLoadingTable}
            disableRowSelectionOnClick
          />
        </div>
        <br />
        <Link to={`/games`}>See games</Link>
      </Col>
    </Row>
  );
};

export default Opponents;
