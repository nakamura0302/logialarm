import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("zielinski_jakub_4i1b.db");

const tableName = 'alarmsssss';
export class Database {

    static createTable = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS ${tableName} (
                        id integer primary key not null, 
                        date text,
                        time text,
                        sound text, 
                        frequence text, 
                        vibrate INTEGER,
                        autoDelete INTEGER,
                        summary text,
                        isActive INTEGER,
                        identifier text
                    );`,
                    [], // No parameters for this query
                    () => {
                        resolve("Alarm database created successfully");
                    },
                    (_, error) => {
                        // Error callback
                        reject(error);
                    }
                );
            });
        });
    };
    
    static add = (date, time, sound, frequence, vibrate, autoDelete, summary, isActive, identifier) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => 
                tx.executeSql(
                    `INSERT INTO ${tableName} (date, time, sound, frequence, vibrate, autoDelete, summary, isActive, identifier) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [date, time, sound, frequence, vibrate, autoDelete, summary, isActive, identifier],
                    (tx, result) => {
                        console.log('Insert successful');
                        resolve(result);
                    },
                    (tx, error) => {
                        console.error('Insert error:', error);
                        reject(error);
                    }
                )
            );
        });
    };

    static update = (id, date, time, sound, frequence, vibrate, autoDelete, summary, isActive, identifier) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => 
                tx.executeSql(
                    `UPDATE ${tableName} 
                     SET date = ?, time = ?, sound = ?, frequence = ?, vibrate = ?, autoDelete = ?, summary = ?, isActive = ?, identifier = ?
                     WHERE id = ?;`,
                    [date, time, sound, frequence, vibrate, autoDelete, summary, isActive, identifier, id],
                    (tx, result) => {
                        console.log('Update successful');
                        resolve(result);
                    },
                    (tx, error) => {
                        console.error('Update error:', error);
                        reject(error);
                    }
                )
            );
        });
    };

    static getAll = () => {
        var query = `SELECT * FROM ${tableName};`;
    
        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                const rows = results.rows._array;
                resolve(rows);
            }, (tx, error) => reject(error));
        }));
    }

    static remove = (id) => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => 
                tx.executeSql(
                    `DELETE FROM ${tableName} WHERE id = ?;`,
                    [id],
                    (tx, result) => {
                        console.log('Delete successful');
                        resolve(result);
                    },
                    (tx, error) => {
                        console.error('Delete error:', error);
                        reject(error);
                    }
                )
            );
        });
    };
    
    static removeAll = () => {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${tableName};`,
                    [],
                    (tx, result) => {
                        console.log('All records deleted');
                        resolve(result);
                    },
                    (tx, error) => {
                        console.error('Delete all error:', error);
                        reject(error);
                    }
                );
            });
        });
    };
}
