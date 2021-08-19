import { FC, useState } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import BaseLayout from 'components/BaseLayout';

import OhMyGod from 'assets/images/OhMyGod.png';

interface Props {}

const Oh = styled.img`
  width: 1000px;
  margin: 30px;
`;

const FolderPage: FC<Props> = () => {
  return (
    <BaseLayout grey>
      <Oh src={OhMyGod} />
    </BaseLayout>
  );
};

export default FolderPage;
