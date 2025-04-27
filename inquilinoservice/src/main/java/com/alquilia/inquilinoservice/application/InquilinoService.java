package com.alquilia.inquilinoservice.application;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.alquilia.inquilinoservice.domain.model.Inquilino;
import com.alquilia.inquilinoservice.domain.ports.InquilinoRepository;
import com.alquilia.inquilinoservice.infrastructure.mapper.InquilinoMapper;
import com.alquilia.inquilinoservice.infrastructure.rest.dto.InquilinoRequest;
import com.alquilia.inquilinoservice.infrastructure.rest.dto.LoginRequest;

@Service
public class InquilinoService {
    private final InquilinoRepository inquilinoRepository;
    private final InquilinoMapper inquilinoMapper;

    public InquilinoService(InquilinoRepository inquilinoRepository, InquilinoMapper inquilinoMapper) {
        this.inquilinoRepository = inquilinoRepository;
        this.inquilinoMapper = inquilinoMapper;
    }

    public void crearInquilino(InquilinoRequest request) {
        Inquilino inquilino = inquilinoMapper.toInquilino(request);
        inquilinoRepository.save(inquilino);
    }

    public List<Inquilino> obtenerTodos() {
        return inquilinoRepository.findAll();
    }

    public Inquilino obtenerPorId(UUID id) {
        return inquilinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquilino no encontrado con id: " + id));
    }

    public void eliminarPorId(UUID id) {
        inquilinoRepository.deleteById(id);
    }

    public void actualizarInquilino(UUID id, InquilinoRequest request) {
        Inquilino inquilino = inquilinoMapper.toInquilino(request);
        inquilino.setId(id);
        inquilinoRepository.update(inquilino);
    }   
    
    public boolean login(LoginRequest request) {
    return inquilinoRepository.findAll().stream()
        .anyMatch(inquilino ->
            inquilino.getEmail().equalsIgnoreCase(request.getEmail()) &&
            inquilino.getPassword().equals(request.getPassword())
        );
    }
}
