const path = require('path');
const express = require('express');
const router = express();

// @route   GET /api/cities
// @desc    get all cities in SriLanka
// @access  Public
router.get("/", async (req,res) =>{

       res.send("services");               

  });