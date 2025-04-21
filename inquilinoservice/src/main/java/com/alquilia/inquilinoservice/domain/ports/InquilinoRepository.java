package com.alquilia.inquilino.domain.ports;

import com.alquilia.inquilino.domain.model.Inquilino;
import java.util.Optional;
import java.util.UUID;

public interface InquilinoRepository {
    void save(Inquilino inquilino);
    Optional<Inquilino> findById(UUID id);
}
