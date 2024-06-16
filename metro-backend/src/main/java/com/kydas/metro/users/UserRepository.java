package com.kydas.metro.users;

import com.kydas.metro.core.crud.BaseRepository;

import java.util.Optional;

public interface UserRepository extends BaseRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);
}