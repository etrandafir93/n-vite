package tech.nvite.domain;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("event_access_grants")
public record EventAccessGrant(
    @Id String id,
    String eventReference,
    String userEmail,
    EventAccessRole role,
    String grantedBy,
    Instant grantedAt) {}
