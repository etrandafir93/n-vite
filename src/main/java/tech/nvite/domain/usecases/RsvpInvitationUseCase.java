package tech.nvite.domain.usecases;

import java.util.function.Function;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import tech.nvite.domain.model.EventReference;
import tech.nvite.domain.model.Rsvp;
import tech.nvite.domain.model.RsvpAnswer;
import tech.nvite.domain.model.RsvpRepository;
import tech.nvite.util.UseCase;

@UseCase
@RequiredArgsConstructor
public class RsvpInvitationUseCase implements Function<RsvpInvitationUseCase.Request, RsvpInvitationUseCase.Response> {

    private final RsvpRepository rsvp;

    @Override
    public Response apply(Request req) {
        var saved = rsvp.save(new Rsvp(req.name, req.eventReference, req.rsvp));
        return new Response(saved.id());
    }

    public record Request(EventReference eventReference, String name, RsvpAnswer rsvp) {
    }

    public record Response(String rsvpId) {}

}