import { useContext } from "react";
import "./MiniBoard.scss";
import { CurrentMoveContext, miniBoardType } from "../MainBoard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebaseInitialization";
import { roomType } from "../../Game/Game";

interface miniBoardProps {
  setMiniBoard: (id: number, miniBoardChoosenFieldIndex: number) => void;
  globalWin: number[];
  roomData: roomType | undefined;
  miniBoardData: miniBoardType;
}

const MiniBoard = ({ setMiniBoard, miniBoardData, globalWin, roomData }: miniBoardProps) => {
  const [currentMove] = useContext(CurrentMoveContext);

  const { id, board: miniBoard, isActive, won } = miniBoardData;

  return (
    <div className="mini-board">
      {miniBoard.map((field, index) => {
        const { figure } = field;
        return (
          <div
            className="field"
            key={index}
            onClick={async () => {
              if (isActive && figure === null && won === null && globalWin.length === 0 && currentMove !== null) {
                if (roomData ? currentMove === roomData?.currentUserMove : true) {
                  setMiniBoard(id, index);

                  if ((roomData && roomData.lastMove !== undefined) || (roomData && roomData.lastMove === undefined && currentMove === "x")) {
                    await updateDoc(doc(db, "rooms", roomData.id), {
                      lastMove: {
                        miniBoardId: id,
                        fieldIndex: index,
                        moveType: currentMove,
                      },
                    });
                  }
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
