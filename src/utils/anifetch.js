var Rp = require("request-promise");
var cheerio = require("cheerio");

// TODO - Add another source for anime that just isn't Twist?
export const twistFetch = function(pre, query) {
  const data = {
    uri: pre + query,
    transform: body => {
      return cheerio.load(body);
    }
  };
  return Rp(data)
    .then($ => {
      const result = {
        results: []
      };
      $("div.episode-list ul")
        .children("li:not(:has(button))")
        .each((index, e) => {
          const epNum =
            parseInt(
              $(e)
                .find("a")
                .attr("data-episode"),
              10
            ) + 1;
          const epLink = `https://twist.moe${$(e)
            .find("a")
            .attr("href")}`;
          const epUrl = epLink.replace("https://twist.moe/a/", "");
          const epName = "Episode " + epNum;
          const epVideo = decodeURI(
            `https://twist.moe${$("body")
              .children("section")
              .children("main")
              .children("vi-player")
              .children("noscript")
              .children("video")
              .attr("src")}`
          );
          const provider = "Twist";
          result.results.push({
            epName,
            epNum,
            epUrl,
            epLink,
            epVideo,
            provider
          });
        });
      // console.log(result.results)
      return result.results;
    })
    .catch(err => console.error(err));
};
