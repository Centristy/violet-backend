"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for playlists. */

class Playlist {
  /** Create a playlist (from data), update db, return new playlist data.
   *
   * data should be { title, user_usernmae}
   *
   * Returns {id, title, user_username}
   *
   * Throws BadRequestError if playlist already in database.
   * */

  static async create({ title, user_username, description }) {

    const result = await db.query(
          `INSERT INTO playlists
           (title, user_username, description)
           VALUES ($1, $2, $3)
           RETURNING id, title`,
        [
          title,
          user_username,
          description,
        ],
    );
    const playlist = result.rows[0];

    return playlist;
  }


  /** Find playlists from a given user .
   *
   * searchFilters:
   * - user_username
   * - title (partial or optional)
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAllPlaylists(user_username) {

    const playlistsRes = await db.query(`SELECT * FROM playlists WHERE user_username = $1`, [user_username]);
    return playlistsRes.rows;
  }



  /** Given a playlist id, return title of playlist.
   *
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const playlists = await db.query(
          `SELECT *
          FROM playlists
          WHERE id = $1`,
        [id]);

    if (!playlists) throw new NotFoundError(`Playlists does not exist / was deleted by user`);

    const playlist = playlists.rows[0];

    return playlist;
  }

  /** Given a playlist id, return all songs inside of playlist.
   *
   *
   * returns nothing if no songs in playlist.
   **/

  static async findAllsongs(playlist_id) {
    let allSongs = await db.query( 
                        `SELECT s.id,
                        s.title,
                        s.artist,
                        s.album,
                        s.playlist_id,
                        s.url
                  FROM songs s WHERE playlist_id = $1`, [playlist_id]) ;

    console.log(allSongs)

    return allSongs;
  }

  /** Update playlist data with `data`.
   *

   * Data must include: {title}
   *
   * Returns {id, title }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, title) {

    const querySql = `UPDATE playlists 
                      SET title 
                      WHERE id = ${id} 
                      RETURNING id, 
                                title`;
    const result = await db.query(querySql, [title]);
    const playlist = result.rows[0];

    if (!playlist) throw new NotFoundError(`Playlist does not exist, or wad dleted by user`);

    return playlist;
  }

  /** Delete given playlist from database including all songs; returns undefined.
   *
   * Throws NotFoundError if playlist not found.
   **/

  static async remove(id) {
    const songdelete = await db.query(
        `DELETE
          FROM songs
          WHERE playlist_id = $1`,
          [id]);

    const result = await db.query(
          `DELETE
            FROM playlists
            WHERE id = $1 RETURNING
            title`,
        [id]);


    if (!result) throw new NotFoundError(`Playlist does not exist \ Deleted by user`);
  
    return result.rows[0]
  
  };

  
}


module.exports = Playlist;
