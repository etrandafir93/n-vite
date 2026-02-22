package tech.nvite.infra.errors;

public class EventNotFoundException extends RuntimeException {
  public EventNotFoundException(String eventReference) {
    super("Couldn't found any event with ref: '%s'".formatted(eventReference));
  }
}
