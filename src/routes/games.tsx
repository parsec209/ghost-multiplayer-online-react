import { useContext, FC } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";
import { GamesContext, GamesContextType } from "../contexts/gamesContext";
import {
  TableLoadContext,
  TableLoadContextType,
} from "../contexts/tableLoadContext";
import { socket } from "../socket";
import { Link, useNavigate } from "react-router-dom";
import { getGamesState } from "../services/gameStateService";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

const Games: FC = () => {
  const { user } = useAuth0();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;
  const username: string | undefined = user && user[`${clientURL}/username`];
  const navigate = useNavigate();

  const { games, setGames } = useContext(GamesContext) as GamesContextType;
  const { isLoadingTable, setIsLoadingTable } = useContext(
    TableLoadContext
  ) as TableLoadContextType;

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "Action",
      headerClassName: "table-header",
      minWidth: 185,
      renderCell: (game) => getActionButton(game.value),
    },
    {
      field: "inviter",
      headerName: "Inviter",
      headerClassName: "table-header",
      minWidth: 185,
    },
    {
      field: "invitee",
      headerName: "Invitee",
      headerClassName: "table-header",
      minWidth: 185,
    },
    {
      field: "winner",
      headerName: "Winner",
      headerClassName: "table-header",
      minWidth: 185,
    },
    {
      field: "turn",
      headerName: "Turn",
      headerClassName: "table-header",
      minWidth: 185,
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "table-header",
      minWidth: 185,
    },
    {
      field: "createdAt",
      headerName: "Timestamp",
      headerClassName: "table-header",
      minWidth: 185,
    },
  ];

  const rows: GridRowsProp = games.map((game, index) => {
    return {
      id: index,
      action: game,
      inviter: game.inviter,
      invitee: game.invitee,
      winner: game.winner,
      turn: game.turn,
      status: game.status,
      createdAt: game.createdAt,
    };
  });

  const emitCallback = (err: Error, response: EmitCallbackResponse): void => {
    if (response && response.updatedGame) {
      const updatedGames = getGamesState(games, response.updatedGame);
      setGames(updatedGames);
      setIsLoadingTable(false);
    } else {
      const error = (response && response.errorMsg) || (err && err.message);
      setIsLoadingTable(false);
      navigate("/error", {
        state: {
          error,
        },
      });
    }
  };

  const acceptInvitation = (game: Game): void => {
    setIsLoadingTable(true);
    const gameToUpdate = { ...game };
    gameToUpdate.status = "playing";
    socket.timeout(15000).emit("gameStateServer", gameToUpdate, emitCallback);
  };

  const cancelInvitation = (game: Game): void => {
    setIsLoadingTable(true);
    const gameToUpdate = { ...game };
    gameToUpdate.status = "cancelled";
    socket.timeout(15000).emit("gameStateServer", gameToUpdate, emitCallback);
  };

  const getActionButton = (game: Game) => {
    return (
      (game.status === "pending" && game.inviter === username && (
        <Button
          size="sm"
          variant="danger"
          onClick={() => cancelInvitation(game)}
        >
          Cancel
        </Button>
      )) ||
      (game.status === "pending" && game.invitee === username && (
        <div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => acceptInvitation(game)}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => cancelInvitation(game)}
          >
            Decline
          </Button>
        </div>
      )) || <Link to={`/game/${game.id}`}>View game</Link>
    );
  };

  return (
    <>
      <small>
        <i>* Swipe horizontally if needed to see full table.</i>
      </small>
      <br />
      <small>
        <i>
          * Hover or tap column headers to show <strong>sort and filter</strong>{" "}
          icons.
        </i>
      </small>
      <br />
      <small>
        <i>
          * Set your game update{" "}
          <strong>
            <Link to={"/profile"}>email notifications</Link>
          </strong>
          .
        </i>
      </small>
      <br />
      <br />
      <div style={{ height: 400, width: "100%", backgroundColor: "white" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          loading={!games || isLoadingTable}
          disableRowSelectionOnClick
          initialState={{
            sorting: {
              sortModel: [{ field: "createdAt", sort: "desc" }],
            },
          }}
        />
      </div>
      <br />
      <Link to={`/opponents`}>See opponents list</Link>
    </>
  );
};

export default Games;
