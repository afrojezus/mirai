/**
 * Y - The Fetching Cocktail for yura
 * thoralf21@gmail.com
 */
import Firebase from "./firebase";
import Moment from "moment";

import Twist from "../twist-api";

const ydb = Firebase.database().ref("anime");
const fixList = Firebase.database()
  .ref("needfix")
  .child("anime");

class Y {
  constructor(romaji, artwork, id, desc, title) {
    this.romaji = romaji.toLowerCase();
    this.artwork = artwork;
    this.id = id;
    this.desc = desc;
    this.title = title;
    this.proxy = "https://cors.now.sh/";
    this.hasLoaded = false;
  }

  init = async () => {
    const r = this.romaji;
    const a = this.artwork;
    const i = this.id;
    const d = this.desc;
    const t = this.title;
    const metadata = {
      r,
      a,
      i,
      d,
      t
    };
    // TODO - Maybe a way better solution for this? This solution is such a fucking mess to use, but at least it works.
    const uglyHugeStringReplacementMadeForTwistToWorkFuck = r
      .replace(/ /gi, "-")
      .replace("2", "season-2")
      .replace("♭", "4")
      .replace("!", "")
      .replace("k-on!", "k-on-2")
      .replace("!!", "")
      .replace(".", "")
      .replace(";", "-")
      .replace("-(tv)", "-tv")
      .replace("kantai-collection:-kancolle", "kantai-collection")
      .replace(":", "")
      .replace("☆", "-")
      .replace(
        "jojo-no-kimyou-na-bouken-stardust-crusaders",
        "jojo-s-bizarre-adventure-stardust-crusaders-2"
      )
      .replace(
        "jojo-s-bizarre-adventure-stardust-crusaders-2---egypt-hen",
        "jojo-s-bizarre-adventure-stardust-crusaders-egypt-arc"
      )
      .replace(
        "jojo-no-kimyou-na-bouken-diamond-wa-kudakenai",
        "jojo-s-bizarre-adventure-diamond-is-unbreakable"
      )
      .replace("sen-to-chihiro-no-kamikakushi", "spirited-awaymovie")
      .replace("ookami-kodomo-no-ame-to-yuki", "wolf-children")
      .replace("★", "")
      .replace("?", "")
      .replace("pokemon-sun-", "pokemon-sun-moon")
      .replace("macross-frontier", "macross-f")
      .replace("macross-delta", "macross-d");

    try {
      const d = await ydb.child(i).once("value");
      const data = d.val();
      if (data) {
        // anime entry exists in the database
        if (data.episodes) {
          console.info("hosted by a yura bracket server, loading...");
          return this.loadFromDB(data.episodes, metadata);
        }
      } else {
        // anime entry doesn't exist in the database
        console.info(
          "anime not found in our database, manually fetching it from url using romaji"
        );
        return this.loadFromName(
          uglyHugeStringReplacementMadeForTwistToWorkFuck,
          metadata
        );
      }
    } catch (e) {
      return this.fail(e);
    }
  };

  // TODO - Add more hosting URLs for future possibilities.
  loadFromDB = async (list, d) => {
    this.hasLoaded = true;
    const data = list.map((l, i) => {
      if (list.length === 1)
        return {
          epLink: l,
          epName: "Movie",
          epNum: i + 1,
          epVideo: l,
          provider: "yura",
          epUrl: l
            .replace("https://3.bp.blogspot.com/", "")
            .replace("https://redirector.googlevideo.com/", "")
        };
      else
        return {
          epLink: l,
          epName: "Episode " + i + 1,
          epNum: i + 1,
          epVideo: l,
          provider: "yura",
          epUrl: l
            .replace("https://3.bp.blogspot.com/", "")
            .replace("https://redirector.googlevideo.com/", "")
        };
    });
    return {
      data: data,
      meta: d
    };
  };

  // TODO - use other URLs in addition to Twist.
  loadFromName = async (n, d) => {
    // Using Twist.moe to find the anime.
    const pre = this.proxy;
    try {
      const data = await Twist.get(pre + "https://twist.moe/a/" + n);
      if (data) {
        console.info("Search successful");
        this.hasLoaded = true;
        return {
          data: data,
          meta: d
        };
      } else {
        this.fail("404 Error");
      }
    } catch (e) {
      this.fail(e);
    }
  };

  // TODO - Return error message, become a S T R I N G Method
  fail = e => {
    console.error(e);
    this.hasLoaded = false;
    fixList
      .child(this.id)
      .set({
        id: this.id,
        title: this.title,
        romaji: this.romaji,
        date: Moment().format("MMMM Do YYYY, hh:mm:ss a")
      })
      .then(() =>
        console.info("Error message sent back, we'll be checking on it soon")
      );
  };
}

// TODO - Better class and method names.
export class RawFetcher {
  constructor(url, ep) {
    this.url = url;
    this.ep = ep;
    this.proxy = "https://cors.now.sh/";
  }

  // TODO - More methods to expand from.

  get = () => {
    const u = this.url;
    const e = this.ep;

    this.fetch(u, e);
    console.log(u, e);
  };

  fetch = async (source, e) => ({
    video: source,
    episode: e
  });
}

export default Y;
