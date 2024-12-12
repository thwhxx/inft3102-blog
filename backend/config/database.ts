module.exports = ({ env }) => {
  const isProduction = env("NODE_ENV") === "production";

  return {
    connection: {
      client: "postgres",
      connection: isProduction
        ? {
            connectionString: env("DATABASE_URL"),
            ssl: { rejectUnauthorized: env.bool("DATABASE_SSL", true) },
          }
        : {
            host: env("DATABASE_HOST", "127.0.0.1"),
            port: env.int("DATABASE_PORT", 5432),
            database: env("DATABASE_NAME", "inft3102_db"),
            user: env("DATABASE_USERNAME", "inft3102_admin"),
            password: env("DATABASE_PASSWORD", "password"),
            ssl: env.bool("DATABASE_SSL", false)
              ? { rejectUnauthorized: false }
              : false,
          },
      debug: false,
    },
  };
};
