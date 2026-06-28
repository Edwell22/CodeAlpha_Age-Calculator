# CodeAlpha_Age-Calculator
An **Age Calculator** is a web application that calculates a person's exact age based on their **Date of Birth (DOB)**. It uses JavaScript's `Date` object to compare the user's birth date with the current date and displays the result in **years, months, and days**.

### How the Age Calculator Works

1. **User enters their Date of Birth**

   * The user selects their birth date using a date input field (`<input type="date">`).

2. **Input validation**

   * The application checks whether the user has selected a date.
   * It also verifies that the selected date is not in the future.

3. **Calculate the age**

   * JavaScript retrieves the current date using the `Date` object.
   * It compares the current date with the user's birth date.
   * The program calculates the difference in years, months, and days, making adjustments when the current day or month is earlier than the birth day or month.

4. **Display the result**

   * The calculated age is shown on the webpage in a clear format, such as:

     ```
     Your Age:
     22 Years
     5 Months
     14 Days
     ```

### Main Functions of an Age Calculator

* Accepts the user's **Date of Birth**.
* Validates the entered date.
* Uses JavaScript's **Date** object to perform date calculations.
* Calculates the exact age in **years, months, and days**.
* Displays the result instantly without reloading the page.
* Handles invalid inputs by showing appropriate error messages.

### Technologies Used

* **HTML:** Creates the user interface (date input, button, result area).
* **CSS:** Styles the application and makes it responsive.
* **JavaScript:** Performs input validation, calculates the age, manipulates the DOM, and displays the result.

### Example

If today's date is **28 June 2026** and the user enters **15 March 2004**, the application calculates:

* **Years:** 22
* **Months:** 3
* **Days:** 13

The output would be:

```
Age:
22 Years, 3 Months, 13 Days
```

In summary, the **Age Calculator** is a simple yet practical web application that demonstrates **DOM manipulation**, **JavaScript Date & Time operations**, and **input validation** while providing users with an accurate calculation of their age.

