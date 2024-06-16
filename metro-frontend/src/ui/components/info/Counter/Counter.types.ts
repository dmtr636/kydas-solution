import { ButtonMode, ButtonSize, ButtonType } from "../../controls/Button/Button.types";

export type CounterType = Exclude<ButtonType, "tertiary">;
export type CounterMode = Exclude<ButtonMode, "contrast">;
export type CounterSize = ButtonSize;
