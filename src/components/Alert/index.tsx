import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { lightTheme } from 'styles/theme';

interface ModalProps {
  cancel: () => void;
  confirm: () => void | Promise<void>;
  visible: boolean;
  children: ReactElement;
}

const Alert: FC<ModalProps> = ({ cancel, confirm, visible, children }) => {
  return (
    <Visible visible={visible}>
      <ModalOverlay visible={visible} />
      <ModalWrapper tabIndex={-1} visible={visible}>
        <Root visible={visible}>
          {children}
          <ButtonWrapper>
            <WhiteButton onClick={cancel}>취소</WhiteButton>
            <PurpleButton onClick={confirm}>확인</PurpleButton>
          </ButtonWrapper>
        </Root>
      </ModalWrapper>
    </Visible>
  );
};

const Visible = styled.div<{ visible: boolean }>`
  ${(props) => (props.visible ? '' : 'display: none;')}
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 191rem;
  height: 50rem;
  border-radius: 5rem;
  font-family: Pretendard;
  font-size: 18rem;
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
  border: solid 1rem ${(props) => props.theme.color.placeHolder};
  color: ${(props) => props.theme.color.placeHolder};
  background-color: ${(props) => props.theme.color.alertBackground};
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.color.hover};
  }
`;

const PurpleButton = styled(Button)`
  border: none;
  color: #fff;
  background-color: #7b68ee;
  margin-left: 20rem;
  &:hover {
    cursor: pointer;
    background-color: #6a58d3;
  }
`;

const Root = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 442rem;
  border-radius: 14rem;
  box-shadow: 0 3rem 16rem 0 rgba(0, 0, 0, 0.16);
  background-color: ${(props) => props.theme.color.alertBackground};

  padding: 20rem;
  box-sizing: border-box;
  object-fit: contain;
  opacity: ${(props) => (props.visible ? '1' : '0')};

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  opacity: ${(props) => (props.theme === lightTheme ? '0.16' : '0.5')};
  z-index: 1999;
`;

export default Alert;
