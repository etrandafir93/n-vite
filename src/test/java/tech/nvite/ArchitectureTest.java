package tech.nvite;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.web.bind.annotation.RestController;
import tech.nvite.infra.UseCase;

class ArchitectureTest {

  private static JavaClasses classes;

  @BeforeAll
  static void importClasses() {
    classes =
        new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("tech.nvite");
  }

  @Test
  void controllersShouldNotAccessDomain() {
    noClasses()
        .that()
        .areAnnotatedWith(RestController.class)
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..domain..")
        .because(
            "REST controllers should delegate to use cases instead of directly accessing repositories")
        .check(classes);
  }

  @Test
  void useCasesMustLiveInUseCasesPackage() {
    classes()
        .that()
        .areAnnotatedWith(UseCase.class)
        .should()
        .resideInAPackage("..usecases..")
        .because("Use cases should be in the domain.usecases package")
        .check(classes);
  }

  @Test
  void useCasesCanOnlyDependOnDomain() {
    classes()
        .that()
        .areAnnotatedWith(UseCase.class)
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..domain..")
        .because(
            "Use cases should not depend on REST controllers or other infra - the dependency should go the other way")
        .check(classes);
  }

  @Test
  void domainCannotDependOnUseCases() {
    noClasses()
        .that()
        .resideInAPackage("..domain..")
        .should()
        .dependOnClassesThat()
        .areAnnotatedWith(UseCase.class)
        .because("Domain model should be independent of use cases")
        .check(classes);
  }
}
