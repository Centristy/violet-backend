"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const axios = require('axios')


/** Related functions for Songs. */

class Song {
  /** Create a song (from data), update db, return new song data.
   *
   * data should be { title, album, url, playlist_id }
   *
   * Returns { id,  title, album, url, playlist_id  }
   **/

  static async create(data) {
    const result = await db.query(
          `INSERT INTO songs (title,
                              album,
                              artist,
                              url,
                              playlist_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, album, artist, url, playlist_id`,
        [
          data.title,
          data.album,
          data.artist,
          data.url,
          data.playlist_id
        ]);
    let song = result.rows[0];

    return song;
  }

  



  /** Given a song id, return data about song.
   *
   * Returns { id, title, album, url, playlist_id  }
   *
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const songRes = await db.query(
          `SELECT id,
                  title,
                  artist,
                  album,
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
   * Data can include: { title, album, artist }
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
                                album, 
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

  // This is the api I'll use to search songs

static async search(search){
  const options = {
    method: 'GET',
    url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
    params: {q: `'${search}'`},
    headers: {
      'X-RapidAPI-Key': '118e97e7aamsh8a292efbf40b9bcp1d692ajsn83e4e1a72d9c',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
  };


  
  try {
    const response = await axios.request(options);

    return response.data.data
  } catch (error) {
    console.error(error);
  }
}

static async converturl(data){

console.log( data , "This is the request data")

const options = {
  method: 'GET',
  url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
  params: {url: data.url  },
  headers: {
    'X-RapidAPI-Key': '118e97e7aamsh8a292efbf40b9bcp1d692ajsn83e4e1a72d9c',
    'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
  }
};

console.log(options, "Options structre")

try {
	const response = await axios.request(options);
	return response
} catch (error) {
	console.error(error);

}

}

}
module.exports = Song;
