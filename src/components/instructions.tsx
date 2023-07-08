import { FC } from "react";

const Instructions: FC = () => {
  return (
    <>
      <p>
        This is the classic word game <i>Ghost</i>, the rules can be found{" "}
        <a href="https://en.wikipedia.org/wiki/Ghost_(game)">here.</a>
      </p>
      <p className="mb-3">
        {" "}
        <strong>A few things to note for this site:</strong>
      </p>
      <ul>
        <li>Four or more letters count as a word.</li>
        <li>
          If your opponent challenges you, you must supply a word of four or
          more letters.
        </li>
        <li>
          Words that begin with capital letters (i.e. proper nouns) do not count
          as valid words.
        </li>
        <li>
          45 letters is the maximum length allowed for a word. The player whose
          turn it is on move 45 automatically loses the round.
        </li>
      </ul>
    </>
  );
};

export default Instructions;
