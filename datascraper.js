const { chromium } = require('playwright'); // Use Playwright's chromium
const mongoose = require('mongoose');
const Reservation = require('./models/reservation'); // Ensure this path matches your actual model file
const moment = require('moment');

// Define a custom locale for Suriname. Adjust as necessary for local conventions.
moment.defineLocale('sr', {
  months: 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
  monthsShort: 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_'),
  weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
  weekdaysShort: 'zo_ma_di_wo_do_vr_za'.split('_'),
  weekdaysMin: 'zo_ma_di_wo_do_vr_za'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY LT',
    LLLL: 'dddd D MMMM YYYY LT'
  },
  calendar: {
    sameDay: '[Vandaag om] LT',
    nextDay: '[Morgen om] LT',
    nextWeek: 'dddd [om] LT',
    lastDay: '[Gisteren om] LT',
    lastWeek: '[afgelopen] dddd [om] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'over %s',
    past: '%s geleden',
    s: 'een paar seconden',
    m: 'één minuut',
    mm: '%d minuten',
    h: 'één uur',
    hh: '%d uur',
    d: 'één dag',
    dd: '%d dagen',
    M: 'één maand',
    MM: '%d maanden',
    y: 'één jaar',
    yy: '%d jaar'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4  // The week that contains Jan 4th is the first week of the year.
  }
});

// Use environment variables for sensitive data
const dbUrl = 'mongodb://Mustafa:00313Anamoe2903!Acepass123!@localhost:20313/AceLoungeDatabase';
const userLogin = process.env.USER_LOGIN;
const userPass = process.env.USER_PASS;

async function scrapeData() {
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    const context = await browser.newContext(); // Create a new browser context
    const page = await context.newPage(); // Open a new page
    await page.setViewportSize({ width: 800, height: 600 });

    try {
        await page.goto('https://aceparamaribo.com/wp-admin/admin.php?page=rtb-bookings');
        await page.fill('#user_login', userLogin); // Use fill() instead of type()
        await page.fill('#user_pass', userPass);
        await page.click('#wp-submit');

        await page.waitForNavigation(); // Wait for page to navigate to the dashboard

        const data = await page.evaluate(() => {
            const rows = document.querySelectorAll('#the-list > tr');
            return Array.from(rows, row => {
                const date = row.querySelector('.date').innerText.trim();
                const id = row.querySelector('.id').innerText.trim();
                const party = row.querySelector('.party').innerText.trim();
                const name = row.querySelector('.name').innerText.trim();
                const email = row.querySelector('.email').innerText.trim();
                const phone = row.querySelector('.phone').innerText.trim();
                const status = row.querySelector('.status').innerText.trim();
                const submittedBy = row.querySelector('.submitted-by').innerText.trim();

                return { date, id, party, name, email, phone, status, submittedBy };
            });
        });

        console.log(data); // Output scraped data to console
        return data;
    } catch (error) {
        console.error('Scraping error:', error);
        return []; // Return an empty array in case of error
    } finally {
        await page.close();
        await context.close(); // Close the browser context
        await browser.close();
    }
}

async function insertDataIntoDb(data) {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    for (const item of data) {
        // Set the locale to Suriname's custom locale
        moment.locale('sr');
        const dateTimeFormat = 'D MMMM YYYY HH:mm';
        const formattedDateTime = moment(item.date.split('\n')[0], dateTimeFormat).toDate();

        if (!formattedDateTime || formattedDateTime.toString() === 'Invalid Date') {
            console.error('Invalid date for item:', item);
            continue; // Skip this item
        }

        const numGuests = parseInt(item.party, 10) || 1;
        const notes = `Email: ${item.email.split('\n')[0]}, Status: ${item.status}, Submitted By: ${item.submittedBy}`;

        const formattedItem = {
            name: item.name,
            phone: item.phone,
            dateTime: formattedDateTime,
            numGuests: numGuests,
            notes: notes
        };

        const existingReservation = await Reservation.findOne({
            name: formattedItem.name,
            dateTime: formattedItem.dateTime
        });

        if (existingReservation) {
            console.log('Reservation already exists:', existingReservation);
            continue;
        }

        try {
            const newReservation = new Reservation(formattedItem);
            await newReservation.save();
            console.log('New reservation saved:', newReservation);
        } catch (error) {
            console.error('Failed to save reservation:', error, 'Data:', formattedItem);
        }
    }

    await mongoose.disconnect();
    console.log('Data inserted into database successfully.');
}

async function scrapeAndInsert() {
    try {
        const scrapedData = await scrapeData();
        if (scrapedData.length > 0) {
            await insertDataIntoDb(scrapedData);
            console.log('Data scraping and insertion completed successfully.');
        } else {
            console.log('No data scraped to insert into the database.');
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

function continuouslyScrapeAndInsert() {
    scrapeAndInsert().then(() => {
        console.log('Waiting for next run...');
        // Adjust the delay as needed to balance between up-to-dateness and server load
        setTimeout(continuouslyScrapeAndInsert, 1000 * 60 * 2); // Example: 1 hour
    }).catch(error => {
        console.error('An error occurred in continuouslyScrapeAndInsert:', error);
        // In case of error, retry after a delay to ensure the service continues to run
        setTimeout(continuouslyScrapeAndInsert, 1000 * 60 * 10); // Retry after 10 minutes
    });
}

// Start the continuous scraping and insertion process
continuouslyScrapeAndInsert();