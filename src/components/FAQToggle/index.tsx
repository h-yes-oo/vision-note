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
  width: 1000px;
  margin-bottom: 20px;
  padding: 0 30px;
  box-sizing: border-box;
  object-fit: contain;
  border-radius: 14px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;

  display: flex;
  flex-direction: column;
  justify-content: center;

  font-family: Pretendard;
  font-size: 20px;
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
  height: 84px;
`;

const ToggleBtn = styled.img`
  width: 45px;
  height: 45px;
`;

const FAQContent = styled.div<{ visible: boolean }>`
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.35;
  letter-spacing: normal;
  text-align: left;
  color: #676767;

  overflow: hidden;
  max-height: ${(props) => (props.visible ? '100px' : '0')};
  padding-bottom: ${(props) => (props.visible ? '30px' : '0')};
  transition: 0.3s ease;
`;

export default FAQToggle;
