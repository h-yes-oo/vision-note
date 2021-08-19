import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ModalWrapper = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
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

interface ModalProps {
  className: string;
  onClose: any;
  maskClosable: boolean;
  btnClosable: boolean;
  visible: boolean;
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

const Modal: FC<ModalProps> = ({
  className,
  onClose,
  maskClosable,
  btnClosable,
  visible,
  children,
}) => {
  const onMaskClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  const dummyClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    console.log('happy !');
  };

  const close = (e: any) => {
    if (onClose) {
      onClose(e);
    }
  };

  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper
        className={className}
        onClick={maskClosable ? onMaskClick : dummyClick}
        tabIndex={-1}
        visible={visible}
      >
        {React.cloneElement(children, {
          closeftn: close,
        })}
      </ModalWrapper>
    </>
  );
};

export default Modal;
