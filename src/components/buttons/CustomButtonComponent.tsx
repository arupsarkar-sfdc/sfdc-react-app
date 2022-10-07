import React from "react";

interface Props {
  border: string;
  color: string;
  children?: React.ReactNode;
  height: string;
  onClick: () => void;
  radius: string;
  width: string;
  disabled?: boolean;
}


const Button: React.FC<Props> = ({
    border,
    color,
    children,
    height,
    onClick, 
    radius,
    width,
    disabled,
}) => {
    return(
        <button 
        disabled={disabled}
        onClick={onClick}
        style={{
           backgroundColor: color,
           border,
           borderRadius: radius,
           height,
           width
        }}
      >
      {children}
      </button>
    )
}

export default Button