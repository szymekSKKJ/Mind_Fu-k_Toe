import { Dispatch, SetStateAction, useContext } from "react";
import "./MiniBoard.scss";
import { CurrentMoveContext } from "../MainBoardTutorial";

export const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const checkIfIsWin = (board: { figure: string | null }[]) => {
  return winCombinations.find((winCombination) => {
    let initialFigure: string = "";
    const isWin = winCombination.every((fieldIndex) => {
      initialFigure = initialFigure === "" && board[fieldIndex].figure !== null ? board[fieldIndex].figure! : initialFigure;
      return initialFigure === board[fieldIndex].figure;
    });

    return isWin;
  });
};

export const checkIfDraw = (board: { figure: string | null }[]) => {
  return board.every((field) => field.figure !== null);
};

interface miniBoardProps {
  setMiniBoard: (id: number, miniBoardCurrent: { figure: string | null }[], miniBoardChoosenFieldIndex: number, isWin: boolean, isDraw: boolean) => void;
  id: number;
  board: { figure: string | null }[];
  isActive: boolean;
  won: string | null;
  globalWin: number[];
  setCurrentStep: Dispatch<SetStateAction<number>>;
  currentStep: number;
}

const MiniBoard = ({ setMiniBoard, id, board, isActive, won, globalWin, setCurrentStep, currentStep }: miniBoardProps) => {
  const [currentMove, setCurrentMove] = useContext(CurrentMoveContext);

  const miniBoard: { id: number; board: { figure: string | null }[] } = {
    id: id,
    board: structuredClone(board),
  };

  return (
    <div className="mini-board-tutorial">
      {miniBoard.board.map((field, index) => {
        const { figure } = field;
        return (
          <div
            className="field"
            key={index}
            onClick={(event) => {
              if (isActive && figure === null && won === null && globalWin.length === 0) {
                if (currentStep === 5) {
                  if (index === 1) {
                    const fieldElement = event.currentTarget as HTMLDivElement;
                    fieldElement.classList.remove("incorrect");
                    const { board } = miniBoard;

                    board[index].figure = currentMove;

                    const isWin = checkIfIsWin(board) ? true : false;

                    const isDraw = isWin === false ? checkIfDraw(board) : false;

                    setCurrentMove((currentValue) => (currentValue === "x" ? "o" : "x"));
                    setCurrentStep((currentValue) => currentValue + 1);
                    setMiniBoard(id, board, index, isWin, isDraw);
                  } else {
                    const fieldElement = event.currentTarget.parentElement?.querySelectorAll(".field")[1] as HTMLDivElement;
                    fieldElement.classList.add("incorrect");
                  }
                } else {
                  const { board } = miniBoard;

                  board[index].figure = currentMove;

                  const isWin = checkIfIsWin(board) ? true : false;

                  const isDraw = isWin === false ? checkIfDraw(board) : false;

                  setCurrentMove((currentValue) => (currentValue === "x" ? "o" : "x"));
                  setCurrentStep((currentValue) => currentValue + 1);
                  setMiniBoard(id, board, index, isWin, isDraw);
                }
              }
            }}>
            {figure === "x" ? <i className="fa-regular fa-xmark"></i> : figure === "o" ? <i className="fa-regular fa-circle"></i> : null}
          </div>
        );
      })}
    </div>
  );
};

export default MiniBoard;
