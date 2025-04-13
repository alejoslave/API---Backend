import { JSONFilePreset } from 'lowdb/node';

// Leer o crear la base de datos
const defaultData = { requestedSongs: [] };
const db = await JSONFilePreset('db.json', defaultData);

export default db