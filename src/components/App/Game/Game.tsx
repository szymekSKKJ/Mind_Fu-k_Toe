import "./Game.scss";
import MainBoard from "../MainBoard/MainBoard";
import Loader from "../../Global/Loader/Loader";
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState, useLayoutEffect } from "react";
import { Unsubscribe, addDoc, collection, doc, documentId, getDocs, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../../firebaseInitialization";
import Button from "../../Global/Button/Button";

export type roomType = {
  id: string;
  isGameStarted: boolean;
  currentUserMove: string;
  isGameAbandoned: boolean;
  isGameEnded: boolean;
  randomizedInitialMiniBoardId: number | null;
  lastMove?: {
    miniBoardId: number;
    fieldIndex: number;
    moveType: string;
  };
} | null;

const initializeGame = async (
  setRoomData: Dispatch<SetStateAction<roomType>>,
  unsubscribeListeningForJoinPlayer: MutableRefObject<Unsubscribe | null>,
  setPlayerId: Dispatch<SetStateAction<string | null>>,
  setIsGameStarted: Dispatch<SetStateAction<boolean>>
) => {
  const querySnapshot = await getDocs(query(collection(db, "rooms"), where("isOpen", "==", true)));

  if (querySnapshot.size === 0) {
    const freeMoves = ["o", "x"];

    const randomizedSymbolIndex = Math.floor(Math.random() * freeMoves.length);

    const randomizedMove = freeMoves[randomizedSymbolIndex];

    freeMoves.splice(randomizedSymbolIndex, 1);

    const roomDocRef = await addDoc(collection(db, "rooms"), {
      createdAt: serverTimestamp(),
      isOpen: true,
      freeMoves: freeMoves,
    });

    const playerDocRef = await addDoc(collection(db, "rooms", roomDocRef.id, "players"), {
      lastActive: serverTimestamp(),
      move: randomizedMove,
    });

    const updateRoomInterval = setInterval(async () => {
      await updateDoc(doc(db, "rooms", roomDocRef.id), {
        createdAt: serverTimestamp(),
      });
    }, 1000 * 10);

    const unsubscribe = onSnapshot(doc(db, "rooms", roomDocRef.id), (doc) => {
      const { isOpen, randomizedInitialMiniBoardId } = doc.data()!;

      if (isOpen === false && randomizedInitialMiniBoardId !== undefined) {
        setRoomData((currentValue) => {
          const copiedCurrentValue = { ...currentValue } as roomType;
          if (copiedCurrentValue) {
            copiedCurrentValue.randomizedInitialMiniBoardId = randomizedInitialMiniBoardId;
            copiedCurrentValue.isGameStarted = true;
          }
          return copiedCurrentValue;
        });
        setIsGameStarted(true);
        clearInterval(updateRoomInterval);
        unsubscribe();
      }
    });

    setPlayerId(playerDocRef.id);

    setRoomData({
      id: roomDocRef.id,
      isGameStarted: false,
      currentUserMove: randomizedMove,
      randomizedInitialMiniBoardId: null,
      isGameAbandoned: false,
      isGameEnded: false,
    });
  } else {
    const firstFoundRoomDocRef = querySnapshot.docs[0];

    const { freeMoves, createdAt } = firstFoundRoomDocRef.data();

    const createdAtDate = new Date(createdAt.seconds * 1000);

    const createdAtSeconds = createdAtDate.getTime() / 1000;

    const currentDateSeconds = new Date().getTime() / 1000;

    if (currentDateSeconds - createdAtSeconds > 20) {
      await updateDoc(doc(db, "rooms", firstFoundRoomDocRef.id), {
        isOpen: false,
        freeMoves: freeMoves,
      });

      initializeGame(setRoomData, unsubscribeListeningForJoinPlayer, setPlayerId, setIsGameStarted);
    } else {
      const move = structuredClone(freeMoves[0]);

      freeMoves.splice(freeMoves.indexOf(move), 1);

      if (freeMoves.length === 0) {
        await updateDoc(doc(db, "rooms", firstFoundRoomDocRef.id), {
          isOpen: false,
          freeMoves: freeMoves,
        });
      }

      const unsubscribe = onSnapshot(doc(db, "rooms", firstFoundRoomDocRef.id), (doc) => {
        const { isOpen, randomizedInitialMiniBoardId } = doc.data()!;

        if (isOpen === false && randomizedInitialMiniBoardId !== undefined) {
          setRoomData((currentValue) => {
            const copiedCurrentValue = { ...currentValue } as roomType;
            if (copiedCurrentValue) {
              copiedCurrentValue.randomizedInitialMiniBoardId = randomizedInitialMiniBoardId;
            }
            return copiedCurrentValue;
          });
          setIsGameStarted(true);
          unsubscribe();
        }
      });

      const playerDocRef = await addDoc(collection(db, "rooms", firstFoundRoomDocRef.id, "players"), {
        lastActive: serverTimestamp(),
        move: move,
      });

      setPlayerId(playerDocRef.id);

      setRoomData({
        id: firstFoundRoomDocRef.id,
        isGameStarted: true,
        currentUserMove: move,
        randomizedInitialMiniBoardId: null,
        isGameAbandoned: false,
        isGameEnded: false,
      });
    }
  }
};

const clearRoomData = (
  setRoomData: Dispatch<SetStateAction<roomType>>,
  setPlayerId: Dispatch<SetStateAction<null | string>>,
  setIsGameStarted: Dispatch<SetStateAction<boolean>>
) => {
  setRoomData(null);
  setPlayerId(null);
  setIsGameStarted(false);
};

interface gameProps {
  gameOptions: { difficulty: string | null; mode: string | null };
}

const Game = ({ gameOptions }: gameProps) => {
  const [roomData, setRoomData] = useState<roomType>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameStarting, setIsGameStarting] = useState(true);

  const unsubscribeListeningForJoinPlayer = useRef<null | Unsubscribe>(null);
  const listenerForRoomUnsubscribe = useRef<null | Unsubscribe>(null);
  const getUserActivityIntervalRef = useRef<null | ReturnType<typeof setInterval>>(null);
  const listeningForUserActivityUnsubscribe = useRef<null | Unsubscribe>(null);
  const snedUserActivityIntervalRef = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (gameOptions.mode === "multiplayer") {
      if (roomData === null) {
        const timeout = setTimeout(() => {
          initializeGame(setRoomData, unsubscribeListeningForJoinPlayer, setPlayerId, setIsGameStarted);
        }, 10);

        return () => {
          clearTimeout(timeout);
        };
      }

      return () => {
        if (unsubscribeListeningForJoinPlayer.current) {
          unsubscribeListeningForJoinPlayer.current();
        }
      };
    }
  }, [roomData]);

  useEffect(() => {
    if (gameOptions.mode === "multiplayer") {
      if (roomData && roomData.id && playerId) {
        const unsubscribe = onSnapshot(query(collection(db, "rooms", roomData.id, "players"), where(documentId(), "!=", playerId)), (querySnapshot) => {
          getUserActivityIntervalRef.current && clearInterval(getUserActivityIntervalRef.current);
          if (querySnapshot.metadata.hasPendingWrites === false) {
            getUserActivityIntervalRef.current = setInterval(() => {
              querySnapshot.forEach((doc) => {
                const { lastActive } = doc.data();

                const lastActiveDate = new Date(lastActive.seconds * 1000);

                const lastActiveDateSeconds = lastActiveDate.getTime() / 1000;

                const currentDateSeconds = new Date().getTime() / 1000;

                if (currentDateSeconds - lastActiveDateSeconds > 20) {
                  setRoomData((currentValue) => {
                    const copiedCurrentValue = { ...currentValue } as roomType;

                    if (copiedCurrentValue) {
                      copiedCurrentValue.isGameAbandoned = true;
                    }
                    return copiedCurrentValue;
                  });
                }
              });
            }, 1000 * 8);
          }
        });

        listeningForUserActivityUnsubscribe.current = unsubscribe;

        return () => {
          unsubscribe();
        };
      }
    }
  }, [roomData, playerId]);

  useEffect(() => {
    if (gameOptions.mode === "multiplayer") {
      if (roomData && roomData.id && playerId) {
        snedUserActivityIntervalRef.current = setInterval(async () => {
          await updateDoc(doc(db, "rooms", roomData.id, "players", playerId), {
            createdAt: serverTimestamp(),
          });
        }, 1000 * 5);

        return () => {
          snedUserActivityIntervalRef.current && clearInterval(snedUserActivityIntervalRef.current);
        };
      }
    }
  }, [playerId, roomData]);

  useEffect(() => {
    if (gameOptions.mode === "multiplayer") {
      if (roomData && (roomData.isGameAbandoned || roomData.isGameEnded)) {
        getUserActivityIntervalRef.current && clearInterval(getUserActivityIntervalRef.current);
        snedUserActivityIntervalRef.current && clearInterval(snedUserActivityIntervalRef.current);
        listeningForUserActivityUnsubscribe.current && listeningForUserActivityUnsubscribe.current();
        listenerForRoomUnsubscribe.current && listenerForRoomUnsubscribe.current();
      }
    }
  }, [roomData]);

  useLayoutEffect(() => {
    if (gameOptions.mode === "multiplayer") {
      if (roomData && roomData.isGameStarted && isGameStarted) {
        setTimeout(() => {
          setIsGameStarting(false);
        }, 2000);
        const unsubscribe = onSnapshot(doc(db, "rooms", roomData.id), (doc) => {
          const { lastMove } = doc.data()!;

          if (lastMove !== undefined) {
            setRoomData((currentValue) => {
              const copiedCurrentValue = { ...currentValue } as roomType;
              if (copiedCurrentValue) {
                copiedCurrentValue.lastMove = lastMove;
              }
              return copiedCurrentValue;
            });
          }
        });

        listenerForRoomUnsubscribe.current = unsubscribe;

        return () => {
          listenerForRoomUnsubscribe.current && listenerForRoomUnsubscribe.current();
        };
      }
    }
  }, [isGameStarted]);

  return (
    <div className="game">
      <div
        className={`main-board-wrapper ${
          (roomData?.isGameStarted && roomData.isGameAbandoned === false && roomData?.isGameEnded === false && isGameStarting === false) ||
          gameOptions.mode === "singleplayer"
            ? "started"
            : ""
        }`}>
        <MainBoard setRoomData={setRoomData} gameMode={gameOptions.mode!} gameDifficulty={gameOptions.difficulty!} roomData={roomData}></MainBoard>
        {gameOptions.mode === "multiplayer" ? (roomData === null || roomData.isGameStarted === false) && <Loader></Loader> : <></>}
        {roomData && (roomData.isGameAbandoned || roomData.isGameEnded) && (
          <div className="game-abondoned">
            <p>{roomData.isGameAbandoned ? "Game is no longer available" : "Game is ended"}</p>
            <Button
              onClick={() => {
                clearRoomData(setRoomData, setPlayerId, setIsGameStarted);
              }}>
              {roomData.isGameAbandoned ? "Find new player" : "Play again"}
            </Button>
          </div>
        )}
        {isGameStarting && roomData !== null && roomData.isGameStarted && (
          <div className="user-move">
            <p>YOU ARE</p>
            <p className="move">
              {roomData?.currentUserMove === "x" ? <i className="fa-regular fa-xmark"></i> : <i className="fa-sharp fa-regular fa-circle"></i>}{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
