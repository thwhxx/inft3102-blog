// config.js
const config = {
  production: {
    STRAPI_URL: "https://strapi-backend-21185052417.us-central1.run.app",
  },
  development: {
    STRAPI_URL: "http://localhost:1337",
  },
};

const ENV =
  document.location.hostname === "localhost" ? "development" : "production";

export default config[ENV];
