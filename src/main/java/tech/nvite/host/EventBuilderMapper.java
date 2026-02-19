package tech.nvite.host;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tech.nvite.domain.model.Event;

@Mapper(componentModel = "spring")
interface EventBuilderMapper {

  @Mapping(source = "reference.value", target = "eventReference")
  @Mapping(source = "eventLocation", target = "ceremonyVenue")
  @Mapping(source = "eventReception", target = "receptionVenue")
  @Mapping(source = "backgroundImage", target = "backgroundImageUrl")
  EventFormResponse toFormResponse(Event event);
}
