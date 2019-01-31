class DBMedia {
  constructor(dao) {
    this.dao = dao;
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT,
        filename TEXT,
        created INT,
        display INT,
        sent INT)`;
    return this.dao.run(sql);
  }

  createTableConnections() {
    const sql = `
      CREATE TABLE IF NOT EXISTS assetsConnection (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        idAsset INT,
        idKid int)`;
    return this.dao.run(sql);
  }

  create(key, filename, time) {
    return this.dao.run(
      "INSERT INTO assets (key, filename, created) VALUES (?, ?, ?)",
      [key, filename, time]
    );
  }

  delete(id) {
    return this.dao
      .run("DELETE FROM assetsConnection WHERE idAsset = ?", [id])
      .then(() => this.dao.run("DELETE FROM assets WHERE id = ?", [id]));
  }

  getByKey(key) {
    return this.dao.get(`SELECT * FROM assets WHERE key = ?`, [key]);
  }

  getById(id) {
    return this.dao.get(`SELECT * FROM assets WHERE id = ?`, [id]);
  }

  setDisplay(id, val) {
    return this.dao.run("UPDATE assets SET display = ? WHERE id = ?", [
      val,
      id
    ]);
  }

  updateSent(id) {
    return this.dao.run("UPDATE assets SET sent = sent + 1 WHERE id = ?", [id]);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM assets ORDER BY created desc`);
  }

  getAllFilter(from, to, users) {
    if (users.length > 0) {
      return this.dao.all(
        `SELECT assets.*, assetsConnection.idKid as idKid FROM assets INNER JOIN assetsConnection ON assetsConnection.idAsset = assets.id WHERE created >= ? AND created <= ? AND idKid IN (${users}) ORDER BY created desc`,
        [from, to]
      );
    }
    return this.dao.all(
      `SELECT * FROM assets WHERE created >= ? AND created <= ? ORDER BY created desc`,
      [from, to]
    );
  }

  getAllPreview() {
    return this.dao.all(
      `SELECT * FROM assets WHERE display = 1 ORDER BY created desc`
    );
  }

  getAllConnections() {
    return this.dao.all(`SELECT * FROM assetsConnection`);
  }

  getConnections(id) {
    return this.dao.all(`SELECT * FROM assetsConnection where idAsset = ?;`, [
      id
    ]);
  }

  createConnection(idMedia, idKid) {
    return this.dao.run(
      "INSERT INTO assetsConnection (idAsset,idKid) VALUES (?,?)",
      [idMedia, idKid]
    );
  }

  deleteConnection(idMedia, idKid) {
    return this.dao.run(
      "DELETE FROM assetsConnection WHERE idAsset = ? AND idKid = ?",
      [idMedia, idKid]
    );
  }

  deleteConnectionUser(idUser) {
    return this.dao.run("DELETE FROM assetsConnection WHERE idKid = ?", [
      idUser
    ]);
  }

  getHistory(days) {
    return this.dao.all(
      `SELECT count(id) as num, date(created,'unixepoch') as time FROM assets  WHERE time >= date('now', ?) GROUP BY time ORDER BY time;`,
      [`-${days} days`]
    );
  }
}
module.exports = DBMedia;
