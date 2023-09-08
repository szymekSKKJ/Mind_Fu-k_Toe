import { Dispatch, SetStateAction, createContext, useEffect, useLayoutEffect, useState } from "react";
import "./MainBoardTutorial.scss";
import MiniBoard from "./MiniBoard/MiniBoard";
import { checkIfIsWin } from "./MiniBoard/MiniBoard";

export const CurrentMoveContext = createContext<[string, Dispatch<SetStateAction<string>>]>(["x", () => ""]);

interface mainBoardTutorialProps {
  setCurrentStep: Dispatch<SetStateAction<number>>;
  stateBoard: { id: number; isActive: boolean; won: string | null; board: { figure: string | null }[] }[] | null;
  currentStep: number;
}

const MainBoardTutorial = ({ setCurrentStep, stateBoard, currentStep }: mainBoardTutorialProps) => {
  const [board, setBoard] = useState<{ id: number; isActive: boolean; won: string | null; board: { figure: string | null }[] }[]>([
    {
      id: 1,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 2,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 3,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 4,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 5,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 6,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 7,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 8,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
    {
      id: 9,
      isActive: false,
      won: null,
      board: [
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
        { figure: null },
      ],
    },
  ]);
  const [currentMove, setCurrentMove] = useState("x");
  const [globalWin, setGlobalWin] = useState<number[]>([]);
  const [choosenTransformOrigin, setChoosenTransformOrigin] = useState("");

  const transformOriginsBindedWithMiniBoardId = [
    {
      id: 1,
      transformOrigin: "top left",
    },
    {
      id: 2,
      transformOrigin: "top center",
    },
    {
      id: 3,
      transformOrigin: "top right",
    },
    {
      id: 4,
      transformOrigin: "center left",
    },
    {
      id: 5,
      transformOrigin: "center center",
    },
    {
      id: 6,
      transformOrigin: "center right",
    },
    {
      id: 7,
      transformOrigin: "left bottom",
    },
    {
      id: 8,
      transformOrigin: "center bottom",
    },
    {
      id: 9,
      transformOrigin: "right bottom",
    },
  ];

  const setMiniBoard = (id: number, miniBoardCurrent: { figure: string | null }[], miniBoardChoosenFieldIndex: number, isWin: boolean, isDraw: boolean) => {
    setBoard((currentValues) => {
      const copiedCurrentValues = [...currentValues];
      const foundMiniBoard = copiedCurrentValues.find((miniBoard) => miniBoard.id === id)!;

      copiedCurrentValues.forEach((miniBoard) => {
        miniBoard.isActive = false;
      });

      if (isWin) {
        foundMiniBoard.won = currentMove;
      }

      if (isDraw) {
        foundMiniBoard.won = "draw";
      }

      copiedCurrentValues.forEach((miniBoard, index, array) => {
        if (index === miniBoardChoosenFieldIndex) {
          if (miniBoard.won === null) {
            miniBoard.isActive = true;
          } else {
            const firstNotWonBoard = array.find((notWonBoard) => notWonBoard.won === null && notWonBoard.won !== "draw");
            if (firstNotWonBoard) {
              firstNotWonBoard.isActive = true;
            } else {
              console.log("koniec");
            }
          }
        }
      });

      foundMiniBoard.board = miniBoardCurrent;

      const foundTransformOrigin = transformOriginsBindedWithMiniBoardId.find((transformOrigin) => transformOrigin.id === miniBoardChoosenFieldIndex + 1)!;

      setChoosenTransformOrigin(foundTransformOrigin.transformOrigin);

      return copiedCurrentValues;
    });
  };

  useEffect(() => {
    const randomizedInitialBoardId = Math.floor(Math.random() * board.length) + 1;

    setBoard((currentValues) => {
      const copiedCurrentValues = [...currentValues];

      const foundMiniBoard = copiedCurrentValues.find((miniBoard) => miniBoard.id === randomizedInitialBoardId)!;
      const areAllMiniBoardsNotActive = copiedCurrentValues.every((miniBoard) => miniBoard.isActive === false);

      if (areAllMiniBoardsNotActive) {
        foundMiniBoard.isActive = true;

        const foundTransformOrigin = transformOriginsBindedWithMiniBoardId.find((transformOrigin) => transformOrigin.id === randomizedInitialBoardId)!;
        setChoosenTransformOrigin(foundTransformOrigin.transformOrigin);
      }

      return copiedCurrentValues;
    });
  }, []);

  useLayoutEffect(() => {
    const boardLocal = board.map((miniBoard) => {
      return { figure: miniBoard.won };
    });
    const winCombination = checkIfIsWin(boardLocal);

    if (winCombination && globalWin.length === 0) {
      setGlobalWin(winCombination);
      setCurrentMove((currentValue) => (currentValue === "x" ? "o" : "x"));
      setBoard((currentValues) => {
        const copiedCurrentValues = [...currentValues];

        copiedCurrentValues.forEach((miniBoard) => {
          miniBoard.isActive = false;
        });

        return copiedCurrentValues;
      });
    }
  }, [board]);

  useLayoutEffect(() => {
    if (stateBoard) {
      setBoard(stateBoard);
    } else {
      // Initial state
      setBoard([
        {
          id: 1,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 2,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 3,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 4,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 5,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 6,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 7,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 8,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
        {
          id: 9,
          isActive: false,
          won: null,
          board: [
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
            { figure: null },
          ],
        },
      ]);
      const randomizedInitialBoardId = Math.floor(Math.random() * board.length) + 1;

      setBoard((currentValues) => {
        const copiedCurrentValues = [...currentValues];

        const foundMiniBoard = copiedCurrentValues.find((miniBoard) => miniBoard.id === randomizedInitialBoardId)!;
        const areAllMiniBoardsNotActive = copiedCurrentValues.every((miniBoard) => miniBoard.isActive === false);

        if (areAllMiniBoardsNotActive) {
          foundMiniBoard.isActive = true;

          const foundTransformOrigin = transformOriginsBindedWithMiniBoardId.find((transformOrigin) => transformOrigin.id === randomizedInitialBoardId)!;
          setChoosenTransformOrigin(foundTransformOrigin.transformOrigin);
        }

        return copiedCurrentValues;
      });

      setGlobalWin([]);
    }
  }, [stateBoard]);

  return (
    <div className="main-board-wrapper-tutorial">
      <CurrentMoveContext.Provider value={[currentMove, setCurrentMove]}>
        <div className="mian-board-2-wrapper">
          <div className="main-board" style={{ transformOrigin: choosenTransformOrigin, transform: globalWin.length === 0 ? `scale(1)` : "scale(1)" }}>
            {board.map((miniBoard, index) => {
              const { id, board, isActive, won } = miniBoard;

              return (
                <div
                  className={`field ${isActive ? "active" : ""} ${won ? "won" : ""} ${globalWin.length !== 0 && globalWin.includes(index) ? "global-win" : ""}`}
                  key={id}>
                  <MiniBoard
                    currentStep={currentStep}
                    won={won}
                    globalWin={globalWin}
                    isActive={isActive}
                    setMiniBoard={setMiniBoard}
                    id={id}
                    board={board}
                    setCurrentStep={setCurrentStep}></MiniBoard>
                  {won !== null && (
                    <div className="won">
                      {won === "x" ? (
                        <i className="fa-regular fa-xmark"></i>
                      ) : won === "o" ? (
                        <i className="fa-sharp fa-regular fa-circle"></i>
                      ) : (
                        <div className="draw">
                          {/* <i className="fa-regular fa-xmark"></i> <span>/</span> <i className="fa-sharp fa-regular fa-circle"></i> */}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CurrentMoveContext.Provider>
    </div>
  );
};

export default MainBoardTutorial;
