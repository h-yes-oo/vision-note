import { FC } from 'react';
import styled from 'styled-components';

import Note from 'assets/icons/Note.svg';
import Star from 'assets/icons/Star.svg';

interface Props {
  title: string | undefined;
  depth: number;
  date: string;
  starred: boolean;
  subject: string;
  menu: any;
  noteId: number;
}

const NoteData: FC<Props> = ({
  title,
  depth,
  date,
  starred,
  subject,
  menu,
  noteId,
}) => {
  return (
    <>
      <DataRow onContextMenu={(e) => menu(e, noteId, true)}>
        <TitleData>
          <TitleImage depth={depth} src={Note} />
          <TitleName> {title} </TitleName>
        </TitleData>
        <StarData>{starred && <Image24 src={Star} />}</StarData>
        <DateData>{date}</DateData>
        <SubjectData>{subject}</SubjectData>
      </DataRow>
    </>
  );
};

const DataRow = styled.div`
  height: 65px;
  border-bottom: #e6e6e6 1px solid;
  padding: 0 30px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background-color: #f6f6f6;
  }
`;

const TableData = styled.div`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;

  user-select: none !important;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  white-space: nowrap;
`;

const TitleData = styled(TableData)`
  max-width: 570px;
  width: 570px;
  justify-content: flex-start;
`;

const TitleName = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  user-select: none !important;
`;

const DateData = styled(TableData)`
  width: 280px;
`;

const StarData = styled(TableData)`
  width: 52px;
`;

const SubjectData = styled(TableData)`
  width: 28px;
`;

const Image24 = styled.img`
  width: 24px;

  user-select: none !important;
`;

const TitleImage = styled(Image24)<{ depth: number }>`
  margin-right: 11px;
  margin-left: ${(props) => `${props.depth * 20}px`};
`;

export default NoteData;
