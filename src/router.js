const express = require("express");
const router = new express.Router();
const Recipe = require("./recipe");

router.post("/recipes", async (req, res) => {
  const recipe = new Recipe(req.body);
  await recipe.save();
  res.status(201).send(recipe);
});

module.exports = router;
