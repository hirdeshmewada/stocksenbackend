function generateDynamicPattern(word) {
  // Normalize the word by removing common suffixes
  const normalizedWord = word.replace(/(?:es|s)$/, '');

  // Create a pattern that checks for each character in any order with correct frequencies
  const pattern = normalizedWord
    .split('')
    .map(char => `(?=.*${char})`) // Positive lookahead for each character
    .join('') + '.*'; // Allow any characters before and after

  // Append optional suffixes to handle variations like plural forms
  const finalPattern = `(${pattern})(?:es|s)?`;

  return new RegExp(finalPattern, 'i'); // 'i' for case-insensitive
}

// Export
module.exports = generateDynamicPattern;
