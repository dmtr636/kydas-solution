export const getTimeForShift = (shift: string) => {
    if (shift === "1") {
        return ["08:00", "20:00"];
    }
    if (shift === "1Н") {
        return ["08:00", "16:00"];
    }
    if (shift === "2") {
        return ["20:00", "08:00"];
    }
    if (shift === "2Н") {
        return ["20:00", "08:00"];
    }
    if (shift === "5") {
        return ["08:00", "17:00"];
    }
};
