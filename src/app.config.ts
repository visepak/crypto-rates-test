export const DB_CONFIG = {
    host: process.env.DB_HOSTNAME || 'localhost',
    port: Number(process.env.DB_PORT) ||5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE ||'postgres',
};

export const CRYPTOCOMPARRE_URL = 'https://min-api.cryptocompare.com/';
