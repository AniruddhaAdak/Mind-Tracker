import React from "react";
import { Button } from "@progress/kendo-react-buttons";

const CustomButton = ({ label, onClick, disabled = false, style = {} }) => {
  return (
    <Button onClick={onClick} disabled={disabled} style={{ ...style }}>
      {label}
    </Button>
  );
};

export default CustomButton;
