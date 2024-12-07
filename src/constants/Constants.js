const prod = {
  url: {
    BASE_URL: "https://spp.up.railway.app",
  },
};

const dev = {
  url: {
    BASE_URL: "http://localhost:8000",
  },
};

const TRUE = "True";
const FALSE = "False";

export const statements = { TRUE, FALSE };
export const config = process.env.REACT_APP_ENV === "development" ? dev : prod;
