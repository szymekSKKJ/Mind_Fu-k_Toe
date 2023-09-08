import { Dispatch, SetStateAction, createContext, useEffect, useRef, useState } from "react";
import "./MainBoard.scss";
import MiniBoard from "./MiniBoard/MiniBoard";

import { roomType } from "../Game/Game";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseInitialization";

export const CurrentMoveContext = createContext<[string | null, Dispatch<SetStateAction<string | null>>]>(["x", () => ""]);

const startTwoBotPlay = (board: { id: number; isActive: boolean; won: string | null; board: { figure: string | null }[] }[], boardElement: HTMLDivElement) => {
  const activeBoard = board.find((miniBoard) => miniBoard.isActive);

  if (activeBoard) {
    const emptyFieldsIndex: number[] = [];

    activeBoard.board.forEach((field, index) => {
      if (field.figure === null) {
        emptyFieldsIndex.push(index);
      }
    });

    const randomizedEmptyFieldIndex = emptyFieldsIndex[Math.floor(Math.random() * emptyFieldsIndex.length)];

    const indexOfActiveBoard = board.indexOf(activeBoard);

    const miniBoardFieldElement = boardElement.querySelectorAll(":scope > .field")[indexOfActiveBoard].querySelectorAll(".mini-board > .field")[
      randomizedEmptyFieldIndex
    ] as HTMLDivElement;

    setTimeout(() => {
      miniBoardFieldElement.click();
    }, 1000);
  }
};

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkIfIsWin = (board: { figure: string | null }[]) => {
  return winCombinations.find((winCombination) => {
    let initialFigure: string = "";
    const isWin = winCombination.every((fieldIndex) => {
      initialFigure = initialFigure === "" && board[fieldIndex].figure !== null ? board[fieldIndex].figure! : initialFigure;
      return initialFigure === board[fieldIndex].figure;
    });

    return isWin;
  });
};

const checkIfDraw = (board: { figure: string | null }[]) => {
  return board.every((field) => field.figure !== null);
};

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

export type miniBoardType = { id: number; isActive: boolean; won: string | null; board: { figure: string | null }[] };

interface mainBoardProps {
  botsPlaying?: boolean;
  gameMode: string; // Only "multiplayer" or "singleplayer"
  roomData?: roomType;
  gameDifficulty: string;
  setRoomData?: Dispatch<SetStateAction<roomType>>;
}

const MainBoard = ({ botsPlaying = false, gameMode, roomData, gameDifficulty, setRoomData }: mainBoardProps) => {
  const [board, setBoard] = useState<miniBoardType[]>([
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
  const [currentMove, setCurrentMove] = useState<string | null>(botsPlaying || gameMode === "singleplayer" ? "x" : null);
  const [globalWin, setGlobalWin] = useState<number[]>([]);
  const [choosenTransformOrigin, setChoosenTransformOrigin] = useState("");
  const [lastMove, setLastMove] = useState<{
    miniBoardId: number;
    fieldIndex: number;
    moveType: string;
  } | null>(null);

  const boardElementRef = useRef<null | HTMLDivElement>(null);

  const setMiniBoard = (id: number, miniBoardChoosenFieldIndex: number) => {
    setCurrentMove((currentValue) => (currentValue === "x" ? "o" : "x"));
    setBoard((currentValues) => {
      const copiedCurrentValues = [...currentValues];

      const foundMiniBoard = copiedCurrentValues.find((miniBoard) => miniBoard.id === id)!;

      foundMiniBoard.board[miniBoardChoosenFieldIndex].figure = currentMove;

      const isWin = checkIfIsWin(foundMiniBoard.board);

      const isDraw = checkIfDraw(foundMiniBoard.board);

      if (isWin) {
        foundMiniBoard.won = currentMove;
      }

      if (isDraw) {
        foundMiniBoard.won = "draw";
      }

      copiedCurrentValues.forEach((miniBoard) => {
        miniBoard.isActive = false;
      });

      const boardLocal = board.map((miniBoard) => {
        return { figure: miniBoard.won };
      });

      const winCombinationForMainBoard = checkIfIsWin(boardLocal);

      if (winCombinationForMainBoard) {
        setGlobalWin(winCombinationForMainBoard);

        copiedCurrentValues.forEach((miniBoard) => {
          miniBoard.isActive = false;
        });

        return copiedCurrentValues;
      } else {
        if ((roomData && roomData.lastMove?.moveType === currentMove) || roomData === undefined || roomData === null) {
          copiedCurrentValues.forEach((miniBoard, index, array) => {
            if (index === miniBoardChoosenFieldIndex) {
              if (miniBoard.won === null) {
                const foundTransformOrigin = transformOriginsBindedWithMiniBoardId.find(
                  (transformOrigin) => transformOrigin.id === miniBoardChoosenFieldIndex + 1
                )!;
                setChoosenTransformOrigin(foundTransformOrigin.transformOrigin);
                miniBoard.isActive = true;
              } else {
                const firstNotWonBoard = array.find((notWonBoard) => notWonBoard.won === null && notWonBoard.won !== "draw");
                if (firstNotWonBoard) {
                  const indexOfFirstNotWonBoard = array.indexOf(firstNotWonBoard);
                  setChoosenTransformOrigin(transformOriginsBindedWithMiniBoardId[indexOfFirstNotWonBoard].transformOrigin);
                  firstNotWonBoard.isActive = true;
                } else {
                  setGlobalWin([999, 999, 999]);
                }
              }
            }
          });
        }
        return copiedCurrentValues;
      }
    });
  };

  useEffect(() => {
    if (roomData?.lastMove) {
      setLastMove(roomData.lastMove);
    }
  }, [roomData]);

  useEffect(() => {
    if (lastMove && currentMove === lastMove.moveType) {
      const { miniBoardId, fieldIndex } = lastMove;

      setMiniBoard(miniBoardId, fieldIndex);
    }
  }, [lastMove]);

  useEffect(() => {
    if ((roomData?.currentUserMove && currentMove === null) || gameMode === "singleplayer") {
      setCurrentMove("x");
    }
  }, [roomData, gameMode]);

  useEffect(() => {
    // Start game after initializing

    const randomizedInitialMiniBoardId =
      roomData && roomData.randomizedInitialMiniBoardId && roomData.lastMove === undefined
        ? roomData.randomizedInitialMiniBoardId
        : gameMode === "singleplayer"
        ? Math.floor(Math.random() * board.length) + 1
        : null;

    if (randomizedInitialMiniBoardId) {
      setBoard((currentValues) => {
        const copiedCurrentValues = [...currentValues];

        const foundMiniBoard = copiedCurrentValues.find((miniBoard) => miniBoard.id === randomizedInitialMiniBoardId)!;
        const areAllMiniBoardsNotActive = copiedCurrentValues.every((miniBoard) => miniBoard.isActive === false);

        if (areAllMiniBoardsNotActive) {
          foundMiniBoard.isActive = true;

          const foundTransformOrigin = transformOriginsBindedWithMiniBoardId.find((transformOrigin) => transformOrigin.id === randomizedInitialMiniBoardId)!;
          setChoosenTransformOrigin(foundTransformOrigin.transformOrigin);
        }

        return copiedCurrentValues;
      });
    }
  }, [roomData, gameMode]);

  useEffect(() => {
    // Initilizing game

    const asyncWrapper = async () => {
      if (roomData && roomData.randomizedInitialMiniBoardId === null && roomData.currentUserMove === "x") {
        const randomizedInitialMiniBoardId = Math.floor(Math.random() * board.length) + 1;
        if (roomData) {
          await updateDoc(doc(db, "rooms", roomData!.id), {
            randomizedInitialMiniBoardId: randomizedInitialMiniBoardId,
          });
        }
      }
    };

    const timeout = setTimeout(() => {
      asyncWrapper();
    }, 10);

    return () => {
      clearTimeout(timeout);
    };
  }, [roomData, currentMove]);

  useEffect(() => {
    if (botsPlaying) {
      startTwoBotPlay(board, boardElementRef.current!);
    }
  }, [board]);

  useEffect(() => {
    // Reseting game
    if (roomData === null && gameMode === "multiplayer") {
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
      setCurrentMove("x");
      setGlobalWin([]);
      setChoosenTransformOrigin("");
      setLastMove(null);
      boardElementRef.current = null;
    }
  }, [roomData]);

  useEffect(() => {
    if (globalWin.length === 3) {
      setRoomData &&
        setRoomData((currentValue) => {
          const copiedCurrentValue = { ...currentValue } as roomType;

          if (copiedCurrentValue) {
            copiedCurrentValue.isGameEnded = true;
          }

          return copiedCurrentValue;
        });
    }
  }, [globalWin]);

  return (
    <CurrentMoveContext.Provider value={[currentMove, setCurrentMove]}>
      <div className="main-board-wrapper-main">
        <div
          className="main-board"
          style={{
            transformOrigin: choosenTransformOrigin,
            transform: globalWin.length === 0 ? (gameDifficulty === "hard" ? `scale(3)` : "scale(1)") : "scale(1)",
          }}
          ref={boardElementRef}>
          {board.map((miniBoard, index) => {
            const { id, isActive, won } = miniBoard;
            return (
              <div
                className={`field ${isActive ? "active" : ""} ${won ? "won" : ""} ${globalWin.length !== 0 && globalWin.includes(index) ? "global-win" : ""}`}
                key={id}>
                <MiniBoard miniBoardData={miniBoard} roomData={roomData} globalWin={globalWin} setMiniBoard={setMiniBoard}></MiniBoard>
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
  );
};

export default MainBoard;
