package tech.nvite.domain.model;

public sealed interface InvitationVisitor permits InvitationVisitor.NamedGuest, InvitationVisitor.Anonymous {

    static InvitationVisitor withName(String name) {
        return new NamedGuest(name);
    }
    static InvitationVisitor anonymous() {
        return new Anonymous();
    }

    record NamedGuest(String name) implements InvitationVisitor {
    }

    record Anonymous() implements InvitationVisitor {
    }

}
