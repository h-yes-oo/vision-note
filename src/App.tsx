import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import Root from './routes';

interface Props {}

const App: FC<Props> = () => {
  return (
    <RecoilRoot>
      <Root />
    </RecoilRoot>
  );
};

export default App;
