package tech.nvite.guest;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tech.nvite.domain.Event;

@Mapper(componentModel = "spring")
interface InvitationMapper {

  @Mapping(source = "eventDateTime", target = "eventDate")
  @Mapping(source = "eventLocation", target = "ceremonyVenue")
  @Mapping(source = "eventReception", target = "receptionVenue")
  @Mapping(target = "backgroundImageUrl", expression = "java(event.backgroundImageOrDefault())")
  InvitationDetails toDto(Event event);
}
