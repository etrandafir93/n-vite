package tech.nvite.domain.model;

public sealed interface RsvpAnswer permits RsvpAnswer.Accept, RsvpAnswer.Decline {

    record Accept() implements RsvpAnswer {
    }

    record Decline() implements RsvpAnswer {
    }
}
