import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectUserGraph } from '../../redux/graph/graph.selectors'
import { selectPgSql } from '../../redux/pg/pg.selectors';
import { signOutStart } from '../../redux/user/user.actions';


import { ReactComponent as Logo } from '../../assets/crown.svg';

import {
  HeaderContainer,
  LogoContainer,
  OptionsContainer,
  OptionLink,
  PagesNavContainer
} from './header.styles';

const Header = ({ currentUser, hidden, signOutStart,userGraph, sql}) => (
  <HeaderContainer>
    <LogoContainer to='/'>
      <Logo className='logo' />
    </LogoContainer>
    <PagesNavContainer>
      <OptionLink to='/composedchart'>COMPOSED CHART</OptionLink>
      <OptionLink to='/piechart'>PIE CHART</OptionLink>
      <OptionLink to='/versuschart'>VERSUS CHART</OptionLink>
    </PagesNavContainer>
    <OptionsContainer>
      <OptionLink to='/contact'>CONTACT</OptionLink>
      {currentUser ? (
        <OptionLink as='div' onClick={()=>signOutStart({...userGraph,sql:sql})}>
          SIGN OUT
        </OptionLink>
      ) : (
        <OptionLink to='/signin'>SIGN IN</OptionLink>
      )}
    </OptionsContainer>
  </HeaderContainer>
);

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  userGraph: selectUserGraph,
  sql: selectPgSql

});

const mapDispatchToProps = dispatch => ({
  signOutStart: (useGraphs) => dispatch(signOutStart(useGraphs))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
