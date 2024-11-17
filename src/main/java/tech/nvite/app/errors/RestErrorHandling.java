package tech.nvite.app.errors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class RestErrorHandling {

  @ExceptionHandler(EventNotFoundException.class)
  ResponseEntity<ErrorResponse> handleEventNotFoundException(
      EventNotFoundException ex, WebRequest __) {
    return new ResponseEntity<>(new ErrorResponse(ex), HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(NoUserInContextException.class)
  ResponseEntity<ErrorResponse> handleNoUserInContextException(
      NoUserInContextException ex, WebRequest __) {
    return new ResponseEntity<>(new ErrorResponse(ex), HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(RuntimeException.class)
  ResponseEntity<ErrorResponse> handleRuntimeExceptions(RuntimeException ex, WebRequest __) {
    return new ResponseEntity<>(new ErrorResponse(ex), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
