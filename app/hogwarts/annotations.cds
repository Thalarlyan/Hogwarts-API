using HogwartsService as service from '../../srv/hogwarts-service';
annotate service.CharacterBooks with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'characterId',
                Value : characterId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'characterName',
                Value : characterName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'booksJson',
                Value : booksJson,
            },
            {
                $Type : 'UI.DataField',
                Label : 'updatedAt',
                Value : updatedAt,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'characterId',
            Value : characterId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'characterName',
            Value : characterName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'booksJson',
            Value : booksJson,
        },
        {
            $Type : 'UI.DataField',
            Label : 'updatedAt',
            Value : updatedAt,
        },
    ],
);

