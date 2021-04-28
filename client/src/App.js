import React, { useEffect, lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from './components/header/header.component';
import Spinner from './components/spinner/spinner.component'
import ErrorBoundary from './components/error-boundary/error-boundary.component'

import { GlobalStyle } from './global.styles';

import { selectCurrentUser } from './redux/user/user.selectors';
import { checkUserSession } from './redux/user/user.actions';

const HomePage = lazy(()=>import('./pages/homepage/homepage.component'));
const SignInAndSignUpPage = lazy(()=>import('./pages/sign-in-and-sign-up/sign-in-and-sign-up.component'));
const ContactPage = lazy(()=>import('./pages/contactpage/contact.component.jsx'));
const ComposedChartPage = lazy(()=>import('./pages/composedchartpage/composedchartpage.component'))
const BlackListPage = lazy(()=>import('./pages/black-list-page/black-list-page.component'))
const PieChartPage = lazy(()=>import('./pages/piechartpage/piechartpage.component'))
const VersusChartPage = lazy(()=>import('./pages/versuschartpage/versuschartpage.component'))

const App = ({ checkUserSession, currentUser }) => {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return (
    <div>
      <GlobalStyle />
      <Header />
      <Switch>
        <ErrorBoundary>
          <Suspense fallback={<Spinner/>}>
              <Route exact path='/' component={HomePage} />
              <Route path='/composedchart' component={ComposedChartPage} />
              <Route path='/blacklist' component={BlackListPage} />
              <Route path='/contact' component={ContactPage} />
              <Route path='/piechart' component={PieChartPage}/>
              <Route path='/versuschart' component={VersusChartPage}/>
              <Route
                exact
                path='/signin'
                render={() =>
                  currentUser ? <Redirect to='/' /> : <SignInAndSignUpPage />
                }
              />
            </Suspense>
        </ErrorBoundary>
      </Switch>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSession())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
