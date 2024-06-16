package com.kydas.metro.stationsTransferTime;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StationTransferTimeService extends BaseService<StationTransferTime, Integer, StationTransferTimeDTO> {
    @Autowired
    private StationTransferTImeRepository repository;
    @Autowired
    private StationTransferTimeMapper mapper;

    public StationTransferTimeService(StationTransferTImeRepository repository) {
        super(repository);
    }

    public StationTransferTime create(StationTransferTimeDTO dto) {
        var station = new StationTransferTime();
        mapper.update(station, dto);
        return repository.save(station);
    }

    public StationTransferTime update(StationTransferTimeDTO dto) throws ApiException {
        var station = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        mapper.update(station, dto);
        return repository.save(station);
    }
}
