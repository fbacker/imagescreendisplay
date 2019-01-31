class DBSettings {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT);`;
    return this.dao.run(sql).then(() => {
      return this.dao.run(
        `INSERT INTO settings (key,value) SELECT "version", "1" WHERE NOT EXISTS (SELECT key FROM settings WHERE key = "version")`
      );
    });
  }

  getAll() {
    return this.dao.all(`SELECT * FROM settings`);
  }

  get(key) {
    return this.dao.get(`SELECT * FROM settings where key = ?`, [key]);
  }

  update(key, value) {
    return this.dao.run(`UPDATE settings SET value = ? WHERE key = ?`, [
      value,
      key
    ]);
  }

  insert(key, value) {
    return this.dao.run(`INSERT INTO settings (key,value) VALUES (?,?)`, [
      value,
      key
    ]);
  }
}

module.exports = DBSettings;
