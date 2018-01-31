import Cheerio from 'cheerio';
import Request from 'request-promise';
let Proxy2 = "https://cors-anywhere.herokuapp.com/";
let Proxy1 = "https://cors.now.sh/";

let URL = "https://twist.moe";
/**
 * Twist.load() - Get the entire list of animes from Anime Twist
 */
const load = async () => {
  let output = [];
  const data = {
    uri: Proxy2 + URL,
    transform: body => {
      return Cheerio.load(body);
    }
  };
  try {
    const source = await Request(data);
    const que =
      source(".series ul")
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
              Proxy2 +
              URL +
              source(index)
                .children("a")
                .attr("href")
          })
        });
    if (que) return output;
  } catch (error) {
    return error;
  }
};

/**
 * Twist.get ( query ) - Uses query to get an anime from the database of Anime Twist
 */
const get = async query => {
  const output = [];
  const data = {
    uri: Proxy2 + query,
    transform: body => {
      return Cheerio.load(body);
    }
  };
  try {
    const source = await Request(data);
    const que =
      source("div.episode-list ul")
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
          })
        });
    if (que) return output;
  } catch (error) {
    return error;
  }
};

const getSource = async ep => {
  const data = {
    uri: Proxy2 + ep,
    transform: body => {
      return Cheerio.load(body);
    }
  }
  try {
    const source = await Request(data);
    if (source) {
      const parser = new DOMParser();
      let video = source("body")
        .children("section")
        .children("main")
        .children("vi-player")
        .children("noscript").text()
        let srcParsed = source.parseHTML(video);
      let src = source(srcParsed).eq(1).attr('src');
      const url = decodeURI(`https://twist.moe${src}`);
      let urlX = url.includes("https://twist.moe ")
        ? url.replace("https://twist.moe ", "https://twist.moe")
        : url;
      if (url) return decodeURI(urlX);
    }
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
