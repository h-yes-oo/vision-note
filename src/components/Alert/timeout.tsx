import { FC, useEffect } from 'react';
import styled from 'styled-components';
import { lightTheme } from 'styles/theme';
import { useRecoilState } from 'recoil';
import { alertInfo } from 'state';

interface ModalProps {}

const AlertTimeout: FC<ModalProps> = () => {
  const [visible, setVisible] = useRecoilState(alertInfo);

  useEffect(() => {
    if (visible.show) {
      setTimeout(() => setVisible({ show: false }), 2000);
    }
  }, [visible]);

  return (
    <Root visible={visible.show}>
      <Sorry>죄송합니다</Sorry>
      <Message>{visible.message ?? ''}</Message>
    </Root>
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
  text-align: left;
  color: ${(props) => props.theme.color.primaryText};
  white-space: break-spaces;
`;

const Sorry = styled(Message)`
  padding-bottom: 5rem;
  font-size: 20rem;
  color: ${(props) => props.theme.color.purple};
`;

const Root = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  width: 442rem;
  border-radius: 14rem;
  box-shadow: 0 3rem 16rem 0 rgba(0, 0, 0, 0.16);
  background-color: ${(props) => props.theme.color.alertBackground};

  padding: 20rem 30rem 30rem;
  box-sizing: border-box;
  object-fit: contain;
  opacity: ${(props) => (props.visible ? '1' : '0')};

  position: fixed;
  top: 5%;
  left: ${(props) => (props.visible ? '5%' : '-100rem')};
  z-index: 9999;
  transition: 0.5s;
`;

export default AlertTimeout;
