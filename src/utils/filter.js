/**
 *  AniList to Twist filterizer
 */

export default (aniAL, twistData) => {
  return aniAL.filter(d => twistData.filter(s => s.name.match(d.title.romaji)));
};
