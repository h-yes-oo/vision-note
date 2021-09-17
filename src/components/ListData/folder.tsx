import { FC, useState, useEffect, ReactNode } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import FolderPurple from 'assets/icons/FolderPurple.svg';
import FolderBlue from 'assets/icons/FolderBlue.svg';
import FolderPurpleClosed from 'assets/icons/FolderPurpleClosed.svg';
import FolderBlueClosed from 'assets/icons/FolderBlueClosed.svg';

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

  useEffect(() => {
    let token: string;
    const authenticate = async () => {
      const frm = new FormData();
      frm.append('email', 'hyesoo5115@naver.com');
      frm.append('password', '1q2w3e4r');
      try {
        const response = await axios.post('/v1/authenticate', frm);
        token = response.data.token;
      } catch (e) {
        console.log('authenticate error');
      }
    };
    // authenticate();
    const getFolderItems = async () => {
      // const token =
      //   'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTYzMTY3MDkwOH0.gJr_2Y0LEBwS5k26hg1uoEfgdQjHigFxHLbStZH95WYP1rlQraMRdGmGGZz0ULm9sBaO84AemaftQuCmZsV9IQ';
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get(`/v1/note/folder/${folderId}`, config);
      console.log(response.data);
      const folderData: NoteResponse[] = response.data;
      if (folderData.length === 0) console.log(folderId);
      if (folderData !== undefined)
        setNotes(
          folderData.map((value, index) => (
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
    authenticate().then(() => {
      getFolderItems();
    });
  }, []);

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

// const SampleData = [
//   {
//     itemType: 'FILE',
//     noteFile: {
//       fileId: 4,
//       userId: 3,
//       folderId: 2,
//       fileName: '수학 다시 보는 개념',
//       createdAt: '2021-08-03 13:20:05.0',
//       updatedAt: '2021-08-03 13:20:05.0',
//     },
//     noteFolder: null,
//   },
//   {
//     itemType: 'FOLDER',
//     noteFile: null,
//     noteFolder: {
//       folderId: 5,
//       userId: 3,
//       parent_folderId: 2,
//       folderName: '한국사',
//       createdAt: '2021-08-03 13:18:13.0',
//       updatedAt: '2021-08-03 13:18:13.0',
//     },
//   },
//   {
//     itemType: 'FOLDER',
//     noteFile: null,
//     noteFolder: {
//       folderId: 6,
//       userId: 3,
//       parent_folderId: 2,
//       folderName: '쉽게 배우는 알고리즘',
//       createdAt: '2021-08-03 13:18:13.0',
//       updatedAt: '2021-08-03 13:18:13.0',
//     },
//   },
// ];

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
