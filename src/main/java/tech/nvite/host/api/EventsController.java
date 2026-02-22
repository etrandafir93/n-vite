package tech.nvite.host.api;

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
import tech.nvite.host.CreateEventUseCase;
import tech.nvite.host.DeleteEventUseCase;
import tech.nvite.host.EditEventUseCase;
import tech.nvite.host.EnableEventUseCase;
import tech.nvite.host.SeeEventDashboardUseCase;
import tech.nvite.host.SeeEventUseCase;
import tech.nvite.host.SeeUpcomingEventsUseCase;

@RestController
@RequestMapping("api/events")
@RequiredArgsConstructor
class EventsController {

  private final EventBuilderMapper mapper;
  private final CreateEventUseCase createEventUseCase;
  private final EditEventUseCase editEventUseCase;
  private final DeleteEventUseCase deleteEventUseCase;
  private final EnableEventUseCase enableEventUseCase;
  private final SeeEventDashboardUseCase seeEventDashboardUseCase;
  private final SeeUpcomingEventsUseCase seeUpcomingEventsUseCase;
  private final SeeEventUseCase seeEventUseCase;

  @GetMapping
  public List<SeeUpcomingEventsUseCase.EventListItem> listEvents() {
    return seeUpcomingEventsUseCase.get();
  }

  @GetMapping("/{reference}/form")
  public SeeEventUseCase.EventFormResponse getForm(@PathVariable String reference) {
    return seeEventUseCase.apply(reference);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public String create(@RequestBody EventFormRequest req) {
    var request = mapper.toCreateRequest(req);
    return createEventUseCase.apply(request);
  }

  @PutMapping("/{reference}")
  public String update(@PathVariable String reference, @RequestBody EventFormRequest req) {
    var request = mapper.toEditRequestWithReference(req, reference);
    return editEventUseCase.apply(request);
  }

  @PatchMapping("/{reference}/enable")
  public String enable(@PathVariable String reference) {
    return enableEventUseCase.apply(reference);
  }

  @DeleteMapping("/{reference}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String reference) {
    var request = new DeleteEventUseCase.Request(reference);
    deleteEventUseCase.accept(request);
  }

  @GetMapping("/{reference}/dashboard")
  public SeeEventDashboardUseCase.EventStats getDashboard(@PathVariable String reference) {
    return seeEventDashboardUseCase.apply(reference);
  }
}
