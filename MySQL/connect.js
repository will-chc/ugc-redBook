const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1132381819',
    database: 'mydb',
    charset:'utf8mb4'
});


const db = {};

// 查询语句
db.select = (table, columns = '*', where = '', order = '', params = []) => {
    const query = `SELECT ${columns} FROM ${table} ${where} ${order};`;
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results, fields) => {
            if (error) {
                // console.log(error);
                reject(error);
            } else {
                resolve(results);
                // console.log(results);
            }
        });
    });
};


// 插入语句
db.insert = (tableName, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = new Array(values.length).fill('?').join(', ');
    const sql = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    console.log(sql, values);
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                    resolve(results);
            }
        });
    });
}

// 删除语句
db.delete = (table, where = '', params = []) => {
    const query = `DELETE FROM ${table} ${where};`;
    return new Promise((resolve, reject) => {
      connection.query(query, params, (error, results, fields) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
          console.log(results);
        }
      });
    });
  };  

  // 编辑，修改，更新
  db.update = (table, values, where = '', params = []) => {
    const setValues = Object.entries(values).map(([key, value]) => `${key} = ?`).join(', ');
    const query = `UPDATE ${table} SET ${setValues} ${where};`;
    return new Promise((resolve, reject) => {
      connection.query(query, [...Object.values(values), ...params], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
  

module.exports = {
    connection,
    db
}