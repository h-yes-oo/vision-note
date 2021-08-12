import { FC, ReactNode } from 'react';
import styled from 'styled-components';

import BaseLayout from 'components/BaseLayout';

interface Props {}

const NotesPage: FC<Props> = () => {
  return (
    <BaseLayout>
      <>this is a note page</>
    </BaseLayout>
  );
};

export default NotesPage;
