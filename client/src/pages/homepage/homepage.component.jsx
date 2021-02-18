import React from 'react';

import Directory from '../../components/directory/directory.component';

import { HomePageContainer,HomePageTitle } from './homepage.styles';

const HomePage = () => (
    <HomePageContainer>
      <HomePageTitle>Data Analytics Platform</HomePageTitle>
      <Directory/>
    </HomePageContainer>
  );

export default HomePage;
