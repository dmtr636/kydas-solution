export const PRODUCTION_DOMAIN = import.meta.env.VITE_PRODUCTION_DOMAIN;

export const DEBUG = false;

const DEVELOPMENT_DOMAIN = DEBUG ? "http://localhost:8080" : PRODUCTION_DOMAIN;

export const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

let domain: string;
if (isDevelopment) {
    domain = DEVELOPMENT_DOMAIN;
} else {
    domain = PRODUCTION_DOMAIN;
}

export { domain };

export const getEmailDomain = () => {
    if (PRODUCTION_DOMAIN.includes(".")) {
        return PRODUCTION_DOMAIN.split(".")[1] + "." + PRODUCTION_DOMAIN.split(".")[2];
    } else {
        return PRODUCTION_DOMAIN.split("http://")[1];
    }
};
