package tech.nvite.app.errors;

public class NoUserInContextException extends RuntimeException {
  public NoUserInContextException() {
    super("No user in context! Login might be needed for this operation.");
  }
}
