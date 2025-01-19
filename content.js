// Listen for messages from the background or popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "convert") {
        let holdings = parsePortfolio();
        // Send the parsed data back as a response
        let json = JSON.stringify(holdings);
        sendResponse({ holdings: json });
    }
});

// Function to parse the portfolio table
function parsePortfolio() {
    // Use jQuery to select the table element
    const $table = $("#holdings_table");
    if (!$table.length) {
        console.error("Holdings table not found");
        return [];
    }

    // Select all rows inside the tbody of the table
    const rows = $table.find("tbody tr").toArray();

    // Map rows to JSON objects
    const jsonArray = rows.map(row => {
        const $row = $(row); // Wrap row in jQuery

        debugger
        const jsonRow = {
            symbol: $row.find(".symbol").text().trim() || null,

            family: $row.find(".family-split").map((_, family) => {
                const $family = $(family);
                return {
                    clientId: $family.find(".family-clientid").text().trim() || null,
                    value: $family.find("strong").text().trim() || null
                };
            }).get(), // Convert jQuery object to array
            
            quantity:  convertIfNumeric($row.find("td").eq(1).text()) || null,
            buyPrice:  convertIfNumeric($row.find("td").eq(2).text()) ||  null,
            buyValue:  convertIfNumeric($row.find("td").eq(3).text()) || null,
            currentPrice:  convertIfNumeric($row.find("td").eq(4).text()) || null,
            presentValue:  convertIfNumeric($row.find("td").eq(5).text()) || null,
            profitLoss:  convertIfNumeric($row.find("td").eq(6).text()) || null,
            profitLossPercentage:  convertIfNumeric($row.find("td").eq(7).text().trim().replace('%', '')) || null
        };

        return jsonRow;
    });

    return jsonArray;
}

// Utility function to check if a value is numeric and convert it
function convertIfNumeric(value) {
    value = value.trim().replace(/,/g, ''); // Remove any commas for currency values
    if ($.isNumeric(value)) {
        // Check if the value is an integer or a float
        return (value.indexOf('.') === -1) ? parseInt(value, 10) : parseFloat(value);
    }
    return null;  // Return null if not numeric
}