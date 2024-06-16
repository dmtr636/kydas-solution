package com.kydas.metro.notification;

import com.kydas.metro.core.crud.BaseRepository;

import java.util.List;

public interface NotificationRepository extends BaseRepository<Notification, Long> {
    List<Notification> findByIsReadFalse();
}