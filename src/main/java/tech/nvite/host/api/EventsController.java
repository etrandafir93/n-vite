package tech.nvite.host.api;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tech.nvite.host.*;

@RestController
@RequestMapping("api/events")
@RequiredArgsConstructor
class EventsController {

  private final EventBuilderMapper mapper;
  private final CreateEventUseCase createEventUseCase;
  private final EditEventUseCase editEventUseCase;
  private final DeleteEventUseCase deleteEventUseCase;
  private final EnableEventUseCase enableEventUseCase;
  private final ExportGuestListUseCase exportGuestListUseCase;
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

  @GetMapping("/{reference}/export")
  public ResponseEntity<byte[]> exportGuests(@PathVariable String reference) {
    var result = exportGuestListUseCase.apply(reference);
    var headers = new HttpHeaders();
    headers.setContentType(
        MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    headers.setContentDisposition(
        ContentDisposition.attachment().filename(result.filename()).build());
    return ResponseEntity.ok().headers(headers).body(result.content());
  }
}
