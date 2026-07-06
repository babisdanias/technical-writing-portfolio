const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting started guide',
      items: ['getting-started-open-library/open-library-guide'],
    },
    {
      type: 'category',
      label: 'Tutorial — Europeana API',
      items: [
        'tutorial-europeana/europeana-tutorial',
        'tutorial-europeana/tutorial-reference',
      ],
    },
    {
      type: 'category',
      label: 'Concept doc',
      items: ['concept-rights-licensing/rights-licensing'],
    },
  ],
};

module.exports = sidebars;