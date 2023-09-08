import "./Tutorial.scss";
import MainBoardTutorial from "./MainBoardTutorial/MainBoardTutorial";
import { useState } from "react";
import Button from "../../Global/Button/Button";

const Tutorial = () => {
  const steps: { id: number; title: string; subTitle: string | null }[] = [
    {
      id: 1,
      title: "Welcome in Mind Fu*k Toe",
      subTitle: null,
    },
    {
      id: 2,
      title: "Your main goal isto  winning on small boards in that way to win on the big one",
      subTitle: null,
    },
    {
      id: 3,
      title: "First small board is always random like starting player",
      subTitle: "Click on any small square in highlighted board",
    },
    {
      id: 4,
      title: "Great! After click on small square, new small board is chosen. Your choose decide which will be next small board",
      subTitle: "Click again on any small square",
    },
    {
      id: 5,
      title:
        "You always click on small fields in small board. Position of that field determinantes the next small board (f.e top center field in small board represents the top center small board in the big one)",
      subTitle: "Click on top center small square",
    },
    {
      id: 6,
      title: "That's it! Now the opponent play in the top center small board",
      subTitle: null,
    },
    {
      id: 7,
      title: "Winning on small board determinante your move on big board",
      subTitle: null,
    },
    {
      id: 8,
      title: "Game ends when any player won on big board or both players draw",
      subTitle: null,
    },
    {
      id: 9,
      title: "You can continue there or click button to leave",
      subTitle: null,
    },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  const exampleBoardStates = [
    {
      stepId: 2,
      board: [
        {
          id: 1,
          isActive: false,
          won: null,
          board: [
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
          ],
        },
        {
          id: 2,
          isActive: false,
          won: null,
          board: [
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
          ],
        },
        {
          id: 3,
          isActive: false,
          won: "x",
          board: [
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
            {
              figure: "o",
            },
          ],
        },
        {
          id: 4,
          isActive: false,
          won: null,
          board: [
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
          ],
        },
        {
          id: 5,
          isActive: false,
          won: "x",
          board: [
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
          ],
        },
        {
          id: 6,
          isActive: false,
          won: null,
          board: [
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "o",
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
          ],
        },
        {
          id: 7,
          isActive: false,
          won: "x",
          board: [
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
            {
              figure: null,
            },
          ],
        },
        {
          id: 8,
          isActive: false,
          won: null,
          board: [
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
          ],
        },
        {
          id: 9,
          isActive: false,
          won: null,
          board: [
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: null,
            },
            {
              figure: "x",
            },
            {
              figure: "o",
            },
            {
              figure: "o",
            },
            {
              figure: "x",
            },
          ],
        },
      ],
    },
  ];

  const allowNextStepOnBoardClick = steps.find((step) => step.id === currentStep && step.subTitle !== null);

  const currentExampleBoardState = exampleBoardStates.find((exampleBoardState) => exampleBoardState.stepId === currentStep);

  return (
    <div className="tutorial">
      {steps.map((step) => {
        const { title, subTitle, id } = step;

        if (id === currentStep) {
          return (
            <div className="wrapper" key={id}>
              <div className="step">
                <p className="title">{title}</p>
                <p className="sub-title">{subTitle}</p>
              </div>
              {subTitle === null && (
                <Button
                  show={currentStep === 9 ? "Start" : ""}
                  onClick={() => setCurrentStep((currentValue) => (currentValue !== 9 ? currentValue + 1 : currentValue))}>
                  {currentStep === 9 ? "Exit" : "Next"}
                </Button>
              )}
            </div>
          );
        }
      })}
      <MainBoardTutorial
        stateBoard={currentExampleBoardState ? currentExampleBoardState.board : null}
        currentStep={currentStep}
        setCurrentStep={allowNextStepOnBoardClick ? setCurrentStep : () => null}></MainBoardTutorial>
    </div>
  );
};

export default Tutorial;
