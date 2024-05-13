"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for Songs. */

class Song {
  /** Create a song (from data), update db, return new song data.
   *
   * data should be { title, runtime, url, playlist_id }
   *
   * Returns { id,  title, runtime, url, playlist_id  }
   **/

  static async create(data) {
    const result = await db.query(
          `INSERT INTO songs (title,
                              runtime,
                              artist,
                              url,
                              playlist_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, runtime, artist, url, playlist_id`,
        [
          data.title,
          data.runtime,
          data.artist,
          data.url,
          data.playlist_id
        ]);
    let song = result.rows[0];

    return song;
  }

  



  /** Given a song id, return data about song.
   *
   * Returns { id,  title, runtime, url, playlist_id  }
   *
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const songRes = await db.query(
          `SELECT id,
                  title,
                  artist,
                  playlist_id,
                  url
            FROM songs
            WHERE id = $1`, [id]);

    const song = songRes.rows[0];

    if (!song) throw new NotFoundError(`No song: ${id}`);


    return song;
  }

  /** Update song data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, runtime, artist }
   *
   * Returns 
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE songs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                runtime, 
                                artist,
                                playlist_id`;
    const result = await db.query(querySql, [...values, id]);
    const song = result.rows[0];

    if (!song) throw new NotFoundError(`Song does not exist \ User has deleted song`);

    return song;
  }

  /** Delete given song from database; returns undefined.
   *
   * Throws NotFoundError if song not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
          FROM songs
          WHERE id = $1
          RETURNING id`, [id]);
    const song = result.rows[0];

    if (!song) throw new NotFoundError(`Song deleted`);
  }
}

module.exports = Song;
