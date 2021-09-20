import React, { FC } from 'react';
import styled from 'styled-components';

import Alert from '.';

interface ModalProps {
  cancle: () => void;
  confirm: () => Promise<void>;
  visible: boolean;
  message: string;
}

const AlertWithMessage: FC<ModalProps> = ({
  cancle,
  confirm,
  visible,
  message,
}) => {
  return (
    <Alert cancle={cancle} confirm={confirm} visible={visible}>
      <Message>{message}</Message>
    </Alert>
  );
};

const Message = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #000;
  padding: 20px 19px 39px;
`;

export default AlertWithMessage;
