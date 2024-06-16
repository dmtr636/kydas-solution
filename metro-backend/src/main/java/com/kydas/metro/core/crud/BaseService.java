package com.kydas.metro.core.crud;

import com.kydas.metro.core.exceptions.classes.ApiException;
import com.kydas.metro.core.exceptions.classes.NotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public abstract class BaseService<E, ID, DTO> {
    private final BaseRepository<E, ID> repository;

    public List<E> getAll() {
        return repository.findAll();
    };

    public Long getAllCount() { return repository.count(); }

    public E getById(ID id) throws ApiException {
        return repository.findById(id).orElseThrow(NotFoundException::new);
    };

    public abstract E create(DTO dto) throws ApiException;

    public abstract E update(DTO dto) throws ApiException;

    public void delete(ID id) throws ApiException {
        repository.deleteById(id);
    }
}
