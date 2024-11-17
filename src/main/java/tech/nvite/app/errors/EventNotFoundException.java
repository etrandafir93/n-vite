package tech.nvite.app.errors;

import tech.nvite.domain.model.EventReference;

public class EventNotFoundException extends RuntimeException {
  public EventNotFoundException(EventReference ref) {
    super("Couldn't found any event with ref: '%s'".formatted(ref.value()));
  }
}
