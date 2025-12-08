import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER, // postgres
	host: process.env.DB_HOST || 'localhost', // localhost
	port: parseInt(process.env.DB_PORT || '5432'), // 5432
	database: process.env.DB_NAME, // online_clothes_shop
	password: process.env.DB_PASSWORD, // root
});

pool.on('connect', () => {
	console.log('Connected to PostgreSQL database');
});

pool.on('error', (err: Error) => {
	console.error('Unexpected error on idle client', err);
	process.exit(-1);
});

export default pool;
