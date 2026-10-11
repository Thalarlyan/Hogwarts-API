namespace hogwarts;

entity CharacterBooks {
  key characterId : String;
  characterName   : String;
  booksJson       : LargeString;  // cached Gemini + book data result
  updatedAt       : Timestamp;
}