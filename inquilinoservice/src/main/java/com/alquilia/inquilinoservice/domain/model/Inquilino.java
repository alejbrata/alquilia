package com.alquilia.inquilino.domain.model;

import java.util.UUID;

public class Inquilino {
    private UUID id;
    private String nombre;
    private String email;
    private String zonaPreferida;
    private double rentaMaxima;

    public Inquilino(UUID id, String nombre, String email, String zonaPreferida, double rentaMaxima) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.zonaPreferida = zonaPreferida;
        this.rentaMaxima = rentaMaxima;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getEmail() {
        return email;
    }

    public String getZonaPreferida() {
        return zonaPreferida;
    }

    public double getRentaMaxima() {
        return rentaMaxima;
    }
}
