package com.alquilia.inquilinoservice.infrastructure.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InquilinoRequest {
    private String nombre;
    private String email;
    private String apellidos;
    private String password;
}
