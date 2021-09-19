import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import Root from './routes';

interface Props {}

const App: FC<Props> = () => {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Root />
      </React.Suspense>
    </RecoilRoot>
  );
};

export default App;
