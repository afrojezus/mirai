// fetch anime from nyaa
// fetch file from nyaa
import * as W from 'webtorrent'
import fetchCheerioObject from "fetch-cheerio-object";

let prx = "https://cors-anywhere.herokuapp.com/";

// WebTorrent temp client
const client = new W();

/**
 * getList
 * @param anime
 * @returns {Promise<array>}
 */
const getList = async (anime) => {
    let array = [];
    const l = await fetchCheerioObject(prx + 'https://nyaa.si/user/HorribleSubs?f=2&c=1_2&q=' + anime);
    try {
        const list = l('tbody')
            .children('tr.success')
            .each((k, i) => {
                let title = l(i).children('td:nth-child(2)').children('a')[2] ? l(i).children('td:nth-child(2)').children('a:nth-child(2)').text().trim() : l(i).children('td:nth-child(2)').children('a').text().trim();
                let quality = title.match('1080p') ? 1080 : title.match('720p') ? 720 : title.match('480p') ? 480 : 'N/A';
                return array.push({
                    title,
                    torrent: prx + 'https://nyaa.si' + l(i).children('td:nth-child(3)').children('a').attr('href'),
                    quality,
                })
            })
        if (list) return array;
    } catch (error) {
        return error;
    }
}

/**
 * getSource
 * @param torrent
 * @returns {Promise<void>}
 */
const getSource = (torrent, callback) => client.add(torrent, (t) => {
    t.files.forEach((file) => callback(t, file))
    });

/**
 * destroyClient
 */
const destroyClient = (torrent) => client.remove(torrent);

export default {
    getList,
    getSource,
    destroyClient
}