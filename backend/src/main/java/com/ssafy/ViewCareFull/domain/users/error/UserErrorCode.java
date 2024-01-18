package com.ssafy.ViewCareFull.domain.users.error;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum UserErrorCode {

  DUPLICATED_ID(HttpStatus.CONFLICT, "중복된 아이디입니다.");

  private final HttpStatus httpStatus;
  private final String message;

}
