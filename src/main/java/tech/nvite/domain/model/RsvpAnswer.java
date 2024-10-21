package tech.nvite.domain.model;

public sealed interface RsvpAnswer permits RsvpAnswer.Accepted, RsvpAnswer.Declined {

    record Accepted() implements RsvpAnswer {
    }

    record Declined() implements RsvpAnswer {
    }
}
