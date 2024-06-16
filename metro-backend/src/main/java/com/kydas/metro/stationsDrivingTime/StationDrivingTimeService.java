package com.kydas.metro.stationsDrivingTime;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StationDrivingTimeService extends BaseService<StationDrivingTime, Integer, StationDrivingTimeDTO> {
    @Autowired
    private StationDrivingTImeRepository repository;
    @Autowired
    private StationDrivingTimeMapper mapper;

    public StationDrivingTimeService(StationDrivingTImeRepository repository) {
        super(repository);
    }

    public StationDrivingTime create(StationDrivingTimeDTO dto) {
        var station = new StationDrivingTime();
        mapper.update(station, dto);
        return repository.save(station);
    }

    public StationDrivingTime update(StationDrivingTimeDTO dto) throws ApiException {
        var station = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        mapper.update(station, dto);
        return repository.save(station);
    }
}
