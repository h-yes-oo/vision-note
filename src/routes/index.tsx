import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import RecordingPage from 'pages/RecordingPage';
import MainPage from 'pages/MainPage';
import NotesPage from 'pages/NotesPage';
import FolderPage from 'pages/FolderPage';

interface Props {}

const Root: FC<Props> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/notes" component={NotesPage} />
        <Route path="/recording" component={RecordingPage} />
        <Route path="/folder" component={FolderPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Root;
