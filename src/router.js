const express = require("express");
const router = new express.Router();
const Recipe = require("./recipe");
const sharp = require("sharp");

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    const newRecipes = recipes.map((recipe) => {
      const {
        _id,
        title,
        serves,
        cookTime,
        prepTime,
        cardImage,
      } = recipe.toObject();
      return {
        _id,
        title,
        serves,
        cookTime,
        prepTime,
        cardImage,
      };
    });
    res.send(newRecipes);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/recipes", async (req, res) => {
  const buffer = Buffer.from(req.body.image.split(",")[1], "base64");
  const cardImage = await sharp(buffer)
    .resize({ width: 237, height: 151 })
    .png()
    .toBuffer();

  const pageImage = await sharp(buffer)
    .resize({ width: 850, height: 600 })
    .jpeg()
    .toBuffer();

  const recipe = new Recipe({ ...req.body, cardImage, pageImage });

  try {
    await recipe.save();
    res.status(201).send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/recipe/:id/cardimage", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || !recipe.cardImage) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(recipe.cardImage);
  } catch (error) {
    res.status(404).send();
  }
});

router.get("/recipe/:id/pageimage", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || !recipe.pageImage) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(recipe.pageImage);
  } catch (error) {
    res.status(404).send();
  }
});
module.exports = router;
