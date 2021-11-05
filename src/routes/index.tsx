import { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from 'styled-components';

import { userInfo, theme } from 'state';
import RecordingPage from 'pages/RecordingPage';
import MainPage from 'pages/MainPage';
import NotesPage from 'pages/NotesPage';
import FolderPage from 'pages/FolderPage';
import StartNotePage from 'pages/StartNotePage';
import SttDemoPage from 'pages/SttDemoPage';
import DemoPage from 'pages/DemoPage';

interface Props {}

const Root: FC<Props> = () => {
  const user = useRecoilValue(userInfo);
  const themeValue = useRecoilValue(theme);
  return (
    <ThemeProvider theme={themeValue}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            component={user === null ? MainPage : FolderPage}
          />
          <Route path="/note/:noteId" component={NotesPage} />
          <Route path="/recording" component={RecordingPage} />
          <Route path="/startnote" component={StartNotePage} />
          <Route path="/demo" component={SttDemoPage} />
          <Route path="/userDemo" component={DemoPage} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Root;
