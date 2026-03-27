package tech.nvite.guest.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import tech.nvite.domain.Event;
import tech.nvite.domain.EventStatus;
import tech.nvite.guest.RsvpInvitationUseCase;
import tech.nvite.guest.VisitInvitationUseCase;

@WebMvcTest(InvitationController.class)
@Import({InvitationMapperImpl.class, TestSecurityConfig.class})
class InvitationControllerTest {

  @Autowired MockMvc mvc;

  @MockBean VisitInvitationUseCase visitInvitationUseCase;
  @MockBean RsvpInvitationUseCase rsvpInvitationUseCase;

  private static final Instant DATE = Instant.parse("2026-06-15T12:00:00Z");

  // GET /api/invitations/{ref}

  @Test
  void getInvitationReturnsMappedDetails() throws Exception {
    when(visitInvitationUseCase.apply(any()))
        .thenReturn(new VisitInvitationUseCase.Response(sampleEvent()));

    mvc.perform(get("/api/invitations/anna-and-mark"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.groomName").value("Mark"))
        .andExpect(jsonPath("$.brideName").value("Anna"))
        .andExpect(jsonPath("$.eventReference").value("anna-and-mark"))
        .andExpect(jsonPath("$.ceremonyVenue").value("Church St. Mary"))
        .andExpect(jsonPath("$.receptionVenue").value("Grand Hotel"))
        .andExpect(jsonPath("$.menuOptions[0]").value("Meat"))
        .andExpect(jsonPath("$.status").value("LIVE"));
  }

  @Test
  void getInvitationPassesRefAndGuestToUseCase() throws Exception {
    when(visitInvitationUseCase.apply(any()))
        .thenReturn(new VisitInvitationUseCase.Response(sampleEvent()));

    mvc.perform(get("/api/invitations/anna-and-mark?guest=JohnDoe"));

    verify(visitInvitationUseCase)
        .apply(new VisitInvitationUseCase.Request("anna-and-mark", "JohnDoe"));
  }

  @Test
  void getInvitationWithNoGuestParam() throws Exception {
    when(visitInvitationUseCase.apply(any()))
        .thenReturn(new VisitInvitationUseCase.Response(sampleEvent()));

    mvc.perform(get("/api/invitations/anna-and-mark")).andExpect(status().isOk());

    verify(visitInvitationUseCase).apply(new VisitInvitationUseCase.Request("anna-and-mark", null));
  }

  // POST /api/invitations/{ref}/responses

  @Test
  void submitRsvpReturns200() throws Exception {
    when(rsvpInvitationUseCase.apply(any()))
        .thenReturn(new RsvpInvitationUseCase.Response("rsvp-1"));

    mvc.perform(
            post("/api/invitations/anna-and-mark/responses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "guestName": "John Doe",
                      "answer": "ACCEPTED",
                      "partnerName": "Jane Doe",
                      "menuPreference": "Fish",
                      "children": 2,
                      "transport": true,
                      "allergies": "Nuts",
                      "notes": "Wheelchair needed"
                    }
                    """))
        .andExpect(status().isOk());
  }

  @Test
  void submitRsvpPassesAllFieldsToUseCase() throws Exception {
    when(rsvpInvitationUseCase.apply(any()))
        .thenReturn(new RsvpInvitationUseCase.Response("rsvp-1"));

    mvc.perform(
        post("/api/invitations/anna-and-mark/responses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(
                """
                {
                  "guestName": "John Doe",
                  "answer": "DECLINED",
                  "allergies": "Peanuts"
                }
                """));

    verify(rsvpInvitationUseCase)
        .apply(
            argThat(
                (RsvpInvitationUseCase.Request req) ->
                    "anna-and-mark".equals(req.eventReference())
                        && "John Doe".equals(req.name())
                        && "DECLINED".equals(req.rsvp())
                        && "Peanuts".equals(req.allergies())));
  }

  @Test
  void submitRsvpPassesRefFromPath() throws Exception {
    when(rsvpInvitationUseCase.apply(any()))
        .thenReturn(new RsvpInvitationUseCase.Response("rsvp-1"));

    mvc.perform(
        post("/api/invitations/some-other-ref/responses")
            .contentType(MediaType.APPLICATION_JSON)
            .content(
                """
                { "guestName": "A", "answer": "ACCEPTED" }
                """));

    verify(rsvpInvitationUseCase)
        .apply(
            argThat(
                (RsvpInvitationUseCase.Request req) ->
                    "some-other-ref".equals(req.eventReference())));
  }

  // --- helpers ---

  private Event sampleEvent() {
    return Event.builder()
        .groomName("Mark")
        .brideName("Anna")
        .eventDateTime(DATE)
        .backgroundImage("https://img.com/bg.jpg")
        .eventLocation("Church St. Mary")
        .eventReception("Grand Hotel")
        .eventReference("anna-and-mark")
        .menuOptions(List.of("Meat", "Fish", "Veg"))
        .theme("classic")
        .status(EventStatus.LIVE)
        .createdBy("user-1")
        .build();
  }
}
