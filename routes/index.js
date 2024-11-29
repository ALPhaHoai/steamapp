import express from "express";
import {collection} from "../db.js";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("steam app hello world!");
});

router.get("/getGameNameByAppIds", async function (req, res, next) {
  const appIds = req.query.appIds?.split(',')?.map(parseInt).filter(Boolean);

  res.json({
    results: await collection.SteamApp.find({
      appId: {
        $in: appIds,
      },
    })
        .project({
          appId: 1,
          name: 1,
        })
        .toArray()
  })
});

export default router;
