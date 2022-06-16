import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurUser } from 'components/hooks/userQuery';
import { postDiaryPosting } from 'api/api';
import FileUpload from 'components/modules/fileUpload/FileUpload';
import MainTitle from 'components/atoms/text/MainTitle';
import TextArea from 'components/atoms/textArea/TextArea';
import Button from 'components/atoms/button/Button';
import { IMAGE } from 'components/utils/image';
import { PostingContainer, Area, SubTitle, AlignRight } from './Posting.style';

function Posting() {
  const navigate = useNavigate();
  const [simpleDiary, setSimpleDiary] = useState('');
  const [mindDiary, setMindDiary] = useState('');
  const [editImg, setEditImg] = useState({
    preview: `${IMAGE.IMG_UPLOAD_BASIC.url}`,
    data: '',
  });
  const formData = useMemo(() => new FormData(), [editImg]);

  // const { data } = useCurUser();

  const onChangeSimple = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSimpleDiary((cur) => e.target.value);
  };

  const onChangeMind = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMindDiary((cur) => e.target.value);
  };
  const onSubmit = () => {
    const diaryData = {
      userId: '',
      diary: simpleDiary,
      feeling: mindDiary,
    };
    formData.append('background', editImg.data);
    Object.entries(diaryData).forEach((val) =>
      formData.append(val[0], JSON.stringify(val[1])),
    );
    postDiaryPosting(formData);
  };

  const fileuploadPros = {
    editImg,
    formData,
    setEditImg,
  };

  return (
    <PostingContainer>
      <MainTitle>Daily Log</MainTitle>
      <FileUpload {...fileuploadPros} />
      <Area>
        <SubTitle>오늘 한 일</SubTitle>
        <TextArea onChange={onChangeSimple} />
      </Area>
      <Area>
        <SubTitle>오늘 느낀 감정</SubTitle>
        <TextArea onChange={onChangeMind} bgColor='red' />
      </Area>
      <AlignRight>
        <Button onClick={onSubmit}>Save & Analysis</Button>
      </AlignRight>
    </PostingContainer>
  );
}

export default Posting;