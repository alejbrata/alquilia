package com.alquilia.inquilino.application;

import com.alquilia.inquilino.domain.model.Inquilino;
import com.alquilia.inquilino.domain.ports.InquilinoRepository;

import java.util.UUID;

public class InquilinoService {
    private final InquilinoRepository repository;

    public InquilinoService(InquilinoRepository repository) {
        this.repository = repository;
    }

    public void registrarInquilino(String nombre, String email, String zona, double rentaMax) {
        Inquilino inquilino = new Inquilino(UUID.randomUUID(), nombre, email, zona, rentaMax);
        repository.save(inquilino);
    }
}
