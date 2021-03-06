import React, { FC } from 'react';
import styled from 'styled-components';

import Alert from '.';

interface ModalProps {
  cancel: () => void;
  confirm: () => void | Promise<void>;
  visible: boolean;
  message: string;
}

const AlertWithMessage: FC<ModalProps> = ({
  cancel,
  confirm,
  visible,
  message,
}) => {
  return (
    <Alert cancel={cancel} confirm={confirm} visible={visible}>
      <Message>{message}</Message>
    </Alert>
  );
};

const Message = styled.div`
  font-family: Pretendard;
  font-size: 16rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: ${(props) => props.theme.color.primaryText};
  padding: 20rem 19rem 39rem;
  white-space: break-spaces;
`;

export default AlertWithMessage;
