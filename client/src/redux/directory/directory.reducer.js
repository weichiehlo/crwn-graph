const INITIAL_STATE = {
  sections: [
    {
      title: 'Fortinet',
      imageUrl: 'https://i.ytimg.com/vi/We4MQrjySHw/maxresdefault.jpg',
      id: 1,
      linkUrl: 'https://finance.yahoo.com/quote/FTNT/'
    },
    {
      title: 'Nvidia',
      imageUrl: 'https://s3.amazonaws.com/cms.ipressroom.com/219/files/20149/543c131bfe058b228e020181_slide1/slide1_mid.jpg',
      id: 2,
      linkUrl: 'https://finance.yahoo.com/quote/NVDA/'
    },
    {
      title: 'Jets',
      imageUrl: 'https://ei.marketwatch.com/Multimedia/2019/02/25/Photos/ZQ/MW-HE536_airpla_20190225131547_ZQ.jpg?uuid=5fa81d1a-3929-11e9-9462-ac162d7bc1f7',
      id: 3,
      linkUrl: 'https://finance.yahoo.com/quote/JETS/'
    },
    {
      title: 'Spotify',
      imageUrl: 'https://www.scdn.co/i/_global/open-graph-default.png',
      size: 'large',
      id: 4,
      linkUrl: 'https://finance.yahoo.com/quote/SPOT/'
    },
    {
      title: 'Micron',
      imageUrl: 'https://static.seekingalpha.com/uploads/2019/12/9/36303466-1575904412430061.png',
      size: 'large',
      id: 5,
      linkUrl: 'https://finance.yahoo.com/quote/MU/'
    }
  ]
};

const directoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default directoryReducer;
