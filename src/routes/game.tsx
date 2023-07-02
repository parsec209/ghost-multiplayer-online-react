import { useState, useContext, FC, FormEvent } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GamesContext, GamesContextType } from "../contexts/gamesContext";
import { socket } from "../socket";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getGamesState } from "../services/gameStateService";
import { Button, Spinner, Form, Row, Col, Dropdown } from "react-bootstrap";

const Game: FC = () => {
  const { user } = useAuth0();
  const clientURL: string = import.meta.env.VITE_AUTH0_SPA_URL;
  const username: string | undefined = user && user[`${clientURL}/username`];
  const navigate = useNavigate();
  const { id } = useParams();

  const { games, setGames } = useContext(GamesContext) as GamesContextType;
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [letter, setLetter] = useState<string>("");
  const [proposedWord, setProposedWord] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const game: Game | undefined = games.filter(
    (game) => game.id && game.id.toString() === id
  )[0];

  const round: number | undefined =
    selectedRound === null ? game && game.roundTurns.length - 1 : selectedRound;

  const showPrevRoundLink: boolean =
    round &&
    round === game.roundTurns.length - 1 &&
    game.moves.length > 0 &&
    !game.moves[game.roundTurns.length - 1]
      ? true
      : false;

  let currentWord: string = (game && game.moves[game.moves.length - 1]) || "";

  const emitCallback = (err: Error, response: EmitCallbackResponse): void => {
    if (response && response.updatedGame) {
      const updatedGames = getGamesState(games, response.updatedGame);
      setGames(updatedGames);
      setLetter("");
      setIsLoading(false);
      setValidated(false);
    } else {
      const error = (response && response.errorMsg) || (err && err.message);
      navigate("/error", {
        state: {
          error,
        },
      });
    }
  };

  const challengeWord = async (): Promise<void> => {
    setIsLoading(true);
    const gameToUpdate = { ...game };
    gameToUpdate.status = "challenged";
    gameToUpdate.turn = game.inviter === username ? game.invitee : game.inviter;
    socket.timeout(15000).emit("gameStateServer", gameToUpdate, emitCallback);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);
    if (form.checkValidity() === true) {
      setIsLoading(true);
      const gameToUpdate = { ...game };
      if (gameToUpdate.status !== "challenged") {
        if (!gameToUpdate.moves[round]) {
          gameToUpdate.moves.push(letter);
        } else {
          gameToUpdate.moves[round] += letter;
        }
      } else {
        gameToUpdate.proposedWords.push(proposedWord);
      }
      socket.timeout(15000).emit("gameStateServer", gameToUpdate, emitCallback);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border"></Spinner>
      </div>
    );
  }

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }}>
        {game && (
          <div style={{ backgroundColor: "white" }} className="p-3">
            <Dropdown className="mb-3">
              <Dropdown.Toggle variant="info">View rounds</Dropdown.Toggle>
              <Dropdown.Menu>
                {game.roundTurns.map((_, i) => (
                  <Dropdown.Item key={i} onClick={() => setSelectedRound(i)}>
                    Round {i + 1}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {showPrevRoundLink && (
              <Button
                className="mb-3"
                variant="link"
                onClick={() => setSelectedRound(game.roundTurns.length - 2)}
              >
                See previous round details
              </Button>
            )}
            <h4 className="mb-3">Round {round + 1}</h4>
            <div className="mb-5 p-3 border border-secondary">
              <p>
                <strong>First player: </strong>
                {game.roundTurns[round][0]}
              </p>
              <h4
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {game.inviteeScores.length > 0 &&
                  game.inviterScores.length > 0 &&
                  (game.invitee === game.roundTurns[round][0]
                    ? game.inviteeScores[round] || game.inviteeScores[round - 1]
                    : game.inviterScores[round] ||
                      game.inviterScores[round - 1])}
              </h4>
              <br />
              <p>
                <strong>Second player: </strong>
                {game.roundTurns[round][1]}
              </p>
              <h4
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                {game.inviteeScores.length > 0 &&
                  game.inviterScores.length > 0 &&
                  (game.invitee === game.roundTurns[round][1]
                    ? game.inviteeScores[round] || game.inviteeScores[round - 1]
                    : game.inviterScores[round] ||
                      game.inviterScores[round - 1])}
              </h4>
            </div>
            {game.winner !== "N/A" &&
              round === game.moves.length - 1 &&
              (game.winner === username ? (
                <h4 className="mb-3 text-center">
                  <i style={{ color: "green" }}>You won!</i>
                </h4>
              ) : (
                <h4 className="mb-3 text-center">
                  <i style={{ color: "red" }}>Opponent won {":("}</i>
                </h4>
              ))}
            {game.roundResults[round] && (
              <p className="mb-3">
                <i>
                  <strong>Round result:</strong> {game.roundResults[round]}
                </i>
              </p>
            )}
            {game.proposedWords[round] && (
              <p className="mb-3">
                <i>
                  <strong>Proposed word:</strong> {game.proposedWords[round]}
                </i>
              </p>
            )}
            {game.roundWinners[round] && (
              <p className="mb-3">
                <i>
                  <strong>Round winner:</strong> {game.roundWinners[round]}
                </i>
              </p>
            )}
            {game.moves[round] ? (
              <div
                style={{ whiteSpace: "nowrap" }}
                className="p-3 mb-4 overflow-scroll"
              >
                {game.moves[round].split("").map((letter, i) => (
                  <div
                    key={i}
                    style={{ display: "inline-block" }}
                    className="fs-2 fw-bolder border border-secondary border-5 m-lg-2 p-lg-4 m-md-1 p-md-3 m-sm-1 p-sm-3 m-1 p-3"
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ) : (
              <h5 className="mb-3">No moves yet</h5>
            )}
            {!game.roundResults[round] ? (
              game.turn === username ? (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col xs="auto">
                      <p className="mb-3">
                        <i>Your turn</i>
                      </p>
                      {game.status !== "challenged" ? (
                        <div>
                          <Form.Group className="mb-5">
                            <Form.Control
                              required
                              pattern="[A-Za-z]{1}"
                              type="text"
                              value={letter}
                              onChange={(event) => {
                                setLetter(event.target.value.toLowerCase());
                              }}
                              placeholder="Enter letter"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please enter one letter
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Button
                            className="mb-3"
                            variant="warning"
                            onClick={challengeWord}
                            disabled={!game.moves[round] ? true : false}
                          >
                            Challenge word
                          </Button>
                        </div>
                      ) : (
                        <Form.Group className="mb-5">
                          <Form.Label style={{ color: "red" }}>
                            Opponent challenges you, enter your proposed word!
                          </Form.Label>
                          <Form.Control
                            required
                            pattern="[A-Za-z]{4,}"
                            maxLength={44}
                            type="text"
                            defaultValue={currentWord}
                            onChange={(event) => {
                              setProposedWord(
                                event.currentTarget.value.toLowerCase()
                              );
                            }}
                            placeholder="Enter proposed word"
                          />
                          <Form.Control.Feedback type="invalid">
                            Please enter a word between four and 44 letters,
                            inclusive.
                          </Form.Control.Feedback>
                        </Form.Group>
                      )}
                      <Button type="submit" size="lg">
                        Submit
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <div>
                  <p>
                    <i>Opponent's turn</i>
                  </p>
                  {game.status === "challenged" && (
                    <p style={{ color: "orange" }}>Challenge sent!</p>
                  )}
                </div>
              )
            ) : (
              <div>
                <Button
                  href="https://www.merriam-webster.com/"
                  size="sm"
                  variant="link"
                >
                  Merriam-Webster dictionary
                </Button>
              </div>
            )}
          </div>
        )}
        <br />
        <Link to={"/games"}>See games</Link>
        <br />
        <Link to={"/opponents"}>See opponents</Link>
      </Col>
    </Row>
  );
};

export default Game;
