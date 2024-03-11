export const config = () => ({
  app: {
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
  },
  database: {
    host: process.env.DATABASE_HOST,
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    pass: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT),
  },
});