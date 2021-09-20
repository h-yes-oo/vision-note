import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';

interface ModalProps {
  cancle: () => void;
  confirm: () => void | Promise<void>;
  visible: boolean;
  children: ReactElement;
}

const Alert: FC<ModalProps> = ({ cancle, confirm, visible, children }) => {
  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper tabIndex={-1} visible={visible}>
        <Root visible={visible}>
          {children}
          <ButtonWrapper>
            <WhiteButton onClick={cancle}>취소</WhiteButton>
            <PurpleButton onClick={confirm}>확인</PurpleButton>
          </ButtonWrapper>
        </Root>
      </ModalWrapper>
    </>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 191px;
  height: 50px;
  border-radius: 5px;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WhiteButton = styled(Button)`
  border: solid 1px #c5c5c5;
  color: #c5c5c5;
  background-color: #fff;
  &:hover {
    cursor: pointer;
    background-color: #f6f8fa;
  }
`;

const PurpleButton = styled(Button)`
  border: none;
  color: #fff;
  background-color: #7b68ee;
  margin-left: 20px;
  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const Root = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 442px;
  border-radius: 14px;
  box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.16);
  background-color: #fff;

  padding: 20px;
  box-sizing: border-box;
  object-fit: contain;
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
  z-index: ${(props) => (props.visible ? '2000' : '-1')};
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
  z-index: 1999;
`;

export default Alert;
