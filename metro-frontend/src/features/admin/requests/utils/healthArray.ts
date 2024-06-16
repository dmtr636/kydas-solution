import healthArray from "src/features/request/healthArray.ts";

export const getHealthGroupById = (id: number | null) =>
    healthArray.find((item) => item.value === id);
