package com.alquilia.inquilinoservice.infrastructure.rest;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alquilia.inquilinoservice.application.InquilinoService;
import com.alquilia.inquilinoservice.domain.model.Inquilino;
import com.alquilia.inquilinoservice.infrastructure.rest.dto.InquilinoRequest;
import com.alquilia.inquilinoservice.infrastructure.rest.dto.LoginRequest;

@RestController
@RequestMapping("/inquilinos")
public class InquilinoController {

    private final InquilinoService service;

    public InquilinoController(InquilinoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> crearInquilino(@RequestBody InquilinoRequest request) {
        service.crearInquilino(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Inquilino>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inquilino> obtenerPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPorId(@PathVariable UUID id) {
    service.eliminarPorId(id);
    return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> actualizar(@PathVariable UUID id, @RequestBody InquilinoRequest request) {
        service.actualizarInquilino(id, request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
public boolean login(@RequestBody LoginRequest request) {
    return service.login(request);
}


}
