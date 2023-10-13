const prod = {
  url: {
    BASE_URL: "https://sendit-backend-production.up.railway.app/",
    //BASE_URL: "http://localhost:8000/",
  },
};

const dev = {
  url: {
    //BASE_URL: "http://localhost:8000",
    BASE_URL: "https://sendit-backend-production.up.railway.app",
  },
};

export const config = process.env.NODE_ENV === "development" ? dev : prod;
