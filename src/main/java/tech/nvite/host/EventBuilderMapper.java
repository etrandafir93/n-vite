package tech.nvite.host;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import tech.nvite.domain.model.Event;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.usecases.CreateEventUseCase;
import tech.nvite.domain.usecases.EditEventUseCase;

@Mapper(componentModel = "spring")
interface EventBuilderMapper {

  @Mapping(source = "reference.value", target = "eventReference")
  @Mapping(source = "eventLocation", target = "ceremonyVenue")
  @Mapping(source = "eventReception", target = "receptionVenue")
  @Mapping(source = "backgroundImage", target = "backgroundImageUrl")
  EventFormResponse toFormResponse(Event event);

  CreateEventUseCase.Request toCreateRequest(EventFormRequest req);

  @Mapping(target = "reference", ignore = true)
  EditEventUseCase.Request toEditRequest(EventFormRequest req);

  default EditEventUseCase.Request toEditRequestWithReference(
      EventFormRequest req, EventReference reference) {
    return toEditRequest(req).withReference(reference);
  }
}
