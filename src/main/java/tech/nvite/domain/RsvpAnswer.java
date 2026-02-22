package tech.nvite.domain;

public sealed interface RsvpAnswer permits RsvpAnswer.Accepted, RsvpAnswer.Declined {

  record Accepted() implements RsvpAnswer {}

  record Declined() implements RsvpAnswer {}
}
