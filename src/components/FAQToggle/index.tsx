import { FC, useState } from 'react';
import styled from 'styled-components';

import ToggleDown from 'assets/icons/ToggleDown.svg';
import ToggleUp from 'assets/icons/ToggleUp.svg';

interface Props {
  title: string;
  content: string;
}

const FAQToggle: FC<Props> = ({ title, content }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <FAQWrapper>
      <FAQTitle>
        {title}
        <ToggleBtn
          src={open ? ToggleUp : ToggleDown}
          onClick={() => setOpen(!open)}
        />
      </FAQTitle>
      <FAQContent visible={open}>{content}</FAQContent>
    </FAQWrapper>
  );
};

const FAQWrapper = styled.div`
  width: 1000rem;
  margin-bottom: 20rem;
  padding: 0 30rem;
  box-sizing: border-box;
  object-fit: contain;
  border-radius: 14rem;
  box-shadow: 0 4rem 16rem 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;

  display: flex;
  flex-direction: column;
  justify-content: center;

  font-family: Pretendard;
  font-size: 20rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: left;
  color: #000;

  transition: all 1s;
`;

const FAQTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 84rem;
`;

const ToggleBtn = styled.img`
  width: 45rem;
  height: 45rem;
  &:hover {
    cursor: pointer;
  }
`;

const FAQContent = styled.div<{ visible: boolean }>`
  font-family: Pretendard;
  font-size: 18rem;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: left;
  color: #676767;

  overflow: hidden;
  max-height: ${(props) => (props.visible ? '100rem' : '0')};
  padding-bottom: ${(props) => (props.visible ? '30rem' : '0')};
  transition: 0.3s ease;
`;

export default FAQToggle;
