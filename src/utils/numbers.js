// TODO - Make MAKEID more specific to AniList IDs
export function makeid () {
  var text = '';
  var possible = '0123456789';

  for (var i = 0; i < 3; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}

export const next = (db, key) => {
  for (var i = 0; i < db.length; i++) {
    if (db[i].key === key) {
      return db[i + 1] && db[i + 1].value
    }
  }
};
