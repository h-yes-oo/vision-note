import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { authenticateToken } from 'state';
import RecordingPage from 'pages/RecordingPage';
import MainPage from 'pages/MainPage';
import NotesPage from 'pages/NotesPage';
import FolderPage from 'pages/FolderPage';

interface Props {}

const Root: FC<Props> = () => {
  const authToken = useRecoilValue(authenticateToken);
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={authToken === null ? MainPage : FolderPage}
        />
        <Route path="/notes" component={NotesPage} />
        <Route path="/recording" component={RecordingPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Root;
