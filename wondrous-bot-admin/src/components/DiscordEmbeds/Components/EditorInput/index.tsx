import styled from "styled-components";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { ValidationError } from "yup";
import { StyledLabel, StyledCounter } from "./styles";
import TextFieldComponent, { ResizeTextField } from "components/Shared/TextField";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  type?: "text" | "url" | "textarea";
  props?: Record<string, any>;
  className?: string;
  validationPath?: string;
}

export default function EditorInput({
  label,
  value,
  onChange,
  maxLength,
  type,
  props,
  className,
  validationPath,
}: Props) {
  const inputProps = {
    style: {
      backgroundColor: "#2D2D2D", // bg-dark-2
      padding: "8px 12px", // px-3 py-2
      borderRadius: "0.375rem", // rounded
      color: "white", // text-white
      border: "none", // border-transparent
      outline: "none", // focus:outline-none
    },
  };

  return (
    <div className={className}>
      <div style={{ marginBottom: "6px", display: "flex" }}>
        <StyledLabel>{label}</StyledLabel>
        {maxLength && (
          <StyledCounter>
            {value.length} / {maxLength}
          </StyledCounter>
        )}
      </div>
      {type === "textarea" ? (
        <ResizeTextField error={null} placeholder={"Enter content"} value={value} onChange={onChange} {...inputProps} />
      ) : null}
      {type === "text" ? (
        <TextFieldComponent multiline={false} value={value} onChange={onChange} {...inputProps} />
      ) : null}
    </div>
  );
}
