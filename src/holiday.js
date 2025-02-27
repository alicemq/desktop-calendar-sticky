/**
 * Calculates the date of Easter Sunday for a given year.
 *
 * This function uses the Anonymous Gregorian algorithm to determine the date of Easter.
 *
 * @param {number} year - The year for which to calculate the date of Easter.
 * @returns {{month: number, day: number}} An object containing the month (0-indexed) and day of Easter Sunday.
 */
function getEasterDate(year) {
    var a = year % 19;
    var b = Math.floor(year / 100);
    var c = year % 100;
    var d = Math.floor(b / 4);
    var e = b % 4;
    var f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4);
    var k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return { month: month - 1, day: day }; // month is 0-indexed
}

function getMothersDay(year) {
    const date = new Date(year, 4, 1); // May 1st
    const dayOfWeek = date.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    return { month: 4, day: 1 + daysUntilSunday };
}

function getFathersDay(year) {
    const date = new Date(year, 5, 1); // June 1st
    const dayOfWeek = date.getDay();
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    return { month: 5, day: 1 + daysUntilSunday };
}

function getGoodFriday(year) {
    const easterDate = getEasterDate(year);
    // Good Friday is 2 days before Easter
    const goodFridayDay = easterDate.day - 2;
    return { month: easterDate.month, day: goodFridayDay };
}

function getAvailableCountries(useNativeNames = false) {

    return Object.keys(holidaysByCountry).map(countryCode => ({
        code: countryCode,
        name: useNativeNames ? holidaysByCountry[countryCode].nameNative : holidaysByCountry[countryCode].nameEnglish
    }));
}

var year = new Date().getFullYear();
var easter = getEasterDate(year);
var mothers = getMothersDay(year);
var fathers = getFathersDay(year);
var goodFriday = getGoodFriday(year);

var holidaysByCountry = {
    "LT": {
        nameNative: "Lietuva",
        nameEnglish: "Lithuania",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Naujųjų metų diena", nameEnglish: "New Year's Day" },
            { month: 0, day: 13, bankHoliday: false, nameNative: "Laisvės gynėjų diena", nameEnglish: "Freedom Defenders Day" },
            { month: 1, day: 14, bankHoliday: false, nameNative: "Šv. Valentino diena", nameEnglish: "St. Valentine's Day" },
            { month: 1, day: 16, bankHoliday: true, nameNative: "Valstybės atkūrimo diena", nameEnglish: "Day of Restoration of the State of Lithuania" },
            { month: 2, day: 8, bankHoliday: false, nameNative: "Tarptautinė moters diena", nameEnglish: "International Women's Day" },
            { month: 2, day: 11, bankHoliday: true, nameNative: "Lietuvos nepriklausomybės atkūrimo diena", nameEnglish: "Day of Restoration of Independence of Lithuania" },
            { month: goodFriday.month, day: goodFriday.day, bankHoliday: false, nameNative: "Didysis penktadienis", nameEnglish: "Good Friday" },
            { month: easter.month, day: easter.day, bankHoliday: true, nameNative: "Velykų sekmadienis", nameEnglish: "Easter Sunday" },
            { month: easter.month, day: easter.day + 1, bankHoliday: true, nameNative: "Velykų pirmadienis", nameEnglish: "Easter Monday" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Tarptautinė darbo diena", nameEnglish: "International Labor Day" },
            { month: mothers.month, day: mothers.day, bankHoliday: false, nameNative: "Motinos diena", nameEnglish: "Mother's Day" },
            { month: fathers.month, day: fathers.day, bankHoliday: false, nameNative: "Tėvo diena", nameEnglish: "Father's Day" },
            { month: 5, day: 24, bankHoliday: true, nameNative: "Joninės", nameEnglish: "St. John's Day" },
            { month: 6, day: 6, bankHoliday: true, nameNative: "Valstybės (Lietuvos karaliaus Mindaugo karūnavimo) diena", nameEnglish: "State Day (Coronation of King Mindaugas)" },
            { month: 7, day: 15, bankHoliday: true, nameNative: "Žolinė (Švč. Mergelės Marijos ėmimo į dangų diena)", nameEnglish: "Assumption Day" },
            { month: 9, day: 1, bankHoliday: false, nameNative: "Mokslo ir žinių diena", nameEnglish: "Knowledge Day" },
            { month: 10, day: 1, bankHoliday: true, nameNative: "Visų šventųjų diena", nameEnglish: "All Saints' Day" },
            { month: 10, day: 2, bankHoliday: true, nameNative: "Vėlinės", nameEnglish: "All Souls' Day" },
            { month: 11, day: 24, bankHoliday: true, nameNative: "Kūčios", nameEnglish: "Christmas Eve" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Kalėdos", nameEnglish: "Christmas Day" },
            { month: 11, day: 26, bankHoliday: true, nameNative: "Kalėdos (antra diena)", nameEnglish: "Second Day of Christmas" }
        ]
    },
    "US": {
        nameNative: "United States",
        nameEnglish: "United States",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "New Year's Day", nameEnglish: "New Year's Day" },
            { month: 0, day: 20, bankHoliday: false, nameNative: "Martin Luther King Jr. Day", nameEnglish: "Martin Luther King Jr. Day" },
            { month: 1, day: 17, bankHoliday: false, nameNative: "Presidents' Day", nameEnglish: "Presidents' Day" },
            { month: 4, day: 25, bankHoliday: false, nameNative: "Memorial Day", nameEnglish: "Memorial Day" },
            { month: 6, day: 4, bankHoliday: true, nameNative: "Independence Day", nameEnglish: "Independence Day" },
            { month: 8, day: 7, bankHoliday: false, nameNative: "Labor Day", nameEnglish: "Labor Day" },
            { month: 9, day: 12, bankHoliday: false, nameNative: "Columbus Day", nameEnglish: "Columbus Day" },
            { month: 10, day: 11, bankHoliday: true, nameNative: "Veterans Day", nameEnglish: "Veterans Day" },
            { month: 10, day: 26, bankHoliday: false, nameNative: "Thanksgiving Day", nameEnglish: "Thanksgiving Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Christmas Day", nameEnglish: "Christmas Day" }
        ]
    },
    "CA": {
        nameNative: "Canada",
        nameEnglish: "Canada",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "New Year's Day", nameEnglish: "New Year's Day" },
            { month: 1, day: 15, bankHoliday: false, nameNative: "Family Day", nameEnglish: "Family Day" },
            { month: 6, day: 1, bankHoliday: true, nameNative: "Canada Day", nameEnglish: "Canada Day" },
            { month: 9, day: 14, bankHoliday: false, nameNative: "Thanksgiving Day", nameEnglish: "Thanksgiving Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Christmas Day", nameEnglish: "Christmas Day" }
        ]
    },
    "GB": {
        nameNative: "United Kingdom",
        nameEnglish: "United Kingdom",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "New Year's Day", nameEnglish: "New Year's Day" },
            { month: 3, day: 10, bankHoliday: true, nameNative: "Good Friday", nameEnglish: "Good Friday" },
            { month: 3, day: 13, bankHoliday: true, nameNative: "Easter Monday", nameEnglish: "Easter Monday" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Early May Bank Holiday", nameEnglish: "Early May Bank Holiday" },
            { month: 4, day: 29, bankHoliday: true, nameNative: "Spring Bank Holiday", nameEnglish: "Spring Bank Holiday" },
            { month: 7, day: 31, bankHoliday: true, nameNative: "Summer Bank Holiday", nameEnglish: "Summer Bank Holiday" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Christmas Day", nameEnglish: "Christmas Day" },
            { month: 11, day: 26, bankHoliday: true, nameNative: "Boxing Day", nameEnglish: "Boxing Day" }
        ]
    },
    "DE": {
        nameNative: "Deutschland",
        nameEnglish: "Germany",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Neujahrstag", nameEnglish: "New Year's Day" },
            { month: 3, day: 10, bankHoliday: true, nameNative: "Karfreitag", nameEnglish: "Good Friday" },
            { month: 3, day: 13, bankHoliday: true, nameNative: "Ostermontag", nameEnglish: "Easter Monday" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Tag der Arbeit", nameEnglish: "Labor Day" },
            { month: 4, day: 21, bankHoliday: true, nameNative: "Christi Himmelfahrt", nameEnglish: "Ascension Day" },
            { month: 5, day: 1, bankHoliday: true, nameNative: "Pfingstmontag", nameEnglish: "Whit Monday" },
            { month: 9, day: 3, bankHoliday: true, nameNative: "Tag der Deutschen Einheit", nameEnglish: "German Unity Day" },
            { month: 10, day: 31, bankHoliday: true, nameNative: "Reformationstag", nameEnglish: "Reformation Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Erster Weihnachtstag", nameEnglish: "Christmas Day" },
            { month: 11, day: 26, bankHoliday: true, nameNative: "Zweiter Weihnachtstag", nameEnglish: "Second Day of Christmas" }
        ]
    },
    "FR": {
        nameNative: "France",
        nameEnglish: "France",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Jour de l'An", nameEnglish: "New Year's Day" },
            { month: 3, day: 10, bankHoliday: true, nameNative: "Vendredi Saint", nameEnglish: "Good Friday" },
            { month: 3, day: 13, bankHoliday: true, nameNative: "Lundi de Pâques", nameEnglish: "Easter Monday" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Fête du Travail", nameEnglish: "Labor Day" },
            { month: 4, day: 8, bankHoliday: true, nameNative: "Victoire 1945", nameEnglish: "Victory in Europe Day" },
            { month: 4, day: 21, bankHoliday: true, nameNative: "Ascension", nameEnglish: "Ascension Day" },
            { month: 5, day: 1, bankHoliday: true, nameNative: "Lundi de Pentecôte", nameEnglish: "Whit Monday" },
            { month: 6, day: 14, bankHoliday: true, nameNative: "Fête Nationale", nameEnglish: "Bastille Day" },
            { month: 10, day: 1, bankHoliday: true, nameNative: "Toussaint", nameEnglish: "All Saints' Day" },
            { month: 11, day: 11, bankHoliday: true, nameNative: "Armistice 1918", nameEnglish: "Armistice Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Noël", nameEnglish: "Christmas Day" }
        ]
    },
    "IT": {
        nameNative: "Italia",
        nameEnglish: "Italy",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Capodanno", nameEnglish: "New Year's Day" },
            { month: 3, day: 10, bankHoliday: true, nameNative: "Venerdì Santo", nameEnglish: "Good Friday" },
            { month: 3, day: 13, bankHoliday: true, nameNative: "Lunedì dell'Angelo", nameEnglish: "Easter Monday" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Festa del Lavoro", nameEnglish: "Labor Day" },
            { month: 4, day: 8, bankHoliday: true, nameNative: "Festa della Liberazione", nameEnglish: "Liberation Day" },
            { month: 4, day: 21, bankHoliday: true, nameNative: "Festa della Repubblica", nameEnglish: "Republic Day" },
            { month: 5, day: 2, bankHoliday: true, nameNative: "Festa della Repubblica", nameEnglish: "Republic Day" },
            { month: 8, day: 15, bankHoliday: true, nameNative: "Ferragosto", nameEnglish: "Assumption Day" },
            { month: 11, day: 1, bankHoliday: true, nameNative: "Tutti i Santi", nameEnglish: "All Saints' Day" },
            { month: 11, day: 8, bankHoliday: true, nameNative: "Festa della Liberazione", nameEnglish: "Liberation Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Natale", nameEnglish: "Christmas Day" }
        ]
    },
    "NL": {
        nameNative: "Nederland",
        nameEnglish: "Netherlands",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Nieuwjaarsdag", nameEnglish: "New Year's Day" },
            { month: 3, day: 27, bankHoliday: true, nameNative: "Koningsdag", nameEnglish: "King's Day" },
            { month: 4, day: 5, bankHoliday: true, nameNative: "Bevrijdingsdag", nameEnglish: "Liberation Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Eerste Kerstdag", nameEnglish: "Christmas Day" }
        ]
    },
    "BE": {
        nameNative: "België",
        nameEnglish: "Belgium",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Nieuwjaar", nameEnglish: "New Year's Day" },
            { month: 6, day: 21, bankHoliday: true, nameNative: "Nationale feestdag", nameEnglish: "National Day" },
            { month: 10, day: 1, bankHoliday: true, nameNative: "Allerheiligen", nameEnglish: "All Saints' Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Kerstmis", nameEnglish: "Christmas Day" }
        ]
    },
    "CH": {
        nameNative: "Schweiz",
        nameEnglish: "Switzerland",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Neujahrstag", nameEnglish: "New Year's Day" },
            { month: 7, day: 1, bankHoliday: true, nameNative: "Bundesfeier", nameEnglish: "Swiss National Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Weihnachtstag", nameEnglish: "Christmas Day" }
        ]
    },
    "AT": {
        nameNative: "Österreich",
        nameEnglish: "Austria",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Neujahrstag", nameEnglish: "New Year's Day" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Staatsfeiertag", nameEnglish: "National Holiday" },
            { month: 10, day: 26, bankHoliday: true, nameNative: "Nationalfeiertag", nameEnglish: "National Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Weihnachtstag", nameEnglish: "Christmas Day" }
        ]
    },
    "SE": {
        nameNative: "Sverige",
        nameEnglish: "Sweden",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Nyårsdagen", nameEnglish: "New Year's Day" },
            { month: 0, day: 6, bankHoliday: true, nameNative: "Trettondedag jul", nameEnglish: "Epiphany" },
            { month: easter.month, day: easter.day - 2, bankHoliday: true, nameNative: "Långfredagen", nameEnglish: "Good Friday" },
            { month: easter.month, day: easter.day, bankHoliday: true, nameNative: "Påskdagen", nameEnglish: "Easter Sunday" },
            { month: easter.month, day: easter.day + 1, bankHoliday: true, nameNative: "Annandag påsk", nameEnglish: "Easter Monday" },
            { month: 4, day: 1, bankHoliday: true, nameNative: "Första maj", nameEnglish: "May Day" },
            { month: 5, day: 6, bankHoliday: true, nameNative: "Sveriges nationaldag", nameEnglish: "National Day of Sweden" },
            { month: 5, day: 23, bankHoliday: true, nameNative: "Midsommarafton", nameEnglish: "Midsummer's Eve" },
            { month: 5, day: 24, bankHoliday: true, nameNative: "Midsommardagen", nameEnglish: "Midsummer's Day" },
            { month: 10, day: 1, bankHoliday: true, nameNative: "Alla helgons dag", nameEnglish: "All Saints' Day" },
            { month: 11, day: 24, bankHoliday: true, nameNative: "Julafton", nameEnglish: "Christmas Eve" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Juldagen", nameEnglish: "Christmas Day" },
            { month: 11, day: 26, bankHoliday: true, nameNative: "Annandag jul", nameEnglish: "Boxing Day" },
            { month: 11, day: 31, bankHoliday: false, nameNative: "Nyårsafton", nameEnglish: "New Year's Eve" }
        ]
    },
    "NO": {
        nameNative: "Norge",
        nameEnglish: "Norway",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Nyttårsdag", nameEnglish: "New Year's Day" },
            { month: 4, day: 17, bankHoliday: true, nameNative: "Grunnlovsdagen", nameEnglish: "Constitution Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Første juledag", nameEnglish: "Christmas Day" }
        ]
    },
    "DK": {
        nameNative: "Danmark",
        nameEnglish: "Denmark",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Nytårsdag", nameEnglish: "New Year's Day" },
            { month: 5, day: 5, bankHoliday: true, nameNative: "Grundlovsdag", nameEnglish: "Constitution Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Juledag", nameEnglish: "Christmas Day" }
        ]
    },
    "FI": {
        nameNative: "Suomi",
        nameEnglish: "Finland",
        holidays: [
            { month: 0, day: 1, bankHoliday: true, nameNative: "Uudenvuodenpäivä", nameEnglish: "New Year's Day" },
            { month: 11, day: 6, bankHoliday: true, nameNative: "Itsenäisyyspäivä", nameEnglish: "Independence Day" },
            { month: 11, day: 25, bankHoliday: true, nameNative: "Joulupäivä", nameEnglish: "Christmas Day" }
        ]
    }
    // Add more countries here as needed
};

function getHolidays(country, useNativeNames = true) {
    if (!holidaysByCountry[country]) return [];
    var holidays = holidaysByCountry[country].holidays.map(holiday => ({
        month: holiday.month,
        day: holiday.day,
        bankHoliday: holiday.bankHoliday,
        name: useNativeNames ? holiday.nameNative : holiday.nameEnglish
    }));
    // console.log(holidays);
    return holidays;
}