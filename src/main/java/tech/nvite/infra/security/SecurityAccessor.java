package tech.nvite.infra.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SecurityAccessor {

	public String getCurrentUserId() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null && authentication.getPrincipal() instanceof OAuth2User principal) {
			log.info("Current User Data: {}", principal);
			return principal.getAttribute("sub"); // or principal.getName()
		}

		return null;
	}

}
