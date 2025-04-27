package com.alquilia.inquilinoservice.domain.ports;

import com.alquilia.inquilinoservice.domain.model.Inquilino;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Interface for InquilinoRepository
 */
public interface InquilinoRepository {
    
    void save(Inquilino inquilino);
    List<Inquilino> findAll();
    Optional<Inquilino> findById(UUID id);
    void deleteById(UUID id);
    void update(Inquilino inquilino);
}
