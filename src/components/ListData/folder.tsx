import { FC, useState } from 'react';
import styled from 'styled-components';

import FolderPurple from 'assets/icons/FolderPurple.svg';
import FolderBlue from 'assets/icons/FolderBlue.svg';
import FolderPurpleClosed from 'assets/icons/FolderPurpleClosed.svg';
import FolderBlueClosed from 'assets/icons/FolderBlueClosed.svg';

import ListData from './list';

interface Props {
  title: string | undefined;
  depth: number;
  opened: boolean;
}

const FolderData: FC<Props> = ({ title, depth, opened }) => {
  const [open, setOpen] = useState<boolean>(opened);
  const folderImage = () => {
    if (depth % 2 === 0) return open ? FolderPurple : FolderPurpleClosed;
    return open ? FolderBlue : FolderBlueClosed;
  };

  const handleClick = () => {
    setOpen(!open);
    console.log('clicked');
  };

  return (
    <>
      <DataRow onClick={handleClick}>
        <TitleData>
          <TitleImage depth={depth} src={folderImage()} />
          <TitleName> {title} </TitleName>
        </TitleData>
      </DataRow>
      {open &&
        SampleData.map((data, index) => (
          <ListData
            key={`${data.itemType}.${
              data.noteFile
                ? data.noteFile!.file_id
                : data.noteFolder!.folder_id
            }`}
            data={data}
            depth={depth + 1}
          />
        ))}
    </>
  );
};

const SampleData = [
  {
    itemType: 'FILE',
    noteFile: {
      file_id: 4,
      user_id: 3,
      folder_id: 2,
      file_name: '수학 다시 보는 개념',
      created_at: '2021-08-03 13:20:05.0',
      updated_at: '2021-08-03 13:20:05.0',
    },
    noteFolder: null,
  },
  {
    itemType: 'FOLDER',
    noteFile: null,
    noteFolder: {
      folder_id: 5,
      user_id: 3,
      parent_folder_id: 2,
      folder_name: '한국사',
      created_at: '2021-08-03 13:18:13.0',
      updated_at: '2021-08-03 13:18:13.0',
    },
  },
  {
    itemType: 'FOLDER',
    noteFile: null,
    noteFolder: {
      folder_id: 6,
      user_id: 3,
      parent_folder_id: 2,
      folder_name: '쉽게 배우는 알고리즘',
      created_at: '2021-08-03 13:18:13.0',
      updated_at: '2021-08-03 13:18:13.0',
    },
  },
];

const DataRow = styled.tr`
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

const TableData = styled.td`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.19;
  letter-spacing: normal;
  text-align: left;
  color: #000;

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
`;

const TitleImage = styled.img<{ depth: number }>`
  width: 24px;
  margin-right: 11px;
  margin-left: ${(props) => `${props.depth * 20}px`};
`;

export default FolderData;
