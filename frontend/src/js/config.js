// // config.js
// const config = {
//   production: {
//     STRAPI_URL: "https://inft3102-blog-backend.onrender.com",
//   },
//   development: {
//     STRAPI_URL: "http://localhost:1337",
//   },
// };

// const ENV =
//   document.location.hostname === "localhost" ? "development" : "production";

// export default config[ENV];

// frontend/src/js/config.js
const config = {
  production: {
    API_URL: "/.netlify/functions",
  },
  development: {
    API_URL: "/.netlify/functions",
  },
};

const ENV =
  document.location.hostname === "localhost" ? "development" : "production";

export default config[ENV];
