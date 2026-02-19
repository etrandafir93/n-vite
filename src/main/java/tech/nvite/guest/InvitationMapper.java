package tech.nvite.guest;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tech.nvite.domain.model.Event;

@Mapper(componentModel = "spring")
public interface InvitationMapper {

  @Mapping(source = "eventDateTime", target = "eventDate")
  @Mapping(source = "eventLocation", target = "ceremonyVenue")
  @Mapping(source = "eventReception", target = "receptionVenue")
  @Mapping(source = "reference.value", target = "eventReference")
  @Mapping(target = "backgroundImageUrl", expression = "java(event.backgroundImageOrDefault())")
  InvitationDetailsDto toDto(Event event);
}
