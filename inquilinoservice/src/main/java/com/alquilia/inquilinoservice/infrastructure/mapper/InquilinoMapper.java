package com.alquilia.inquilinoservice.infrastructure.mapper;

import com.alquilia.inquilinoservice.domain.model.Inquilino;
import com.alquilia.inquilinoservice.infrastructure.rest.dto.InquilinoRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface InquilinoMapper {

    InquilinoMapper INSTANCE = Mappers.getMapper(InquilinoMapper.class);

    @Mapping(target = "id", ignore = true) // No lo vamos a mapear desde el request
    Inquilino toInquilino(InquilinoRequest request);
}
