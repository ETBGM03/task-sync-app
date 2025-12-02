function isPalindrome(word: string): boolean {
  const reversedWord = word.split("").reverse().join("");

  return word === reversedWord;
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("level")); // true
