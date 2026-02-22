package tech.nvite.host;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tech.nvite.domain.Event;
import tech.nvite.usecases.CreateEventUseCase;
import tech.nvite.usecases.EditEventUseCase;
import tech.nvite.usecases.SeeEventUseCase;

@Mapper(componentModel = "spring")
public interface EventBuilderMapper {

  @Mapping(source = "eventReference", target = "eventReference")
  @Mapping(source = "eventLocation", target = "ceremonyVenue")
  @Mapping(source = "eventReception", target = "receptionVenue")
  @Mapping(source = "backgroundImage", target = "backgroundImageUrl")
  SeeEventUseCase.EventFormResponse toFormResponse(Event event);

  CreateEventUseCase.Request toCreateRequest(EventFormRequest req);

  @Mapping(target = "eventReference", source = "eventReference")
  EditEventUseCase.Request toEditRequest(EventFormRequest req, String eventReference);

  default EditEventUseCase.Request toEditRequestWithReference(
      EventFormRequest req, String eventReference) {
    return toEditRequest(req, eventReference);
  }
}
