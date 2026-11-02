using HogwartsService as service from '../../srv/hogwarts-service';

annotate service.Characters with {
    @Common.ValueListWithFixedValues : true
    @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Houses',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : house,
                ValueListProperty : 'house',
            },
        ],
    }
    house;
};

annotate service.Characters with @(
    UI.SelectionFields : [
        ID,
        name,
        house,
    ],
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'ID',
                Value : ID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'house',
                Value : house,
            },
            {
                $Type : 'UI.DataField',
                Label : 'species',
                Value : species,
            },
            {
                $Type : 'UI.DataField',
                Label : 'gender',
                Value : gender,
            },
            {
                $Type : 'UI.DataField',
                Label : 'image',
                Value : image,
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
            Label : 'ID',
            Value : ID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'house',
            Value : house,
        },
        {
            $Type : 'UI.DataField',
            Label : 'species',
            Value : species,
        },
        {
            $Type : 'UI.DataField',
            Label : 'gender',
            Value : gender,
        },
    ],
);
