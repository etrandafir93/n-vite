package tech.nvite.domain.usecases;

import jakarta.annotation.Nullable;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import lombok.With;
import lombok.extern.slf4j.Slf4j;
import tech.nvite.app.UseCase;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Rsvp;
import tech.nvite.domain.model.RsvpAnswer;
import tech.nvite.domain.model.RsvpRepository;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class RsvpInvitationUseCase
    implements Function<RsvpInvitationUseCase.Request, RsvpInvitationUseCase.Response> {

  private final RsvpRepository rsvp;

  @Override
  public Response apply(Request req) {
    log.info("Saving RSVP {}", req);
    var saved = rsvp.save(new Rsvp(req.name, req.eventReference, req.rsvp, req.partnerName()));
    log.info("RSVP saved {}", saved.id());
    return new Response(saved.id());
  }

  public record Request(
      @With EventReference eventReference,
      String name,
      RsvpAnswer rsvp,
      @Nullable String partnerName) {}

  public record Response(String rsvpId) {}
}
