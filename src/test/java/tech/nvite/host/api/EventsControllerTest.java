package tech.nvite.host.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tech.nvite.TestSecurityConfig;
import tech.nvite.domain.EventStatus;
import tech.nvite.host.*;

@WebMvcTest(EventsController.class)
@Import({EventBuilderMapperImpl.class, TestSecurityConfig.class})
class EventsControllerTest {

  @Autowired MockMvc mvc;

  @MockBean CreateEventUseCase createEventUseCase;
  @MockBean EditEventUseCase editEventUseCase;
  @MockBean DeleteEventUseCase deleteEventUseCase;
  @MockBean EnableEventUseCase enableEventUseCase;
  @MockBean ExportGuestListUseCase exportGuestListUseCase;
  @MockBean SeeEventDashboardUseCase seeEventDashboardUseCase;
  @MockBean SeeUpcomingEventsUseCase seeUpcomingEventsUseCase;
  @MockBean SeeEventUseCase seeEventUseCase;

  private static final Instant DATE = Instant.parse("2026-06-15T12:00:00Z");

  // GET /api/events

  @Test
  void listEventsReturnsEmptyList() throws Exception {
    when(seeUpcomingEventsUseCase.get()).thenReturn(List.of());

    mvc.perform(get("/api/events"))
        .andExpect(status().isOk())
        .andExpect(content().json("[]"));
  }

  @Test
  void listEventsReturnsMappedItems() throws Exception {
    when(seeUpcomingEventsUseCase.get())
        .thenReturn(
            List.of(
                new SeeUpcomingEventsUseCase.EventListItem(
                    "Mark", "Anna", DATE, "anna-and-mark", "LIVE")));

    mvc.perform(get("/api/events"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].groomName").value("Mark"))
        .andExpect(jsonPath("$[0].brideName").value("Anna"))
        .andExpect(jsonPath("$[0].reference").value("anna-and-mark"))
        .andExpect(jsonPath("$[0].status").value("LIVE"));
  }

  // GET /api/events/{ref}/form

  @Test
  void getFormReturnsEventData() throws Exception {
    when(seeEventUseCase.apply("anna-and-mark"))
        .thenReturn(
            new SeeEventUseCase.EventFormResponse(
                "anna-and-mark", "Mark", "Anna", DATE, "img.jpg", null, null, null,
                "Church", null, null, null, null, "Hotel", null, null, null, null,
                null, List.of("Meat", "Fish"), "classic", "LIVE", null));

    mvc.perform(get("/api/events/anna-and-mark/form"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.eventReference").value("anna-and-mark"))
        .andExpect(jsonPath("$.groomName").value("Mark"))
        .andExpect(jsonPath("$.brideName").value("Anna"))
        .andExpect(jsonPath("$.ceremonyVenue").value("Church"))
        .andExpect(jsonPath("$.receptionVenue").value("Hotel"))
        .andExpect(jsonPath("$.menuOptions[0]").value("Meat"))
        .andExpect(jsonPath("$.theme").value("classic"));
  }

  // POST /api/events

  @Test
  void createEventReturnsRefWith201() throws Exception {
    when(createEventUseCase.apply(any())).thenReturn("anna-and-mark");

    mvc.perform(
            post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(minimalEventJson("LIVE")))
        .andExpect(status().isCreated())
        .andExpect(content().string("anna-and-mark"));
  }

  @Test
  void createEventPassesStatusToUseCase() throws Exception {
    when(createEventUseCase.apply(any())).thenReturn("ref");

    mvc.perform(
        post("/api/events")
            .contentType(MediaType.APPLICATION_JSON)
            .content(minimalEventJson("DRAFT")));

    verify(createEventUseCase)
        .apply(argThat((CreateEventUseCase.Request req) -> req.status() == EventStatus.DRAFT));
  }

  // PUT /api/events/{ref}

  @Test
  void updateEventReturnsRef() throws Exception {
    when(editEventUseCase.apply(any())).thenReturn("anna-and-mark");

    mvc.perform(
            put("/api/events/anna-and-mark")
                .contentType(MediaType.APPLICATION_JSON)
                .content(minimalEventJson("LIVE")))
        .andExpect(status().isOk())
        .andExpect(content().string("anna-and-mark"));
  }

  @Test
  void updateEventPassesReferenceFromPath() throws Exception {
    when(editEventUseCase.apply(any())).thenReturn("anna-and-mark");

    mvc.perform(
        put("/api/events/anna-and-mark")
            .contentType(MediaType.APPLICATION_JSON)
            .content(minimalEventJson("LIVE")));

    verify(editEventUseCase)
        .apply(
            argThat(
                (EditEventUseCase.Request req) ->
                    "anna-and-mark".equals(req.eventReference())));
  }

  // PATCH /api/events/{ref}/enable

  @Test
  void enableEventReturnsRef() throws Exception {
    when(enableEventUseCase.apply("anna-and-mark")).thenReturn("anna-and-mark");

    mvc.perform(patch("/api/events/anna-and-mark/enable"))
        .andExpect(status().isOk())
        .andExpect(content().string("anna-and-mark"));
  }

  // DELETE /api/events/{ref}

  @Test
  void deleteEventReturns204() throws Exception {
    mvc.perform(delete("/api/events/anna-and-mark"))
        .andExpect(status().isNoContent());

    verify(deleteEventUseCase).accept(new DeleteEventUseCase.Request("anna-and-mark"));
  }

  // GET /api/events/{ref}/export

  @Test
  void exportGuestsReturnsExcelFile() throws Exception {
    var excelBytes = new byte[]{1, 2, 3};
    when(exportGuestListUseCase.apply("anna-and-mark"))
        .thenReturn(new ExportGuestListUseCase.ExportResult(excelBytes, "guests.xlsx"));

    mvc.perform(get("/api/events/anna-and-mark/export"))
        .andExpect(status().isOk())
        .andExpect(header().string("Content-Disposition", "attachment; filename=\"guests.xlsx\""))
        .andExpect(content().bytes(excelBytes));
  }

  // --- helpers ---

  private String minimalEventJson(String status) {
    return """
        {
          "groomName": "Mark",
          "brideName": "Anna",
          "eventDateTime": "2026-06-15T12:00:00Z",
          "backgroundImageUrl": "https://img.com/bg.jpg",
          "status": "%s"
        }
        """.formatted(status);
  }
}
