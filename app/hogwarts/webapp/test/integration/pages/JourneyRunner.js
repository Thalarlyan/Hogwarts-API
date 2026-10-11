sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"hogwarts/test/integration/pages/CharactersList.gen",
	"hogwarts/test/integration/pages/CharactersObjectPage.gen",
	"hogwarts/test/integration/pages/CharacterBooksObjectPage.gen"
], function (JourneyRunner, CharactersListGenerated, CharactersObjectPageGenerated, CharacterBooksObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('hogwarts') + '/test/flp.html#app-preview',
        pages: {
			onTheCharactersListGenerated: CharactersListGenerated,
			onTheCharactersObjectPageGenerated: CharactersObjectPageGenerated,
			onTheCharacterBooksObjectPageGenerated: CharacterBooksObjectPageGenerated
        },
        async: true
    });

    return runner;
});

