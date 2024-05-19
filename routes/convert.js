/** Convert youtube link to mp3  */ 

"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const Song = require("../models/song")

const router = express.Router();

router.get("/", async function (req, res, next) {
    try{
        console.log(req.query, "This is the request")
        const newurl = await Song.converturl(req.query);
        console.log(newurl.data.dlink, "this is the result")
        return res.json( newurl.data.dlink );
        } catch (err) {
        return next(err);
        }
    });


    module.exports = router;
