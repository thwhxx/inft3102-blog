// config.js
const config = {
  production: {
    STRAPI_URL: "https://inft3102-blog-backend.onrender.com",
  },
  development: {
    STRAPI_URL: "http://localhost:1337",
  },
};

const ENV =
  document.location.hostname === "localhost" ? "development" : "production";

export default config[ENV];
