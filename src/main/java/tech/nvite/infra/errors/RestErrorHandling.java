package tech.nvite.infra.errors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@Slf4j
@ControllerAdvice
public class RestErrorHandling {

  @ExceptionHandler(EventNotFoundException.class)
  ResponseEntity<ErrorResponse> handleEventNotFoundException(
      EventNotFoundException ex, WebRequest __) {
    log.error("Event not found: {}", ex.getMessage());
    return new ResponseEntity<>(new ErrorResponse(ex), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(NoUserInContextException.class)
  ResponseEntity<ErrorResponse> handleNoUserInContextException(
      NoUserInContextException ex, WebRequest __) {
    log.error("Unauthorized access: {}", ex.getMessage());
    return new ResponseEntity<>(new ErrorResponse(ex), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(RuntimeException.class)
  ResponseEntity<ErrorResponse> handleRuntimeExceptions(RuntimeException ex, WebRequest __) {
    log.error("Internal server error: {}", ex.getMessage(), ex);
    return new ResponseEntity<>(new ErrorResponse(ex), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
