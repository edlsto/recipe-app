const express = require("express");
const router = new express.Router();
const Recipe = require("./recipe");
const sharp = require("sharp");

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    const newRecipes = recipes.map((recipe) => {
      let {
        _id,
        title,
        serves,
        cookTime,
        prepTime,
        cardImage,
      } = recipe.toObject();
      if (cardImage) {
        cardImage = `http://localhost:3001/recipe/${_id}/cardimage`;
      }
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

router.delete("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
    });
    if (!recipe) {
      res.status(404).send();
    }
    res.send(recipe);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/recipes/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "ingredients",
    "steps",
    "title",
    "cookTime",
    "prepTime",
    "serves",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates" });
  }
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404).send();
    }
    updates.forEach((update) => {
      recipe[update] = req.body[update];
    });
    await recipe.save();
    res.send(recipe);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/recipes", async (req, res) => {
  let buffer, cardImage, pageImage;
  if (req.body.image) {
    buffer = Buffer.from(req.body.image.split(",")[1], "base64");
    cardImage = await sharp(buffer)
      .resize({ width: 237, height: 151 })
      .png()
      .toBuffer();

    pageImage = await sharp(buffer)
      .resize({ width: 1270, height: 882 })
      .jpeg()
      .toBuffer();
  }

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
