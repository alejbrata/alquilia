package com.alquilia.inquilinoservice.infrastructure.repository;

import com.alquilia.inquilinoservice.domain.model.Inquilino;
import com.alquilia.inquilinoservice.domain.ports.InquilinoRepository;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryInquilinoRepository implements InquilinoRepository {

    private final Map<UUID, Inquilino> almacenamiento = new ConcurrentHashMap<>();

    @Override
    public void save(Inquilino inquilino) {
        if (inquilino.getId() == null) {
            inquilino.setId(UUID.randomUUID());
        }
        almacenamiento.put(inquilino.getId(), inquilino);
    }

    @Override
    public List<Inquilino> findAll() {
        return new ArrayList<>(almacenamiento.values());
    }

    @Override
    public Optional<Inquilino> findById(UUID id) {
        return Optional.ofNullable(almacenamiento.get(id));
    }

    @Override
    public void deleteById(UUID id) {
        almacenamiento.remove(id);
    }

    @Override
    public void update(Inquilino inquilino) {
        almacenamiento.put(inquilino.getId(), inquilino);
    }
}
