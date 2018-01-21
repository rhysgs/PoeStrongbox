const mysql = require('mysql');
const database = require('../../database')[process.env.NODE_ENV || 'local'];
if (database == null) {
  throw new Error(`No database configured for environment: ${process.env.NODE_ENV}`);
}

const connection = {
  poe: {
    host: database.host,
    user: database.user,
    password: database.password,
    multipleStatements: true
  }
};

const maxConnections = 10;
const acceptableTypes = ['string', 'number', 'boolean', null];
var pools = {};

for (var prop in connection) {
  connection[prop].connectionLimit = maxConnections;
  pools[prop] = mysql.createPool(connection[prop]);
}

/**
 * @param {string} platform
 * @param {string} sql 
 * @param {any[]} args 
 * @param {function(any, any[], any[])} callback
 */
function Query(platform, sql, args, callback) {
  var useCallback = typeof callback === 'function';
  if (typeof platform !== 'string') {
    if (useCallback) {
      callback({
        message: 'platform must be a string.'
      });
    }
    return;
  }
  var pool = pools[platform];
  if (pool == null) {
    if (useCallback) {
      callback({
        message: `invalid platform '${platform}'`
      });
    }
    return;
  }
  pool.query(sql, args, callback);
}

/**
 * @param {{field_name:string|number}} obj 
 * @return {{message:string,validation:[{prop:string,message:string}]}}
 */
function ValidateObj(obj) {
  var validation = {
    message: 'Unacceptable object properties.',
    validation: []
  };
  if (!(obj instanceof Object)) {
    validation.message = 'obj must be an Object.',
      validation.validation.push({
        prop: 'obj',
        message: 'Must be an Object.'
      });
    return validation;
  }

  var curr = null;
  for (var prop in obj) {
    curr = obj[prop] == null ? null : typeof obj[prop];
    if (acceptableTypes.indexOf(curr) < 0) {
      validation.validation.push({
        prop: `obj.${prop}`,
        message: `'${curr}' is not an acceptable type.`
      });
    }
  }

  if (validation.validation.length === 0)
    return null;
  else
    return validation;
}

/**
 * @param {(string|number|boolean)[]} arr 
 * @return {{message:string,validation:[{prop:string,message:string}]}}
 */
function ValidateArray(arr) {
  var validation = {
    message: 'Unacceptable object properties.',
    validation: []
  };
  if (!(obj instanceof Array)) {
    validation.message = 'obj must be an Array.',
      validation.validation.push({
        prop: 'arr',
        message: 'Must be an Array.'
      });
    return validation;
  }

  var curr = null;
  for (var i = 0; i < arr.length; i++) {
    curr = arr[i] == null ? null : typeof arr[i];
    if (acceptableTypes.indexOf(curr) < 0) {
      validation.validation.push({
        prop: `arr[${i}]`,
        message: `'${curr}' is not an acceptable type.`
      });
    }
  }

  if (validation.validation.length === 0)
    return null;
  else
    return validation;
}

/**
 * 
 * @param {string} platform 
 * @param {string} db 
 * @param {string} table
 * @param {numer} id 
 * @param {{field_name:string|number|boolean}} data 
 * @param {function(any, any[], any[])} callback
 */
function UpdateById(platform, db, table, id, data, callback) {
  callback = typeof callback === 'function' ? callback : function () { };
  id = parseInt(id);
  if (typeof db !== 'string') {
    return callback({
      message: `db must be a String`
    });
  }
  if (typeof table !== 'string') {
    return callback({
      message: `table must be a String`
    });
  }
  if (isNaN(id)) {
    return callback({
      message: `id must be a Number`
    });
  }
  var validation = ValidateObj(data);
  if (validation != null) {
    return callback(validation);
  }

  var escapedTarget = `${mysql.escapeId(db)}.${mysql.escapeId(table)}`;

  var escapedKvs = [];
  for (var prop in data) {
    // not allowed to change the id
    if (prop === 'id') {
      continue;
    }
    escapedKvs.push(`${mysql.escapeId(prop)} = ${mysql.escape(data[prop])}`);
  }

  var sql = `UPDATE ${escapedTarget} SET ${escapedKvs.join(', ')} WHERE id = ${mysql.escape(id)}`;

  Query(platform, sql, null, callback)
}

/**
 * 
 * @param {string} platform 
 * @param {string} db 
 * @param {string} table
 * @param {numer} id 
 * @param {function(any, any[], any[])} callback
 */
function DeleteById(platform, db, table, id, callback) {
  callback = typeof callback === 'function' ? callback : function () { };
  id = parseInt(id);
  if (typeof db !== 'string') {
    return callback({
      message: `db must be a String`
    });
  }
  if (typeof table !== 'string') {
    return callback({
      message: `table must be a String`
    });
  }
  if (isNaN(id)) {
    return callback({
      message: `id must be a Number`
    });
  }

  var escapedTarget = `${mysql.escapeId(db)}.${mysql.escapeId(table)}`;

  var sql = `DELETE FROM ${escapedTarget} WHERE id = ${mysql.escape(id)}`;

  Query(platform, sql, null, callback)
}

/**
 * 
 * @param {string} platform 
 * @param {string} db 
 * @param {string} table
 * @param {{field_name:string|number|boolean}|[]} data 
 * @param {function(any, {affectedRows:number,changedRows:number,fieldCount:number,insertId:number,message:string,serverStatus:number,warningCount:number}, any[])} callback
 */
function Insert(platform, db, table, data, callback) {
  callback = typeof callback === 'function' ? callback : function () { };
  if (typeof db !== 'string') {
    return callback({
      message: `db must be a String`
    });
  }
  if (typeof table !== 'string') {
    return callback({
      message: `table must be a String`
    });
  }
  if (!(data instanceof Array)) {
    data = [data];
  }

  for (var i = 0; i < data.length; i++) {
    var validation = ValidateObj(data[i]);
    if (validation != null) {
      return callback(validation);
    }
  }

  var escapedTarget = `${mysql.escapeId(db)}.${mysql.escapeId(table)}`;
  var sql = '';
  for (var i = 0; i < data.length; i++) {
    var escapedKeys = [];
    var escapedValues = [];
    for (var prop in data[i]) {
      escapedKeys.push(mysql.escapeId(prop));
      escapedValues.push(mysql.escape(data[i][prop]));
    }
    sql += `INSERT INTO ${escapedTarget}(${escapedKeys.join(', ')}) VALUES (${escapedValues.join(', ')});`;
  }

  Query(platform, sql, null, callback)
}

function Db() { }
Db.prototype.Query = Query;
Db.prototype.UpdateById = UpdateById;
Db.prototype.Insert = Insert;
Db.prototype.DeleteById = DeleteById;
Db.prototype.ValidateArray = ValidateArray;
Db.prototype.ValidateObj = ValidateObj;
module.exports = new Db();