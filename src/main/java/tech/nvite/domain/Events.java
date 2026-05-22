package tech.nvite.domain;

import static java.time.LocalDateTime.now;

import java.util.LinkedHashMap;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import tech.nvite.infra.errors.EventNotFoundException;
import tech.nvite.infra.errors.ForbiddenOperationException;
import tech.nvite.infra.security.CurrentUser;
import tech.nvite.infra.security.UserAccounts;

@Repository
@RequiredArgsConstructor
public class Events {

  private final EventsMongoRepository repo;
  private final CurrentUser currentUser;
  private final UserAccounts userAccounts;
  private final EventAccessGrants eventAccessGrants;

  public String create(Event event) {
    Assert.notNull(event.eventReference(), "eventReference cannot be null.");
    Assert.isNull(event.created(), "created must be null when creating a new event!");

    Assert.isTrue(
        repo.findById(event.eventReference()).isEmpty(),
        "Key %s is not unique! We cannot save this event!".formatted(event.eventReference()));

    var newEvent = event.withEventReference(event.eventReference()).withCreated(now());

    repo.save(newEvent);
    return event.eventReference();
  }

  public void delete(String eventReference) {
    repo.deleteById(eventReference);
  }

  public String edit(Event event) {
    Assert.notNull(
        event.eventReference(), "eventReference must not be null when editing existing event!");
    repo.save(event);
    return event.eventReference();
  }

  public Optional<Event> find(String eventReference) {
    return repo.findById(eventReference);
  }

  public Event findOrThrow(String eventReference) {
    return find(eventReference).orElseThrow(() -> new EventNotFoundException(eventReference));
  }

  public Event findViewableOrThrow(String eventReference) {
    var event = findOrThrow(eventReference);
    assertAuthorized(event, access -> access.canView(), "view");
    return event;
  }

  public Event findEditableOrThrow(String eventReference) {
    var event = findOrThrow(eventReference);
    assertAuthorized(event, access -> access.canEdit(), "edit");
    return event;
  }

  public Event findDeletableOrThrow(String eventReference) {
    var event = findOrThrow(eventReference);
    assertAuthorized(event, access -> access.canDelete(), "delete");
    return event;
  }

  public Event findAccessManageableOrThrow(String eventReference) {
    var event = findOrThrow(eventReference);
    assertAuthorized(event, access -> access.canManageAccess(), "manage access for");
    return event;
  }

  public Stream<AccessibleEvent> findAllAccessibleForCurrentUser() {
    if (userAccounts.isCurrentUserAdmin()) {
      return repo.findAll().stream()
          .map(
              event ->
                  new AccessibleEvent(
                      event,
                      resolvedOwnerEmail(event),
                      eventAccessGrants.findByEventReference(event.eventReference()).stream()
                          .map(EventAccessGrant::userEmail)
                          .toList(),
                      "ADMIN",
                      true,
                      true,
                      true));
    }

    var user = currentUser.get();
    var accessible = new LinkedHashMap<String, AccessibleEvent>();

    repo.findAllByCreatedBy(user.id())
        .forEach(
            event ->
                accessible.put(
                    event.eventReference(),
                    new AccessibleEvent(
                        event,
                        resolvedOwnerEmail(event),
                        eventAccessGrants.findByEventReference(event.eventReference()).stream()
                            .map(EventAccessGrant::userEmail)
                            .toList(),
                        "OWNER",
                        true,
                        true,
                        false)));

    if (user.normalizedEmail() != null) {
      repo.findAllByOwnerEmail(user.normalizedEmail())
          .forEach(
              event ->
                  accessible.put(
                      event.eventReference(),
                      new AccessibleEvent(
                          event,
                          resolvedOwnerEmail(event),
                          eventAccessGrants.findByEventReference(event.eventReference()).stream()
                              .map(EventAccessGrant::userEmail)
                              .toList(),
                          "OWNER",
                          true,
                          true,
                          false)));

      var grantedRefs =
          eventAccessGrants.findByUserEmail(user.normalizedEmail()).stream()
              .map(EventAccessGrant::eventReference)
              .toList();

      if (!grantedRefs.isEmpty()) {
        repo.findAllByEventReferenceIn(grantedRefs)
            .forEach(
                event ->
                    accessible.putIfAbsent(
                        event.eventReference(),
                        new AccessibleEvent(
                            event,
                            resolvedOwnerEmail(event),
                            eventAccessGrants.findByEventReference(event.eventReference()).stream()
                                .map(EventAccessGrant::userEmail)
                                .toList(),
                            "EDITOR",
                            true,
                            false,
                            false)));
      }
    }

    return accessible.values().stream();
  }

  private void assertAuthorized(Event event, Predicate<ResolvedAccess> predicate, String action) {
    var access = resolveAccess(event);
    if (!predicate.test(access)) {
      throw new ForbiddenOperationException(
          "You do not have permission to %s invitation %s"
              .formatted(action, event.eventReference()));
    }
  }

  private ResolvedAccess resolveAccess(Event event) {
    if (userAccounts.isCurrentUserAdmin()) {
      return new ResolvedAccess(true, true, true, true);
    }

    var user = currentUser.get();
    if (isOwner(event, user)) {
      return new ResolvedAccess(true, true, true, false);
    }

    var grant =
        user.normalizedEmail() == null
            ? Optional.<EventAccessGrant>empty()
            : eventAccessGrants.find(event.eventReference(), user.normalizedEmail());

    if (grant.isPresent() && grant.get().role() == EventAccessRole.EDITOR) {
      return new ResolvedAccess(true, true, false, false);
    }

    return new ResolvedAccess(false, false, false, false);
  }

  private boolean isOwner(Event event, CurrentUser.User user) {
    if (event.createdBy() != null && event.createdBy().equals(user.id())) {
      return true;
    }
    return event.ownerEmail() != null && event.ownerEmail().equals(user.normalizedEmail());
  }

  private String resolvedOwnerEmail(Event event) {
    return event.ownerEmail() != null ? event.ownerEmail() : event.createdBy();
  }

  private record ResolvedAccess(
      boolean canView, boolean canEdit, boolean canDelete, boolean canManageAccess) {}

  public record AccessibleEvent(
      Event event,
      String ownerEmail,
      java.util.List<String> editors,
      String accessRole,
      boolean canEdit,
      boolean canDelete,
      boolean canManageAccess) {}
}
