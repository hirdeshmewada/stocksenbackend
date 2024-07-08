function generateDynamicPattern(query) {
  // Split the query into individual words
  const words = query.split(" ");
  console.log("words", words);

  // Normalize the words by removing special characters and converting to lowercase
  const normalizedWords = words.map(word =>
    word.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
  );
  console.log("normalizedWords", normalizedWords);

  // Generate regex patterns for each normalized word
  const regexPatterns = normalizedWords.map(word => {
    // Match the word with optional special characters or suffixes
    return new RegExp(`${word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}.*`, 'i');
  });

  console.log("regexPatterns", regexPatterns);
  return regexPatterns;
}

module.exports = generateDynamicPattern;
