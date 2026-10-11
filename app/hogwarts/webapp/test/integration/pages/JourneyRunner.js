sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"hogwarts/test/integration/pages/CharacterBooksList.gen",
	"hogwarts/test/integration/pages/CharacterBooksObjectPage.gen"
], function (JourneyRunner, CharacterBooksListGenerated, CharacterBooksObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('hogwarts') + '/test/flp.html#app-preview',
        pages: {
			onTheCharacterBooksListGenerated: CharacterBooksListGenerated,
			onTheCharacterBooksObjectPageGenerated: CharacterBooksObjectPageGenerated
        },
        async: true
    });

    return runner;
});

