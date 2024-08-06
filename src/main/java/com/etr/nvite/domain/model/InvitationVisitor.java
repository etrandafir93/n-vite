package com.etr.nvite.domain.model;

public sealed interface InvitationVisitor permits InvitationVisitor.NamedGuest, InvitationVisitor.Anonymous {

    static InvitationVisitor NamedGuest(String name) {
        return new NamedGuest(name);
    }

    static InvitationVisitor Anonymous() {
        return new Anonymous();
    }

    record NamedGuest(String name) implements InvitationVisitor {
    }

    record Anonymous() implements InvitationVisitor {
    }
}

