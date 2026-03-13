package tech.nvite.host;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import tech.nvite.domain.Events;
import tech.nvite.domain.RsvpRepository;
import tech.nvite.infra.UseCase;

@UseCase
@RequiredArgsConstructor
public class ExportGuestListUseCase
    implements Function<String, ExportGuestListUseCase.ExportResult> {

  private static final DateTimeFormatter DATE_FMT =
      DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.systemDefault());

  private static final String[] HEADERS = {
    "Guest Name",
    "Status",
    "Plus One",
    "Partner Name",
    "Menu Preference",
    "Children",
    "Transport",
    "Notes",
    "RSVP Date"
  };

  private final Events events;
  private final RsvpRepository rsvps;

  @Override
  public ExportResult apply(String eventReference) {
    var event = events.findOrThrow(eventReference);
    var allRsvps = rsvps.findAllByEventReference(eventReference);

    try (Workbook workbook = new XSSFWorkbook()) {
      var sheet = workbook.createSheet("Guests");
      var headerStyle = buildHeaderStyle(workbook);

      writeHeaders(sheet, headerStyle);

      int rowIdx = 1;
      for (var rsvp : allRsvps) {
        var row = sheet.createRow(rowIdx++);
        row.createCell(0).setCellValue(rsvp.guest());
        row.createCell(1)
            .setCellValue("ACCEPTED".equalsIgnoreCase(rsvp.answer()) ? "Accepted" : "Declined");
        row.createCell(2).setCellValue(rsvp.partnerName() != null ? "Yes" : "No");
        row.createCell(3).setCellValue(rsvp.partnerName() != null ? rsvp.partnerName() : "");
        row.createCell(4).setCellValue(rsvp.menuPreference() != null ? rsvp.menuPreference() : "");
        row.createCell(5).setCellValue(rsvp.children() != null ? rsvp.children() : 0);
        row.createCell(6)
            .setCellValue(rsvp.transport() == null ? "" : rsvp.transport() ? "Yes" : "No");
        row.createCell(7).setCellValue(rsvp.notes() != null ? rsvp.notes() : "");
        row.createCell(8).setCellValue(DATE_FMT.format(rsvp.timestamp()));
      }

      for (int i = 0; i < HEADERS.length; i++) {
        sheet.autoSizeColumn(i);
      }

      var out = new ByteArrayOutputStream();
      workbook.write(out);

      var filename = event.groomName() + "-and-" + event.brideName() + "-guests.xlsx";
      return new ExportResult(out.toByteArray(), filename.toLowerCase().replace(" ", "-"));
    } catch (IOException e) {
      throw new RuntimeException("Failed to generate Excel export", e);
    }
  }

  private void writeHeaders(Sheet sheet, CellStyle style) {
    Row headerRow = sheet.createRow(0);
    for (int i = 0; i < HEADERS.length; i++) {
      var cell = headerRow.createCell(i);
      cell.setCellValue(HEADERS[i]);
      cell.setCellStyle(style);
    }
  }

  private CellStyle buildHeaderStyle(Workbook workbook) {
    var style = workbook.createCellStyle();
    style.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    style.setBorderBottom(BorderStyle.THIN);

    Font font = workbook.createFont();
    font.setColor(IndexedColors.WHITE.getIndex());
    font.setBold(true);
    style.setFont(font);

    return style;
  }

  public record ExportResult(byte[] content, String filename) {}
}
