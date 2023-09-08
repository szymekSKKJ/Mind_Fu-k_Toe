import ComponentsTransition from "react-components-transition/ComponentsTransition";
import Tutorial from "./Tutorial/Tutorial";
import Game from "./Game/Game";
import Start from "./Start/Start";
import { useRef, useState } from "react";

const App = () => {
  const [gameOptions, setGameOptions] = useState<{ difficulty: string | null; mode: string | null }>({
    difficulty: null,
    mode: null,
  });

  const appElementRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="app" ref={appElementRef}>
      <ComponentsTransition parentElementRef={appElementRef} firstVisible={"Start"}>
        <Start key={"Start"} setGameOptions={setGameOptions}></Start>
        <Game key="Game" gameOptions={gameOptions}></Game>
        <Tutorial key={"Tutorial"}></Tutorial>
      </ComponentsTransition>
    </div>
  );
};

export default App;
