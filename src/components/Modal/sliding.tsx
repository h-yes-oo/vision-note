import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import * as T from 'types';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Close from 'assets/icons/Close.svg';
import Login from 'components/Modal/login';
import SignUp from 'components/Modal/signup';
import Find from 'components/Modal/find';

const ModalWrapper = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: block;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${(props) => (props.visible ? '1000' : '-1')};
  ${(props) => (props.visible ? '' : 'transition: all 0.5s;')};
  overflow: auto;
  outline: 0;
`;

const ModalOverlay = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
`;

const Root = styled.div<{ visible: boolean }>`
  width: 500px;
  height: 1080px;
  padding: 40px 40px 230px;
  background-color: #fff;
  position: fixed;
  transition: all 0.5s;
  transform: translate3d(${(props) => (props.visible ? '0' : '100%')}, 0, 0);
  right: 0;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
`;

const ClostBtn = styled.img`
  width: 24px;
  height: 24px;
`;

interface ModalProps {
  onClose: any;
  visible: boolean;
  type: T.ModalType;
}

const SlidingModal: FC<ModalProps> = ({ onClose, visible, type }) => {
  const [modalType, setModalType] = useState<T.ModalType>(type);
  const onMaskClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  useEffect(() => {
    setModalType(type);
  }, [type]);

  const close = (e: any) => {
    if (onClose) {
      onClose(e);
    }
  };

  const toFind = () => setModalType(T.ModalType.Find);
  const toLogin = () => setModalType(T.ModalType.Login);
  const toSignUp = () => setModalType(T.ModalType.SignUp);

  const content = (type: T.ModalType) => {
    if (type === T.ModalType.Login)
      return <Login toFind={toFind} toSignUp={toSignUp} />;
    if (type === T.ModalType.SignUp) return <SignUp toLogin={toLogin} />;
    if (type === T.ModalType.Find) return <Find toSignUp={toSignUp} />;
    return null;
  };

  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper onClick={onMaskClick} tabIndex={-1} visible={visible}>
        <Root visible={visible}>
          <ClostBtn src={Close} onClick={close} />
          {content(modalType)}
        </Root>
      </ModalWrapper>
    </>
  );
};

export default SlidingModal;
