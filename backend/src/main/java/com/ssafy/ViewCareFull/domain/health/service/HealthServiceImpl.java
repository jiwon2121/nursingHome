package com.ssafy.ViewCareFull.domain.health.service;

import com.ssafy.ViewCareFull.domain.health.dto.HealthInfo;
import com.ssafy.ViewCareFull.domain.health.entity.Health;
import com.ssafy.ViewCareFull.domain.health.repository.HealthRepository;
import com.ssafy.ViewCareFull.domain.users.error.UserErrorCode;
import com.ssafy.ViewCareFull.domain.users.error.exception.UsersException;
import com.ssafy.ViewCareFull.domain.users.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HealthServiceImpl implements HealthService {

  private final HealthRepository healthRepository;
  private final UsersRepository usersRepository;

  @Override
  @Transactional
  public void saveHealthInfo(String domainId, HealthInfo healthInfo) {
    // TODO: 연결정보CRUD 완료시 등록한사람(병원)과 입소자 연결이 있는지 체크하기
    // 건강정보를 등록하려는 입소자가 서비스에 등록된 사용자인지 체크
    usersRepository.findByDomainId(domainId)
        .orElseThrow(() -> new UsersException(UserErrorCode.NOT_FOUND_USERID));
    healthRepository.save(new Health(domainId, healthInfo));
  }
}