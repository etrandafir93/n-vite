package tech.nvite.app.errors;

public record ErrorResponse(String error) {
  public ErrorResponse(Exception exception) {
    this(exception.getMessage());
  }
}
