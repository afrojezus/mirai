// The great string of correction!

export default string => {
  return string
    .replace("kantai-collection: kancolle", "kantai collection")
    .replace("sen to chihiro no kamikakushi", "spirited awaymovie")
    .replace("ookami kodomo no ame to yuki", "wolf children")
    .replace("★", "")
    .replace("?", "")
    .replace("aho-girl", "aho girl")
    .replace(".", "")
    .replace("houseki no kuni", "houseki no kuni (tv)")
    .replace("macross frontier", "macross f")
    .replace("macross delta", "macross d");
};
