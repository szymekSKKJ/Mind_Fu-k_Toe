import { TransitionButton } from "react-components-transition";
import "./Button.scss";

interface buttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  show?: string;
  animationIn?:
    | {
        className: string;
        duration: number;
      }
    | null
    | undefined;
  animationOut?:
    | {
        className: string;
        duration: number;
      }
    | null
    | undefined;
}

const Button = ({ children, show, animationIn, animationOut, onClick, ...rest }: buttonProps) => {
  if (show) {
    return (
      <TransitionButton
        onClick={(event) => onClick && onClick(event)}
        animationIn={animationIn}
        animationOut={animationOut}
        show={show}
        className="default-button">
        {children}
      </TransitionButton>
    );
  }
  return (
    <button className="default-button" onClick={(event) => onClick && onClick(event)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
