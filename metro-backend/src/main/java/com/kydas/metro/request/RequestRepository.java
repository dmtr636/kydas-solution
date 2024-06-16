package com.kydas.metro.request;

import com.kydas.metro.core.crud.BaseRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface RequestRepository extends BaseRepository<Request, UUID> {
    @Query("SELECT r FROM Request r JOIN r.assignedEmployees ae WHERE ae.employeeId = :employeeId AND " +
        "(r.info.tripDate <= :tripEnd AND r.info.tripDateEnd >= :tripStart)")
    List<Request> findConflictingRequests(
        @Param("employeeId") Long employeeId,
        @Param("tripStart") Instant tripStart,
        @Param("tripEnd") Instant tripEnd
    );
}