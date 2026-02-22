package tech.nvite.host;

import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.EventStatus;
import tech.nvite.domain.model.Events;
import tech.nvite.domain.usecases.CreateEventUseCase;
import tech.nvite.domain.usecases.DeleteEventUseCase;
import tech.nvite.domain.usecases.EditEventUseCase;
import tech.nvite.domain.usecases.SeeEventDashboardUseCase;

@RestController
@RequestMapping("api/events")
@RequiredArgsConstructor
class EventsController {

  private final Events events;
  private final EventBuilderMapper mapper;
  private final CreateEventUseCase createEventUseCase;
  private final EditEventUseCase editEventUseCase;
  private final DeleteEventUseCase deleteEventUseCase;
  private final SeeEventDashboardUseCase seeEventDashboardUseCase;

  @GetMapping
  public List<EventListItem> listEvents() {
    return events
        .findAllForLoggedInUser()
        .map(
            evt ->
                new EventListItem(
                    evt.groomName(),
                    evt.brideName(),
                    evt.eventDateTime(),
                    evt.reference().value(),
                    evt.status() != null ? evt.status() : EventStatus.LIVE))
        .toList();
  }

  @GetMapping("/{reference}/form")
  public EventFormResponse getForm(@PathVariable String reference) {
    var evt = events.findOrThrow(new EventReference(reference));
    return mapper.toFormResponse(evt);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public EventReference create(@RequestBody EventFormRequest req) {
    var request = mapper.toCreateRequest(req);
    return createEventUseCase.apply(request);
  }

  @PutMapping("/{reference}")
  public EventReference update(@PathVariable String reference, @RequestBody EventFormRequest req) {
    var request = mapper.toEditRequestWithReference(req, new EventReference(reference));
    return editEventUseCase.apply(request);
  }

  @PatchMapping("/{reference}/enable")
  public EventReference enable(@PathVariable String reference) {
    var ref = new EventReference(reference);
    var existing = events.findOrThrow(ref);
    events.edit(existing.withStatus(EventStatus.LIVE));
    return ref;
  }

  @DeleteMapping("/{reference}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String reference) {
    var request = new DeleteEventUseCase.Request(new EventReference(reference));
    deleteEventUseCase.accept(request);
  }

  @GetMapping("/{reference}/dashboard")
  public SeeEventDashboardUseCase.EventStats getDashboard(@PathVariable String reference) {
    return seeEventDashboardUseCase.apply(new EventReference(reference));
  }

  public record EventListItem(
      String groomName, String brideName, Instant dateTime, String reference, EventStatus status) {}
}
