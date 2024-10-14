


| ID        | TC4007                                            |
|-----------|---------------------------------------------------|
| **Target Description:** | Verify if the current date is displayed on the transaction form when the user accesses the main page. (Tablet) |
| **Type**  | Functional                                        |
| **Priority:** | Medium                                         |

### Pre-conditions:
1. The web page (https://kapusta-qa-ro.p.goit.global/) is accessible and operational.
2. The user has a registered account and is logged into their account successfully on the main page.

| Step | Expected result | Pass | Fail | Bug report ID |
|------|-----------------|------|------|---------------|
| 1    | Navigate to the homepage after logging in successfully. | The main page loads, and the transaction form is visible. | x |  |               |
| 2    | Observe the date field in the "Add Transaction" form. | The current date (system date) is displayed by default in the date field of the form. | x |  |               |
| 3    | Verify the format of the displayed date. | The date format is correct according to the user's locale or system settings. | x |  |               |

**Executor:** Cristiana Constantin  
**Date:** 13/09/2024
