import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';

import Loading from 'components/Loading';
import Root from './routes';

interface Props {}

const App: FC<Props> = () => {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<Loading notes={false} />}>
        <Root />
      </React.Suspense>
    </RecoilRoot>
  );
};

export default App;
