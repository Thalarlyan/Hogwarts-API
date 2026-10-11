namespace hogwarts;

entity CharacterBooks {
  key characterID : String;
  key bookID      : String;
      title       : String;
      author      : String;
      releaseDate : String;
      pages       : Integer;
      cover       : String;
}