import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

interface ModalProps {
  onClose: any;
  visible: boolean;
  children: ReactElement;
}

const PopupModal: FC<ModalProps> = ({ onClose, visible, children }) => {
  const onMaskClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      onClose(e);
    }
  };

  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper onClick={onMaskClick} tabIndex={-1} visible={visible}>
        <Root visible={visible === undefined ? false : visible}>
          {React.cloneElement(children, { onClose, visible })}
        </Root>
      </ModalWrapper>
    </>
  );
};

const Root = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 1000px;
  height: 745px;
  padding: 80px;
  box-sizing: border-box;
  border-radius: 20px;
  object-fit: contain;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.16);
  background-color: #fff;
  opacity: ${(props) => (props.visible ? '1' : '0')};

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  > * {
    user-select: none !important;
  }
`;

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
  background: #000000;
  opacity: 0.16;
  z-index: 999;
`;

export default PopupModal;
