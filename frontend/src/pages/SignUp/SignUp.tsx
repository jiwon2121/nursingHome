/* eslint-disable operator-linebreak */
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import useUserStore from '../../stores/userStore';
import api from '../../services/api';
import { Button, DisabledButton } from '../../components/common/Buttons';
import Input from '../../components/common/Input';
import * as S from './SignUp.styles';
import UserContainer from '../../components/common/UserContainer';

interface Form {
  name: string;
  phone1: string;
  phone2: string;
  phone3: string;
  birth: string;
}

function SignUp() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const [form, setForm] = useState<Form>({
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    birth: '',
  });

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [vaildId, setValidId] = useState<boolean>(false);
  const [checkId, setCheckId] = useState<boolean>(false); // 아이디 중복 유무
  const [IdMsg, setIdMsg] = useState<string>('');
  const [validPw, setValidPw] = useState<boolean>(false);
  const [PwMsg, setPwMsg] = useState<string>('');
  const [PwConfirmMsg, setPwConfirmMsg] = useState<string>('');

  // id 유효성 검사
  function onChangeId(e: ChangeEvent<HTMLInputElement>) {
    const inputId = e.target.value;
    setId(inputId);
    const idRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;

    if (id.length === 0) {
      setIdMsg('');
    } else if (!idRegex.test(id)) {
      setIdMsg('3~20사이 대소문자 또는 숫자만 입력해 주세요!');
      setValidId(false);
    } else {
      setIdMsg('사용가능한 아이디 입니다.');
      setIdMsg('');
      setValidId(true);
    }
  }

  // 두 password 일치 확인
  function onChangePasswordConfirm(e: ChangeEvent<HTMLInputElement>) {
    const inputPasswordConfirm = e.target.value;
    setPasswordConfirm(inputPasswordConfirm);
    if (inputPasswordConfirm.length === 0) {
      setPwConfirmMsg('');
    } else if (password !== inputPasswordConfirm) {
      setPwConfirmMsg('두 비밀번호가 일치하지 않습니다.');
      setValidPw(false);
    } else {
      setPwConfirmMsg('두 비밀번호가 일치합니다.');
      setValidPw(true);
    }
  }

  // password 유효성 검사
  function onChangePassword(e: ChangeEvent<HTMLInputElement>) {
    const inputPassword = e.target.value;
    setPassword(inputPassword);
    const pwRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[@#$%^&+=!])(?!.*\s).{8,20}$/;

    if (inputPassword.length === 0) {
      setPwMsg('');
      setValidPw(false);
    } else if (!pwRegex.test(inputPassword)) {
      setPwMsg('8~20사이로 숫자, 소문자, 특수문자를 포함해주세요!');
      setValidPw(false);
    } else {
      setPwMsg('사용가능한 비밀번호 입니다.');
      setValidPw(true);
    }

    if (password.length !== 0 && password !== passwordConfirm) {
      setPwConfirmMsg('두 비밀번호가 일치하지 않습니다.');
      setValidPw(false);
    } else if (password.length !== 0 && password === passwordConfirm) {
      setPwConfirmMsg('두 비밀번호가 일치합니다.');
      setValidPw(true);
    } else {
      setPwConfirmMsg('');
      setValidPw(false);
    }
  }

  // 회원가입 버튼 활성화 조건
  const submitRequirements =
    id &&
    password &&
    passwordConfirm &&
    vaildId &&
    validPw &&
    checkId &&
    form.name &&
    form.phone1 &&
    form.phone2 &&
    form.phone3 &&
    form.birth;

  // input태그의 이름, 사용자가 입력한 값을 실시간으로 각각 동적 할당
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  }

  // 아이디 중복 확인
  async function handleCheckId() {
    try {
      const response = await api.get(`/users/validation/${id}`);
      if (response.status === 409) {
        alert('이미 사용 중인 아이디입니다.');
        setCheckId(false);
      } else {
        alert('사용 가능한 아이디입니다.');
        setCheckId(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (vaildId && checkId) {
      setIdMsg('사용 가능한 아이디입니다.');
    }
  }, [vaildId, checkId]);

  // 회원가입
  async function handleSignUp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const phoneNumber = `${form.phone1}-${form.phone2}-${form.phone3}`;
    try {
      const response = await api.post('/users', {
        ...form,
        phoneNumber,
        id,
        password,
      });
      if (response.status === 201) {
        setUser(response.data);
        navigate('/login', { state: { pathType: 'app' } });
      } else {
        console.error(`오류: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <S.GrayBackground>
      <S.GlobalStyle />
      <UserContainer
        $height="620px"
        $width="300px"
        $padding="12px"
        $alignItems="left"
      >
        <S.SignUpText>회원가입</S.SignUpText>
        <form onSubmit={handleSignUp}>
          <S.Label>
            <div>아이디</div>
            <S.IDContainer>
              <Input
                $width="75%"
                type="text"
                name="id"
                placeholder="아이디를 입력해주세요."
                value={id}
                onChange={onChangeId}
                required
              />
              <Button $width="30%" $padding="8px" onClick={handleCheckId}>
                중복확인
              </Button>
            </S.IDContainer>
          </S.Label>
          <div
            style={{ marginTop: '-7px' }}
            className={`message ${IdMsg && 'active'}`}
          >
            {IdMsg}
          </div>
          <S.Label>
            <div>비밀번호</div>
            <Input
              $width="98%"
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={onChangePassword}
              required
            />
          </S.Label>
          <div className={`message ${PwMsg && 'active'}`}>{PwMsg}</div>
          <S.Label>
            <div>비밀번호 확인</div>
            <Input
              $width="98%"
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호를 한번 더 입력해주세요."
              value={passwordConfirm}
              onChange={onChangePasswordConfirm}
              required
            />
          </S.Label>
          <div className={`message ${PwConfirmMsg && 'active'}`}>
            {PwConfirmMsg}
          </div>
          <S.Label>
            <div>이름</div>
            <Input
              $width="98%"
              type="text"
              name="name"
              placeholder="이름을 입력해주세요."
              value={form.name}
              onChange={handleChange}
              required
            />
          </S.Label>
          <S.Label>
            <div>생년월일</div>
            <Input
              $width="98%"
              type="date"
              name="birth"
              value={form.birth}
              onChange={handleChange}
              required
            />
          </S.Label>
          <S.Label>
            <div>전화번호</div>
            <S.PhoneContainer>
              <Input
                $width="60%"
                $textAlign="center"
                type="tel"
                name="phone1"
                value={form.phone1}
                onChange={handleChange}
                required
                maxLength={3}
              />
              -
              <Input
                $width="80%"
                $textAlign="center"
                type="tel"
                name="phone2"
                value={form.phone2}
                onChange={handleChange}
                required
                maxLength={4}
              />
              -
              <Input
                $width="80%"
                $textAlign="center"
                type="tel"
                name="phone3"
                value={form.phone3}
                onChange={handleChange}
                required
                maxLength={4}
              />
            </S.PhoneContainer>
          </S.Label>
          <br />
          {submitRequirements ? (
            <Button type="submit">회원가입</Button>
          ) : (
            <DisabledButton>회원가입</DisabledButton>
          )}
        </form>
      </UserContainer>
    </S.GrayBackground>
  );
}

export default SignUp;