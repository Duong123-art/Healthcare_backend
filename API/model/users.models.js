// // import { join, dirname } from 'path'
// // import { Low, JSONFile } from 'lowdb'
// // import { fileURLToPath } from 'url'

// // const __dirname = dirname(fileURLToPath(import.meta.url));
// // const FileSync = require('lowdb/adapters/FileSync');
// // const file = join(__dirname, 'db.json')

// //const adapter = new FileSync('data.json');
// const database = require ("../connectdatabase.js");
// const adapter = new JSONFile(file)
// const db = new Low(adapter)
// const TABLENAME = 'users';

// exports.getUser = async username => {
// 	try {
// 		const data = await db.get(TABLENAME).find({username: username}).value();
// 		return data;
// 	} catch {
// 		return null;
// 	}
// };

// exports.createUser = async user => {
// 	try {
//         await db.get(TABLENAME).push(user).write();
// 		return true;
// 	} catch {
// 		return false;
// 	}
// };