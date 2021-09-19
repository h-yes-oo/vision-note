import { FC, useState, useEffect, ReactNode } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useRecoilValue } from 'recoil';

import FolderPurple from 'assets/icons/FolderPurple.svg';
import FolderBlue from 'assets/icons/FolderBlue.svg';
import FolderPurpleClosed from 'assets/icons/FolderPurpleClosed.svg';
import FolderBlueClosed from 'assets/icons/FolderBlueClosed.svg';
import { authenticateToken } from 'state';
import ListData, { NoteResponse } from './list';

interface Props {
  title: string | undefined;
  folderId: number;
  depth: number;
  opened: boolean;
  menu: any;
}

const FolderData: FC<Props> = ({ title, folderId, depth, opened, menu }) => {
  const [open, setOpen] = useState<boolean>(opened);
  const [notes, setNotes] = useState<ReactNode>(<></>);
  const folderImage = () => {
    if (depth % 2 === 0) return open ? FolderPurple : FolderPurpleClosed;
    return open ? FolderBlue : FolderBlueClosed;
  };
  const authToken = useRecoilValue(authenticateToken);

  useEffect(() => {
    const getFolderItems = async () => {
      const config = {
        headers: { Authorization: `Bearer ${authToken}` },
      };
      const response = await axios.get(`/v1/note/folder/${folderId}`, config);
      const folderData: NoteResponse[] = response.data;
      if (folderData !== undefined)
        setNotes(
          folderData.map((value) => (
            <ListData
              key={`${value.itemType}.${
                value.noteFile
                  ? value.noteFile!.fileId
                  : value.noteFolder!.folderId
              }`}
              data={value}
              depth={depth + 1}
              menu={menu}
            />
          ))
        );
    };
    if (authToken !== null) getFolderItems();
  }, [authToken]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <DataRow
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onClick={handleClick}
      >
        <TitleData>
          <TitleImage depth={depth} src={folderImage()} />
          <TitleName> {title} </TitleName>
        </TitleData>
      </DataRow>
      {open && notes}
    </>
  );
};

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
  user-select: none !important;
`;

const TitleImage = styled.img<{ depth: number }>`
  width: 24px;
  margin-right: 11px;
  margin-left: ${(props) => `${props.depth * 20}px`};
  user-select: none !important;
`;

export default FolderData;
