package green.tech.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Exposes a basic hello world endpoint. */
@RestController
public class HelloController {

  /** Returns a plain text hello world response. */
  @GetMapping("/hello")
  public String hello() {
    return "Hello, world!";
  }
}
