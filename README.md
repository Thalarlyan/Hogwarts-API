# Hogwarts-API
2026/27/I SAP course work version control

## Character queries

The CAP service exposes characters at `/odata/v4/hogwarts/Characters`. It supports OData key lookups, exact filters on `ID`, `name`, and `house`, `$search` on character names, and paging with `$top` and `$skip`. The Fiori Elements filter bar presents `house` as a dropdown with the four Hogwarts houses.

Examples:

```text
/odata/v4/hogwarts/Characters('1')
/odata/v4/hogwarts/Characters?$filter=ID%20eq%20'1'
/odata/v4/hogwarts/Characters?$filter=house%20eq%20'Gryffindor'
/odata/v4/hogwarts/Characters?$top=25&$skip=25&$count=true
```

Paging is applied after filtering, and `$count=true` reports the number of matching characters before paging.