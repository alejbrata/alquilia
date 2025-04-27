package com.alquilia.inquilinoservice.domain.model;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Inquilino {
    private UUID id;
    private String nombre;
    private String email;
    private String apellidos;
    private String password;
}
