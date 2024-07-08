function generateDynamicPattern(query) {
  const words = query.split(" ");
  console.log("words", words);
  if (typeof words == "object" && words.length > 1) {

    const regexPatterns = words.map((word) => new RegExp(`^${word}$`, "i"));
    console.log("regexPatterns", regexPatterns);
    return regexPatterns;
  } else {
    const cleanWord = query.replace(/[^a-zA-Z0-9]/g, " ");
    const word = cleanWord.split(" ");
    console.log("cleanWord", cleanWord);
    const regexPatterns = word.map((word) => new RegExp(`^${word}$`, "i"));
    return regexPatterns;
  }
}

module.exports = generateDynamicPattern;
