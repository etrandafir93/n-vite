package tech.nvite.guest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("v2/invitations/{ref}")
public class InvitationAudienceV2 {

  @GetMapping
  public InvitationDetailsDto invitationDetails() {
    return null; // todo
  }

  record InvitationDetailsDto() {
    // todo
  }
}
