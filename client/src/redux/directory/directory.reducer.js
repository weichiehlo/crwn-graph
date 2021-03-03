const INITIAL_STATE = {
  sections: [
    {
      title: 'Composed Chart',
      imageUrl: 'https://screenshots.imgix.net/recharts/recharts/composed-chart/1.6.2/5cebdcd93ebea5001b26cd28/293dab6f-78ae-4630-a7c2-b80f49df06c9.png',
      id: 1,
      linkUrl: 'composedchart'
    },{
      title: 'Pie Chart',
      imageUrl: 'https://spark.adobe.com/sprout/api/images/978c76de-15ac-4f1f-8a13-55cda19813e0',
      id: 2,
      linkUrl: 'piechart'
    },
    {
      title: 'Versus Chart',
      imageUrl: 'https://lh3.googleusercontent.com/-QiDIuklSBM2J3jZRbzt-byWdz_QKcSYceCLanKLHgITAxpDj_dBN-fdW-Ijx1-Kzg=w600-rwa',
      id: 3,
      linkUrl: 'versuschart'
    },
  ]
};

const directoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default directoryReducer;
