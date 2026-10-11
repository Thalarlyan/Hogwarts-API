using { hogwarts as db } from '../db/schema';

service HogwartsService {
  entity CharacterBooks as projection on db.CharacterBooks;

  function characters(page : Integer, size : Integer, q : String) returns LargeString;
}