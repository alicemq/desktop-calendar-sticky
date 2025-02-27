console.log('external js file loaded');


window.onload = function () {
    loadSettings();
    // updateCalendars();
    setInterval(updateCalendars(), 1000 * 60 * 60 * 24); // Update every day
    createLocaleOptions();
    createCountryOptions();

    var allRanges = document.querySelectorAll(".range-wrap");
    allRanges.forEach(wrap => {
        const range = wrap.querySelector(".range");
        const bubble = wrap.querySelector(".bubble");

        // Add listeners for both range and number input
        range.addEventListener("input", () => {
            syncInputs(range, bubble);
            applySettings();
        });
        
        bubble.addEventListener("input", () => {
            syncInputs(bubble, range);
            applySettings();
        });

        syncInputs(range, bubble); // Initial sync
    });

    // Add event listeners for zoom buttons
    document.getElementById('zoomPlus1').addEventListener('click', () => adjustZoom(0.5));
    document.getElementById('zoomMinus1').addEventListener('click', () => adjustZoom(-0.5));
    document.getElementById('zoomPlus10').addEventListener('click', () => adjustZoom(10));
    document.getElementById('zoomMinus10').addEventListener('click', () => adjustZoom(-10));
    document.getElementById('settings-menu').addEventListener('change', () => applySettings())
    document.getElementById('bgColor').addEventListener('input', () => applySettings());

}

// Remove or comment out the old setBubble function since we're replacing it
// function setBubble(range, bubble) {
//     const val = range.value;
//     const min = range.min ? range.min : 0;
//     const max = range.max ? range.max : 100;
//     const newVal = Number(((val - min) * 100) / (max - min));
//     bubble.value = val;
// }

// Replace the existing setBubble function with these two functions
function syncInputs(source, target) {
    // Ensure value is within min/max bounds
    const val = Math.min(Math.max(source.value, source.min || -Infinity), source.max || Infinity);
    source.value = val;
    target.value = val;
}

// Retrieve and validate stored settings
var locale = localStorage.getItem('locale');
var zoomLevel = Number(localStorage.getItem('zoomLevel'));

if (!locale) {
    locale = "en-US";  // Set the default
    localStorage.setItem('locale', locale);
}
var monthsToGenerate = parseInt(localStorage.getItem('monthsToGenerate'));
if (isNaN(monthsToGenerate)) {
    localStorage.setItem('monthsToGenerate', 3);
    monthsToGenerate = 3; // Set the fallback value directly
}
var monthsOffset = parseInt(localStorage.getItem('monthsOffset'));
if (isNaN(monthsOffset)) {
    localStorage.setItem('monthsOffset', 0);
    monthsOffset = 0; // Set the fallback value directly
}
if (isNaN(zoomLevel)) {
    localStorage.setItem('zoomLevel', 100);
    zoomLevel = 100; // Set the fallback value directly
}
var draggable = localStorage.getItem("draggable") === "true"; // Ensure it's a proper boolean
var country = localStorage.getItem('country') || 'LT';
var useNativeNames = localStorage.getItem('useNativeNames') !== 'false';
var showBankHolidays = localStorage.getItem('showBankHolidays') !== 'false';
var showOtherHolidays = localStorage.getItem('showOtherHolidays') !== 'false';
var backgroundColor = localStorage.getItem('backgroundColor') || '#f0f0f0';
var bgOpacity = localStorage.getItem('bgOpacity');
bgOpacity = bgOpacity === null ? 100 : parseInt(bgOpacity); // Set to 100 only if not set
var settingsIcon = 0;

/**
 * Applies stored settings to UI elements.
 */
function loadSettings() {
    document.getElementById('locale').value = locale;
    document.getElementById('monthsToGenerate').value = monthsToGenerate;
    document.getElementById('monthsOffset').value = monthsOffset;
    document.getElementById('zoomLevel').innerHTML = zoomLevel;
    document.getElementById('draggable').checked = draggable;
    document.getElementById('country').value = country;
    document.getElementById('nativeNames').checked = useNativeNames;
    document.getElementById('showBankHolidays').checked = showBankHolidays;
    document.getElementById('showOtherHolidays').checked = showOtherHolidays;
    document.getElementById('bgColor').value = backgroundColor;
    // document.getElementById('bgOpacity').value = bgOpacity;


    // Apply settings visually
    tauridraggable();
    applyZoom(zoomLevel);
    applyBackgroundSettings();
}

function applyBackgroundSettings() {
    var opacity = draggable ? 0.8 : 0;
    var rgb = hexToRgb(backgroundColor);
    
    if (rgb) {
        if (opacity === 0) {
            document.body.style.backgroundColor = 'transparent';
        } else {
            document.body.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
        }
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
/**
 * Toggles the draggable attribute for elements with the ID 'tauri-drag'.
 */
function tauridraggable() {
    document.querySelectorAll('.tauri-drag').forEach(element => {
        if (draggable) {
            element.setAttribute('data-tauri-drag-region', '');
            // console.log('Draggable enabled');
        } else {
            element.removeAttribute('data-tauri-drag-region');
            // console.log('Draggable disabled');
        }
    });
}

/**
 * Applies and stores settings from the UI elements.
 */
function applySettings() {
    locale = document.getElementById('locale').value;
    monthsToGenerate = parseInt(document.getElementById('monthsToGenerate').value) || 3;
    monthsOffset = parseInt(document.getElementById('monthsOffset').value) || 0;
    zoomLevel = localStorage.getItem('zoomLevel') || 100;
    draggable = document.getElementById('draggable').checked;
    country = document.getElementById('country').value;
    useNativeNames = document.getElementById('nativeNames').checked;
    showBankHolidays = document.getElementById('showBankHolidays').checked;
    showOtherHolidays = document.getElementById('showOtherHolidays').checked;
    backgroundColor = document.getElementById('bgColor').value;
    
    // If draggable is disabled and opacity was at minimum, set to 0
    if (!draggable && bgOpacity === 80) {
        bgOpacity = 0;
        // document.getElementById('bgOpacity').value = 0;
    }
    
    // If draggable is enabled, enforce minimum opacity
    if (draggable && bgOpacity < 80) {
        bgOpacity = 80;
        // document.getElementById('bgOpacity').value = 80;
    }
    
    // Store the actual numeric value, even if zero
    localStorage.setItem('bgOpacity', bgOpacity.toString());

    // Store updated values
    localStorage.setItem('locale', locale);
    localStorage.setItem('monthsToGenerate', monthsToGenerate);
    localStorage.setItem('monthsOffset', monthsOffset);
    localStorage.setItem('zoomLevel', zoomLevel);
    localStorage.setItem('draggable', draggable.toString()); // Ensure it's stored as "true" or "false"
    localStorage.setItem('country', country);
    localStorage.setItem('useNativeNames', useNativeNames);
    localStorage.setItem('showBankHolidays', showBankHolidays);
    localStorage.setItem('showOtherHolidays', showOtherHolidays);
    localStorage.setItem('backgroundColor', backgroundColor);

    // Apply settings visually
    tauridraggable();
    applyZoom(zoomLevel);
    updateCalendars();
    applyBackgroundSettings()

}

/**
 * Adjusts the position of tooltips to ensure they are fully visible within the viewport.
 */
function adjustTooltipPositions() {
    document.querySelectorAll('.tooltip-container').forEach(el => {
        let rect = el.getBoundingClientRect();
        let tooltipWidth = 150; // Max tooltip width
        let margin = 10; // Safety margin from edges

        // Remove previous classes
        el.classList.remove("tooltip-bottom", "tooltip-left", "tooltip-right");

        // If too close to the top, move tooltip below
        if (rect.top < 50) {
            el.classList.add("tooltip-bottom");
        }

        // If too close to the right edge, shift left
        if (rect.left + tooltipWidth > window.innerWidth - margin) {
            el.classList.add("tooltip-left");
        }

        // If too close to the left edge, shift right
        if (rect.left < margin) {
            el.classList.add("tooltip-right");
        }
    });
}

// Run function after calendar is generated
setTimeout(adjustTooltipPositions, 100);
window.addEventListener("resize", adjustTooltipPositions);


/**
 * Generates a calendar for a given year and month and inserts it into the specified HTML element.
 *
 * @param {number} year - The year for which the calendar is generated.
 * @param {number} month - The month for which the calendar is generated (0-indexed, i.e., January is 0).
 * @param {string} elementId - The ID of the HTML element where the calendar will be inserted.
 */
function generateCalendar(year, month, elementId) {
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1; // Adjust to make Monday the first day
    var lastDayPrevMonth = new Date(year, month, 0).getDate();
    var today = new Date();

    // Lithuanian holidays (month is 0-indexed, i.e., January is 0)
    var easter = getEasterDate(year);

    var calendarHtml = '<div class="calendar-header">' + new Date(year, month, 1).toLocaleString(locale, { month: 'long', year: 'numeric' }) + '</div>';
    calendarHtml += '<div class="calendar-grid">';

    // Weekday abbreviations

    if (settingsIcon === 0) {

        calendarHtml += `<div class="week-number calendar-item"><button onclick="toggleSettingsMenu()" class="settings-icon btn btn-secondary tauri-drag" alt="Settings" id="tauri-drag"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg></button></div>`;
        settingsIcon = 1;
    } else {
        calendarHtml += '<div class="week-number calendar-item"></div>';
    };


    calendarHtml += '<div class="weekday calendar-item">Mo</div>';
    calendarHtml += '<div class="weekday calendar-item">Tu</div>';
    calendarHtml += '<div class="weekday calendar-item">We</div>';
    calendarHtml += '<div class="weekday calendar-item">Th</div>';
    calendarHtml += '<div class="weekday calendar-item">Fr</div>';
    calendarHtml += '<div class="weekday calendar-item">Sa</div>';
    calendarHtml += '<div class="weekday calendar-item">Su</div>';

    // Week number display
    var weekNumber = getWeekNumber(new Date(year, month, 1));
    calendarHtml += '<div class="week-number calendar-item">W' + weekNumber + '</div>';

    // Previous month days
    for (var i = firstDay; i > 0; i--) {
        calendarHtml += '<div class="calendar-day other-month calendar-item">' + (lastDayPrevMonth - i + 1) + '</div>';
    }

    // Current month days
    for (var day = 1; day <= daysInMonth; day++) {
        var currentDate = new Date(year, month, day);
        var isToday = (currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getDate() === today.getDate());
        var isWeekend = (currentDate.getDay() === 6 || currentDate.getDay() === 0); // Saturday (6) or Sunday (0)
        var holiday = getHolidays(country, useNativeNames)
            .find(h => h.month === month && h.day === day &&
                ((h.bankHoliday && showBankHolidays) || (!h.bankHoliday && showOtherHolidays)));
        var isHoliday = holiday;
        var dayClass = "calendar-day";
        if (isHoliday) {
            dayClass += " holiday-drag";
            if (holiday.bankHoliday) {
                dayClass += " bank-holiday";
            } else {
                dayClass += " other-holiday";
            }
        }
        if (isToday) dayClass += " today";

        if (isWeekend) dayClass += " weekend";
        else dayClass += " workday";

        // Insert week number before Mondays
        if (currentDate.getDay() === 1 && day != 1) {
            weekNumber = getWeekNumber(currentDate);
            calendarHtml += '<div class="week-number calendar-item">W' + weekNumber + '</div>';
        }

        // Apply tooltip if it's a holiday
        var tooltipAttr = isHoliday ? ' data-tooltip="' + holiday.name + '"' : "";
        if (isHoliday) dayClass += " tooltip-container"
        calendarHtml += '<div class="' + dayClass + ' calendar-item "' + tooltipAttr + '>' + (isHoliday ? '<div class="holiday-drag holi-top tauri-drag" data-tauri-drag-region id="tauri-drag"></div>' : '') + day + '</div>';
    }

    // Next month days to fill the grid
    var nextMonthDay = 1;
    var nextMonthFirstDay = new Date(year, month + 1, 1).getDay(); // Get the first day of the next month

    // Skip the next month if the first day is a Monday
    if (nextMonthFirstDay != 1) {
        while ((firstDay + daysInMonth + nextMonthDay - 1) % 7 !== 0 || nextMonthDay === 1) {
            // Generate the next month's day
            calendarHtml += '<div class="calendar-day other-month calendar-item">' + nextMonthDay + '</div>';
            nextMonthDay++;
        }
    }

    calendarHtml += '</div>';
    document.getElementById(elementId).innerHTML = calendarHtml;
    tauridraggable();
}

/**
 * Calculates the ISO week number for a given date.
 *
 * @param {Date} date - The date object for which to calculate the week number.
 * @returns {number} The ISO week number of the given date.
 */
function getWeekNumber(date) {
    let year = date.getFullYear();
    let thursdayOfWeek = new Date(date);
    thursdayOfWeek.setDate(date.getDate() + (4 - (date.getDay() || 7))); // Find the Thursday of this week

    let firstThursday = new Date(thursdayOfWeek.getFullYear(), 0, 4);
    firstThursday.setDate(firstThursday.getDate() + (4 - (firstThursday.getDay() || 7))); // Find first Thursday of the year

    let weekNumber = Math.ceil(((thursdayOfWeek - firstThursday) / 86400000 + 1) / 7);

    return weekNumber;
}

/**
 * Updates the calendar display by generating and appending new calendar elements
 * for a specified range of months, starting from the current date.
 *
 * The function clears the existing calendar content and then iterates over a range
 * of months, calculating the correct month and year for each iteration. It creates
 * a new container for each month's calendar and appends it to the main calendar
 * container. Finally, it generates the calendar inside the newly created container.
 *
 * @global
 * @function
 */
function updateCalendars() {
    settingsIcon = 0;
    var now = new Date();
    // debug
    now = new Date(2025, 1, 16);
    //end debug
    var allCalendars = document.getElementById('all-calendars');

    // Clear the current content before appending new calendars
    allCalendars.innerHTML = '';

    var loop = 0;
    for (let i = Number(monthsOffset); i < monthsToGenerate + monthsOffset; i++) {

        // Calculate the correct month and year for each iteration
        var currentMonth = now.getMonth() + i;  // Adjust the month with offset
        var yearOffset = Math.floor(currentMonth / 12);  // Check if we need to go back or forward a year

        // Adjust the final year and month based on the overflow of months
        var finalYear = now.getFullYear() + yearOffset;
        var finalMonth = currentMonth % 12;  // Get the correct month (0-11)

        // If the calculated month is negative (for past months), adjust the year accordingly
        if (finalMonth < 0) {
            finalMonth += 12;
            finalYear -= 1;
        }

        // Create a container for the month calendar
        var monthCalendar = document.createElement('div');
        monthCalendar.id = 'month-calendar-' + i;
        monthCalendar.className = 'calendar';

        // Append the newly created container to the all-calendars container
        allCalendars.appendChild(monthCalendar);

        // Now generate the calendar inside the new container
        generateCalendar(finalYear, finalMonth, monthCalendar.id);
    }
}

/**
 * Toggles the visibility of the settings menu.
 */
function toggleSettingsMenu() {
    var menu = document.getElementById('settings-menu');
    var icon = document.querySelector('.settings-icon');
    
    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
    } else {
        positionSettingsMenu(menu, icon);
        menu.style.display = 'flex';
    }
}

function positionSettingsMenu(menu, icon) {
    // Get icon position
    var rect = icon.getBoundingClientRect();
    
    // Start with centered position relative to icon
    menu.style.left = (rect.left - 150) + 'px'; // 150px is half typical menu width
    menu.style.top = 1 + '%';
    
    // Adjust if menu goes off screen
    setTimeout(() => {
        var menuRect = menu.getBoundingClientRect();
        
        // Keep within horizontal bounds
        if (menuRect.left < 10) {
            menu.style.left = '10px';
        } else if (menuRect.right > window.innerWidth - 10) {
            menu.style.left = (window.innerWidth - menuRect.width - 10) + 'px';
        }
        
        // Keep within vertical bounds
        // if (menuRect.bottom > window.innerHeight - 10) {
        //     menu.style.top = Math.max(10, window.innerHeight - menuRect.height - 10) + 'px';
        // }
    }, 0);
}

// Add window resize handler
window.addEventListener('resize', () => {
    var menu = document.getElementById('settings-menu');
    var icon = document.querySelector('.settings-icon');
    
    // Only reposition if menu is visible
    if (menu.style.display === 'flex') {
        positionSettingsMenu(menu, icon);
    }
});

/**
 * Applies the zoom level to the document body.
 *
 * @param {number} zoomLevel - The zoom level to apply (percentage).
 */
function applyZoom(zoomLevel) {
    document.body.style.zoom = zoomLevel + '%';
}
function roundNumber(number, decimals) {
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    return parseFloat(newnumber);
}


/**
 * Adjusts the zoom level by a specified step and updates the UI and localStorage.
 *
 * @param {number} step - The step to adjust the zoom level by.
 */
function adjustZoom(step) {
    // var zoomLevel = localStorage.getItem('zoomLevel') || 100; // Ensure zoom level is defined
    zoomLevel = Number(zoomLevel) + step // Ensure zoom level is rounded to one decimal place
    document.getElementById('zoomLevel').innerHTML = zoomLevel;
    localStorage.setItem('zoomLevel', zoomLevel);

    applyZoom(zoomLevel);

    applySettings();
}

// List of locales and their corresponding language names
var localeNames = {
    "ach": "Acholi",
    "af": "Afrikaans",
    "an": "Aragonese",
    "ar": "Arabic",
    "ast": "Asturian",
    "az": "Azerbaijani",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "bn": "Bengali",
    "br": "Breton",
    "bs": "Bosnian",
    "ca": "Catalan",
    "ca-valencia": "Valencian Catalan",
    "cak": "K'iche'",
    "cs": "Czech",
    "cy": "Welsh",
    "da": "Danish",
    "de": "German",
    "dsb": "Lower Sorbian",
    "el": "Greek",
    "en-CA": "English (Canada)",
    "en-GB": "English (UK)",
    "en-US": "English (US)",
    "eo": "Esperanto",
    "es-AR": "Spanish (Argentina)",
    "es-CL": "Spanish (Chile)",
    "es-ES": "Spanish (Spain)",
    "es-MX": "Spanish (Mexico)",
    "et": "Estonian",
    "eu": "Basque",
    "fa": "Persian",
    "ff": "Fulah",
    "fi": "Finnish",
    "fr": "French",
    "fy-NL": "Frisian (Netherlands)",
    "ga-IE": "Irish",
    "gd": "Scottish Gaelic",
    "gl": "Galician",
    "gn": "Guarani",
    "gu-IN": "Gujarati",
    "he": "Hebrew",
    "hi-IN": "Hindi",
    "hr": "Croatian",
    "hsb": "Upper Sorbian",
    "hu": "Hungarian",
    "hy-AM": "Armenian",
    "ia": "Interlingua",
    "id": "Indonesian",
    "is": "Icelandic",
    "it": "Italian",
    "ja": "Japanese",
    "ka": "Georgian",
    "kab": "Kabyle",
    "kk": "Kazakh",
    "km": "Khmer",
    "kn": "Kannada",
    "ko": "Korean",
    "lij": "Ligurian",
    "lt": "Lithuanian",
    "lv": "Latvian",
    "mk": "Macedonian",
    "mr": "Marathi",
    "ms": "Malay",
    "my": "Burmese",
    "nb-NO": "Norwegian Bokmål",
    "ne-NP": "Nepali",
    "nl": "Dutch",
    "nn-NO": "Norwegian Nynorsk",
    "oc": "Occitan",
    "pa-IN": "Punjabi",
    "pl": "Polish",
    "pt-BR": "Portuguese (Brazil)",
    "pt-PT": "Portuguese (Portugal)",
    "rm": "Romansh",
    "ro": "Romanian",
    "ru": "Russian",
    "sco": "Scots",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "son": "Songhai",
    "sq": "Albanian",
    "sr": "Serbian",
    "sv-SE": "Swedish",
    "szl": "Silesian",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tl": "Tagalog",
    "tr": "Turkish",
    "trs": "Tigrinya",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "xh": "Xhosa",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)"
};

// Function to check if a locale is supported
function isLocaleSupported(locale) {

    /**
     * Checks if a given locale is supported by the `Intl.DisplayNames` API.
     *
     * @param {string} locale - The locale to check for support.
     * @returns {boolean} - Returns `true` if the locale is supported, otherwise `false`.
     */
    try {
        // Using a try-catch block to check for supported locales
        return Intl.DisplayNames.supportedLocalesOf([locale]).length > 0;
    } catch (e) {
        return false; // Locale is not supported
    }
}

// Function to create a list of <option> elements dynamically with language names
function createLocaleOptions() {
    var selectElement = document.getElementById('locale');
    var userLocale = localStorage.getItem('locale') || "en-US";
    var browserLocale = userLocale || navigator.language;

    if (!isLocaleSupported(browserLocale)) {
        browserLocale = userLocale;
    }

    // Create array of {code, name} objects for sorting
    const localeArray = Object.entries(localeNames)
        .filter(([code]) => isLocaleSupported(code))
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Clear existing options
    selectElement.innerHTML = '';

    // Add sorted options
    localeArray.forEach(locale => {
        var option = document.createElement('option');
        option.value = locale.code;
        option.textContent = locale.name;
        selectElement.appendChild(option);
    });

    selectElement.value = browserLocale;
}

function createCountryOptions() {
    var selectElement = document.getElementById('country');
    selectElement.innerHTML = '';

    // Get available countries
    const countries = getAvailableCountries();

    // Create and populate options
    countries.forEach(country => {
        var option = document.createElement('option');
        // console.log(country);
        option.value = country.code;
        option.textContent = country.name;
        option.disabled = country.disabled;
        selectElement.appendChild(option);
    });

    // Set the stored country or default to LT
    selectElement.value = localStorage.getItem('country') || 'LT';
}


// Update the native names change handler


function adjustTooltipPositions() {
    document.querySelectorAll('.tooltip-container').forEach(el => {
        let rect = el.getBoundingClientRect();
        let tooltipWidth = 150; // Max tooltip width
        let margin = 10; // Safety margin from edges

        // Remove previous classes
        el.classList.remove("tooltip-bottom", "tooltip-left", "tooltip-right");

        // If too close to the top, move tooltip below
        if (rect.top < 50) {
            el.classList.add("tooltip-bottom");
        }

        // If too close to the right edge, shift left
        if (rect.left + tooltipWidth > window.innerWidth - margin) {
            el.classList.add("tooltip-left");
        }

        // If too close to the left edge, shift right
        if (rect.left < margin) {
            el.classList.add("tooltip-right");
        }
    });
}
// Run function after calendar is generated
setTimeout(adjustTooltipPositions, 100);
window.addEventListener("resize", adjustTooltipPositions);

