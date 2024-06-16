package com.kydas.metro.stations;

import com.kydas.metro.core.crud.BaseService;
import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StationService extends BaseService<Station, Integer, StationDTO> {
    @Autowired
    private StationRepository repository;
    @Autowired
    private StationMapper mapper;

    public StationService(StationRepository repository) {
        super(repository);
    }

    public Station create(StationDTO dto) {
        var station = new Station();
        mapper.update(station, dto);
        return repository.save(station);
    }

    public Station update(StationDTO dto) throws ApiException {
        var station = repository.findById(dto.getId()).orElseThrow(NotFoundException::new);
        mapper.update(station, dto);
        return repository.save(station);
    }
}
