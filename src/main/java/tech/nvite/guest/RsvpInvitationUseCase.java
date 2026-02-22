package tech.nvite.guest;

import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import lombok.With;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.domain.Rsvp;
import tech.nvite.domain.RsvpAnswer;
import tech.nvite.domain.RsvpRepository;
import tech.nvite.infra.UseCase;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class RsvpInvitationUseCase
    implements Function<RsvpInvitationUseCase.Request, RsvpInvitationUseCase.Response> {

  private final RsvpRepository rsvp;

  @Override
  public Response apply(Request req) {
    log.info("Saving RSVP {}", req);

    RsvpAnswer answer =
        switch (req.rsvp) {
          case "ACCEPTED" -> new RsvpAnswer.Accepted();
          case "DECLINED" -> new RsvpAnswer.Declined();
          default -> throw new IllegalArgumentException("Invalid RSVP answer: " + req.rsvp);
        };

    var saved = rsvp.save(new Rsvp(req.name, req.eventReference, answer, req.partnerName()));
    log.info("RSVP saved {}", saved.id());
    return new Response(saved.id());
  }

  public record Request(
      @With String eventReference, String name, String rsvp, String partnerName) {}

  public record Response(String rsvpId) {}
}
