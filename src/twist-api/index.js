import fetchCheerioObject from "fetch-cheerio-object";

let Proxy1 = "https://cors-anywhere.herokuapp.com/";
let Proxy2 = "https://cors.now.sh/";

let URL = "https://twist.moe/";
/**
 * Twist.load() - Get the entire list of animes from Anime Twist
 */
const load = async () => {
  let output = [];
  const source = await fetchCheerioObject(Proxy1 + URL);
  try {
    const data = source(".series ul")
      .children("li")
      .each((key, index) => {
        output.push({
          name: source(index).children("a")[1]
            ? source(index)
                .children("a")
                .text()
                .replace("ONGOING", "")
                .trim()
            : source(index)
                .children("a")
                .text()
                .trim(),
          ongoing: source(index).children("a")[1] ? true : false,
          link:
            Proxy1 +
            URL +
            source(index)
              .children("a")
              .attr("href")
        });
      });
    if (data) return output;
  } catch (error) {
    return error;
  }
};

/**
 * Twist.get ( query ) - Uses query to get an anime from the database of Anime Twist
 */
const get = async query => {
  const output = [];
  try {
    const source = await fetchCheerioObject(query);
    const data = source("div.episode-list ul")
      .children("li:not(:has(button))")
      .each(async (index, e) => {
        const ep =
          parseInt(
            source(e)
              .find("a")
              .attr("data-episode"),
            10
          ) + 1;
        const name = "Episode " + ep;
        const link = `https://twist.moe${source(e)
          .find("a")
          .attr("href")}`;
        const provider = "Twist";
        output.push({
          name,
          link,
          ep,
          provider
        });
      });
    if (data) return output;
  } catch (error) {
    return error;
  }
};

const getSource = async ep => {
  try {
    const source = await fetchCheerioObject(Proxy1 + ep);
    let video = source("body")
      .children("section")
      .children("main")
      .children("vi-player")
      .children("noscript")
      .children("video")
      .attr("src");
    const url = `https://twist.moe${video}`;
    if (url) return decodeURI(url);
  } catch (error) {
    return error;
  }
};

/**
 * Twist API - a Anime Twist api-wrapper for JS applications. ES6+
 *
 */
let Twist = {
  get,
  load,
  getSource
};

export default Twist;
