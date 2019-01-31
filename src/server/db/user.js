class DBParent {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        isParent INT);`;
    return this.dao.run(sql);
  }

  createTableConnections() {
    const sql = `
    CREATE TABLE IF NOT EXISTS userConnection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idParent INT,
      idKid);`;
    return this.dao.run(sql);
  }

  createUser(name, isParent, email) {
    return this.dao.run(
      "INSERT INTO users (name,isParent,email) VALUES (?,?,?)",
      [name, isParent, email]
    );
  }

  updateUser(id, name, email) {
    return this.dao.run("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      id
    ]);
  }

  deleteUser(id) {
    return this.dao
      .run("DELETE FROM userConnection WHERE idParent = ? OR idKid = ?", [
        id,
        id
      ])
      .then(() => this.dao.run("DELETE FROM users WHERE id = ?", [id]));
  }

  createConnection(idParent, idKid) {
    return this.dao.run(
      "INSERT INTO userConnection (idParent,idKid) VALUES (?,?)",
      [idParent, idKid]
    );
  }

  deleteConnection(idParent, idKid) {
    return this.dao.run(
      "DELETE FROM userConnection WHERE idParent = ? AND idKid = ?",
      [idParent, idKid]
    );
  }

  getAll() {
    return this.dao.all(`SELECT * FROM users`);
  }

  getAllConnections() {
    return this.dao.all(`SELECT * FROM userConnection`);
  }

  getConnections(kidId) {
    return this.dao.all(`SELECT * FROM userConnection where idKid = ?;`, [
      kidId
    ]);
  }

  getById(id) {
    return this.dao.get(`SELECT * FROM users WHERE id = ?`, [id]);
  }

  update(project) {
    const { id, name } = project;
    return this.dao.run(`UPDATE users SET name = ? WHERE id = ?`, [name, id]);
  }

  findUsersOnName(name) {
    return this.dao.get(
      `SELECT * FROM users WHERE isParent = 0 AND name LIKE ?`,
      [`%${name}%`]
    );
  }
}

module.exports = DBParent;
