import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import RecordingPage from 'pages/RecordingPage';
import MainPage from 'pages/MainPage';

interface Props {}

const Root: FC<Props> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/recording" component={RecordingPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Root;
