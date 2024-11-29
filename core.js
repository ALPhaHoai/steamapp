import _ from "lodash";
import SteamUser from "steamutils";
import {collection} from "./db.js";

export function initial() {
  setInterval(crawSteamAppList, 5 * 60000)
}

export async function crawSteamAppList() {
  let count = 0
  const apps = (await SteamUser.getAppList())?.applist?.apps;
  if (!Array.isArray(apps)) {
    return;
  }
  for (const app of _.shuffle(apps)) {
    if (count > 10) {
      return
    }

    try {
      try {
        await collection.SteamApp.insertOne({
          appId: app.appid,
          name: app.name,
        });
      } catch (e) {
      }
      const dbApp = await collection.SteamApp.findOne({
        appId: app.appid,
      });
      if (!dbApp.steam_appid) {
        count++
        const appDetail = (await SteamUser.getAppDetail(app.appid))?.[app.appid];
        if (appDetail?.success && appDetail.data) {
          await collection.SteamApp.updateOne(
              {
                appId: app.appid,
              },
              {
                $set: {
                  ..._.pick(appDetail.data, ["appId", "name", "background", "is_free", "fullgame"]),
                },
              },
          );
        }
      }
    } catch (e) {
    }
  }
}
