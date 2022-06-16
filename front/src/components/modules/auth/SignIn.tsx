import React, { useState, useCallback, useMemo } from 'react';
import Input from 'components/atoms/input/Input';
import Button from 'components/atoms/button/Button';
import SnackBar from 'components/atoms/snackBar/SnackBar';
import { useSignInHandler } from 'components/hooks/userQuery';
import { useSnackBar } from 'components/hooks/useSnackBar';
import { signInValidation } from 'components/utils/validation';
import { LABEL } from 'components/utils/constants';
import { AuthContainer } from './Auth.style';

function SignIn() {
  const [inputData, setInputData] = useState({
    email: '',
    password: '',
  });
  const { message, isShowing, openSnackBar } = useSnackBar();
  const logInMutation = useSignInHandler(openSnackBar);
  const isCheck = useMemo(() => signInValidation(inputData), [inputData]);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputData((cur) => {
        return {
          ...cur,
          [name]: value,
        };
      });
    },
    [inputData],
  );
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    logInMutation.mutate(inputData);
  };
  return (
    <>
      <AuthContainer onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name={`${LABEL.EMAIL.label}`}
          type='text'
          placeholder='email'
        />
        <Input
          onChange={onChange}
          name={`${LABEL.PASSWORD.label}`}
          type='password'
          placeholder='password'
        />
        <Button disabled={!isCheck} type='submit'>
          {LABEL.SIGNIN.label}
        </Button>
      </AuthContainer>
      <SnackBar message={message} isActive={isShowing} />
    </>
  );
}
export default React.memo(SignIn);