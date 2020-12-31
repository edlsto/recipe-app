const express = require("express");
const router = new express.Router();
const Recipe = require("./recipe");
const bodyParser = require("body-parser");

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.send(recipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/recipes", async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    await recipe.save();
    res.status(201).send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
