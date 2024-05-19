"use strict";

/** Routes for playlists. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const Playlist = require("../models/playlist");
const Songs = require("../models/song")
const playlistNewSchema = require("../schemas/playlistNew.json");
const playlistUpdateSchema = require("../schemas/playlistUpdate.json");
const playlistSearchSchema = require("../schemas/playlistSearch.json");

const router = new express.Router();


/** POST / { Playlist}
 *
 * playlist should be { title, username}
 *
 * Returns { id, title, username }
 *
 * Authorization required: CorrectUser
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, playlistNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const playlist = await Playlist.create(req.body);
    return res.status(201).json({ playlist });
  } catch (err) {
    return next(err);
  }
});



/** GET /  =>
 *   { playlists: [ { title, username }, ...] }
 *
 * Can filter on provided search filters:
 * - title
 * - username
 * 
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, playlistSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const playlists = await Playlist.findAllPlaylists(q);
    return res.json( playlists );
  } catch (err) {
    return next(err);
  }
});

/** GET /:id  =>  { playlist }
 *
 *  playlist is { id }
 *   where songs is [{ id, title, aritst, runtime}, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const playlist = await Playlist.get(req.params.id);
    playlist.songs = await Playlist.findAllsongs(req.params.id);
    console.log(playlist)
    return res.json( playlist );
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[handle] { fld1, fld2, ... } => { playlist }
 *
 * Patches playlist data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, playlistUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const playlist = await Playlist.update(req.params.handle, req.body);
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: handle }
 *
 */

router.delete("/:id", async function (req, res, next) {
  try {
    const result = await Playlist.remove(req.params.id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
