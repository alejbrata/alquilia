package com.alquilia.inquilinoservice.infraestructure.rest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alquilia.inquilinoservice.application.InquilinoService;

@RestController
@RequestMapping("/inquilinos")
public class InquilinoController {

    private final InquilinoService service;

    public InquilinoController(InquilinoService service) {
        this.service = service;
    }

    @PostMapping
    public void registrarInquilino(@RequestParam String nombre,
                                   @RequestParam String email,
                                   @RequestParam String zona,
                                   @RequestParam double renta) {
        service.registrarInquilino(nombre, email, zona, renta);
    }
}
