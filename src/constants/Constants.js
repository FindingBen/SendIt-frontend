const prod = {
  url: {
    BASE_URL: "https://stingray-app-9825w.ondigitalocean.app",
    //BASE_URL: "http://localhost:8000/",
  },
};

const dev = {
  url: {
    BASE_URL: "http://localhost:8000",
    //AUTH_URL: "http://localhost:3090/",
  },
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;
