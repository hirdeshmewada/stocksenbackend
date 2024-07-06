function generateDynamicPattern(word) {
  // Create a pattern that checks for each character in any order
  const pattern = word
    .split('')
    .map(char => `(?=.*${char})`)
    .join('') + '.*';
  return new RegExp(pattern, 'i'); // 'i' for case-insensitive
}

//export
module.exports = generateDynamicPattern