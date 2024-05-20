

"use strict";

/** Routes for playlists. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");

const Playlist = require("../models/playlist");
const Explore = require("../models/explore")
const artistReqSchema = require("../schemas/artistReq.json")

const router = new express.Router();


/** Get / { Arist Recommendations }
*
* Limitations on this API, but in production build this would have two parts. One for finding and then one for searching UUIDs
*
 */

router.get("/", async function (req, res, next) {
    try {
    const validator = jsonschema.validate(req.body, artistReqSchema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }

    const artist = await Explore.getSimilarArtists(req.body);
    return res.status(201).json({ artist });
    } catch (err) {
    return next(err);
    }
});



module.exports = router;



