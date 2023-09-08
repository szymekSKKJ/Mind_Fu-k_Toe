import "./Start.scss";
import Button from "../../Global/Button/Button";
import MainBoard from "../MainBoard/MainBoard";
import { Dispatch, SetStateAction, useState } from "react";

const activeGameButtonsGroups = [
  {
    id: 1,
    buttonsId: [1, 2],
  },
  {
    id: 2,
    buttonsId: [3, 4],
  },
  {
    id: 3,
    buttonsId: [5, 6],
  },
];

interface startProps {
  setGameOptions: Dispatch<SetStateAction<{ difficulty: string | null; mode: string | null }>>;
}

const Start = ({ setGameOptions }: startProps) => {
  const [activeGameButtons, setActiveGameButtons] = useState<{ id: number; content: string; isVisible: boolean; show: string; callback: () => void }[]>([
    {
      id: 1,
      content: "Play!",
      isVisible: true,
      show: "",
      callback: () => {
        setTimeout(() => {
          setActiveGameButtons((currentValues) => {
            const copiedCurrentValues = [...currentValues];

            const activeButtonsId = activeGameButtonsGroups.find((group) => group.id === 2)!.buttonsId;

            copiedCurrentValues.forEach((buttonData) => {
              if (activeButtonsId.includes(buttonData.id)) {
                buttonData.isVisible = true;
              } else {
                buttonData.isVisible = false;
              }
            });

            return copiedCurrentValues;
          });
        }, 750 / 2); // Animation time from css
      },
    },
    {
      id: 2,
      content: "How to play?",
      isVisible: true,
      show: "Tutorial",
      callback: () => {},
    },
    {
      id: 3,
      content: "Normall",
      isVisible: false,
      show: "",
      callback: () => {
        setGameOptions((currentValue) => {
          const copiedCurrentValue = { ...currentValue };

          copiedCurrentValue.difficulty = "normall";

          return copiedCurrentValue;
        });
        setTimeout(() => {
          setActiveGameButtons((currentValues) => {
            const copiedCurrentValues = [...currentValues];

            const activeButtonsId = activeGameButtonsGroups.find((group) => group.id === 3)!.buttonsId;

            copiedCurrentValues.forEach((buttonData) => {
              if (activeButtonsId.includes(buttonData.id)) {
                buttonData.isVisible = true;
              } else {
                buttonData.isVisible = false;
              }
            });

            return copiedCurrentValues;
          });
        }, 750 / 2); // Animation time from css
      },
    },
    {
      id: 4,
      content: "Hard",
      isVisible: false,
      show: "",
      callback: () => {
        setGameOptions((currentValue) => {
          const copiedCurrentValue = { ...currentValue };

          copiedCurrentValue.difficulty = "hard";

          return copiedCurrentValue;
        });
        setTimeout(() => {
          setActiveGameButtons((currentValues) => {
            const copiedCurrentValues = [...currentValues];

            const activeButtonsId = activeGameButtonsGroups.find((group) => group.id === 3)!.buttonsId;

            copiedCurrentValues.forEach((buttonData) => {
              if (activeButtonsId.includes(buttonData.id)) {
                buttonData.isVisible = true;
              } else {
                buttonData.isVisible = false;
              }
            });

            return copiedCurrentValues;
          });
        }, 750 / 2); // Animation time from css
      },
    },
    {
      id: 5,
      content: "Multiplayer",
      isVisible: false,
      show: "Game",
      callback: () => {
        setGameOptions((currentValue) => {
          const copiedCurrentValue = { ...currentValue };

          copiedCurrentValue.mode = "multiplayer";

          return copiedCurrentValue;
        });
        setTimeout(() => {
          setActiveGameButtons((currentValues) => {
            const copiedCurrentValues = [...currentValues];

            copiedCurrentValues.forEach((buttonData) => {
              buttonData.isVisible = false;
            });

            return copiedCurrentValues;
          });
        }, 750 / 2); // Animation time from css
      },
    },
    {
      id: 6,
      content: "Singleplayer",
      isVisible: false,
      show: "Game",
      callback: () => {
        setGameOptions((currentValue) => {
          const copiedCurrentValue = { ...currentValue };

          copiedCurrentValue.mode = "singleplayer";

          return copiedCurrentValue;
        });
        setTimeout(() => {
          setActiveGameButtons((currentValues) => {
            const copiedCurrentValues = [...currentValues];

            copiedCurrentValues.forEach((buttonData) => {
              buttonData.isVisible = false;
            });

            return copiedCurrentValues;
          });
        }, 750 / 2); // Animation time from css
      },
    },
  ]);

  return (
    <div className="start">
      <div className="start-wrapper">
        <div className="buttons-and-title-wrapper">
          <h1>Mind Fu*k Toe!</h1>
          <div className="buttons">
            {activeGameButtons.map((button) => {
              const { show, content, id, isVisible, callback } = button;
              if (isVisible) {
                return (
                  <Button
                    key={id}
                    show={show}
                    onClick={(event) => {
                      const buttonsElement = event.currentTarget.parentElement as HTMLDivElement;
                      buttonsElement.classList.add("animating");

                      callback();
                      setTimeout(() => {
                        buttonsElement.classList.remove("animating");
                      }, 750); // From css
                    }}>
                    {content}
                  </Button>
                );
              }
            })}
          </div>
        </div>
        <div className="main-board-wrapper">
          <MainBoard botsPlaying={true} gameDifficulty="normall" gameMode="singleplayer"></MainBoard>
        </div>
      </div>
    </div>
  );
};

export default Start;
