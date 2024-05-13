"use strict";

/** Routes for songs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Song = require("../models/song");
const songNewSchema = require("../schemas/songNew.json");
const songUpdateSchema = require("../schemas/songUpdate.json");
const songSearchSchema = require("../schemas/songSearch.json");

const router = express.Router({ mergeParams: true });


/** POST / { song} => { song }
 *
 * Song should be { title, artist, runtime }
 *
 * Returns { id, title, artist, runtime }
 *
 * Authorization required: admin
 */

router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, songNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const song = await Song.create(req.body);
    return res.status(201).json({ song });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { songs: [ { id, title, artist, runtime, url, playlist }, ...] }
 *
 * Can provide search filter in query:
 * - title (will find case-insensitive, partial matches)
 * - id

 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as int/bool

  try {
    const validator = jsonschema.validate(q, songSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const songs = await Song.findAll(q);
    return res.json({ songs });
  } catch (err) {
    return next(err);
  }
});

/** GET /[songId] => { song }
 *
 * Returns { id, title, artist, url, runtime, playlist_id }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const song = await Song.get(req.params.id);
    return res.json({ song });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[songId]  { fld1, fld2, ... } => { song }
 *
 * Data can include: { title, playlist_id }
 *
 * Returns { id, title }
 *
 */

router.patch("/:id", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, songUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const song = await Song.update(req.params.id, req.body);
    return res.json({ song });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Song.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
