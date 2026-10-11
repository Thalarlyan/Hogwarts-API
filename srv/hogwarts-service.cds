using { hogwarts as db } from '../db/schema';

service HogwartsService {

  @readonly
  @cds.persistence.skip
  entity Characters {
    key ID      : String;
        name    : String;
        house   : String;
        species : String;
        gender  : String;
        image   : String;
        books   : Association to many CharacterBooks
                    on books.characterID = $self.ID;
  }

  @readonly
  entity CharacterBooks as projection on db.CharacterBooks;
}