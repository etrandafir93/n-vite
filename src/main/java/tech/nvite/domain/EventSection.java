package tech.nvite.domain;

import jakarta.annotation.Nullable;
import java.util.List;
import lombok.NonNull;

public record EventSection(
    @NonNull SectionType type,

    // DRESS_CODE fields
    @Nullable String dressCodeFormality,
    @Nullable String dressCodeColours,
    @Nullable String dressCodeNote,
    @Nullable String dressCodeImageUrl,

    // ACCOMMODATION fields
    @Nullable List<HotelEntry> hotels,

    // DAY_SCHEDULE fields
    @Nullable List<ScheduleItem> scheduleItems) {

  public record HotelEntry(
      String name,
      @Nullable String distance,
      @Nullable String bookingLink,
      @Nullable String note) {}

  public record ScheduleItem(
      String time,
      String label) {}
}
