interface GameInviteAttributes {
  invitee: string;
  inviter: string;
  roundTurns: string[][];
  turn: string;
}

interface Game extends GameInviteAttributes {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "playing" | "challenged" | "cancelled" | "completed";
  moves: string[];
  roundResults: Array<
    | "challenge successful"
    | "challenge unsuccessful"
    | "spelled word"
    | "reached 45 letters"
  >;
  winner: string;
  inviteeScores: string[];
  inviterScores: string[];
  roundWinners: string[];
  proposedWords: string[];
}

type EmitCallbackResponse = {
  updatedGame: Game | null;
  errorMsg: string;
};
