import { FC, useState, ReactNode } from 'react';
import styled from 'styled-components';

import NoteData from 'components/ListData/note';
import FolderData from 'components/ListData/folder';

export interface NoteFile {
  file_id: number;
  user_id: number;
  folder_id: number;
  file_name: string;
  created_at: string;
  updated_at: string;
}

export interface NoteFolder {
  folder_id: number;
  user_id: number;
  parent_folder_id: number;
  folder_name: string;
  created_at: string;
  updated_at: string;
}

export interface NoteResponse {
  itemType: string;
  noteFile: NoteFile | null;
  noteFolder: NoteFolder | null;
}

interface Props {
  data: NoteResponse;
  depth: number;
  menu: any;
}

const ListData: FC<Props> = ({ data, depth, menu }) => {
  if (data.itemType === 'FILE') {
    const note = data.noteFile;
    const oldDate = note?.created_at;
    const newDate = `${oldDate?.substr(0, 4)}.${oldDate?.substr(
      5,
      2
    )}.${oldDate?.substr(8, 2)}`;
    return (
      <NoteData
        key={note?.file_id}
        title={note?.file_name}
        depth={depth}
        date={newDate}
        starred
        subject="과학"
        menu={menu}
        noteId={note!.file_id}
      />
    );
  }
  const folder = data.noteFolder;
  return (
    <FolderData
      key={folder?.folder_id}
      title={folder?.folder_name}
      depth={depth}
      opened={false}
      menu={menu}
    />
  );
};

export default ListData;
