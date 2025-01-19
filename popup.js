$(document).ready(() => {
    // Button listener
    const $convertBtn = $("#convertBtn");
    if ($convertBtn.length) {
        $convertBtn.on("click", () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "convert" }, (response) => {
                    const $jsonElement = $("#jsonOutput");
                    
                    let json = JSON.parse(response.holdings);

                    if ($jsonElement.length) {
                        $jsonElement.text(response.holdings);
                    }

                    const $csvElement = $("#csvOutput");
                    if ($csvElement.length) {
                        let csv = convertJsonToCsv(json);
                        $csvElement.text(csv);
                    }
                });
            });
        });
    } else {
        console.error("Button with ID 'convertBtn' not found!");
    }

    function convertJsonToCsv(data) {
        let delimiter = "#"
        const headers = [
            "symbol",
            "quantity",
            "buyPrice",
            "buyValue",
            "currentPrice",
            "presentValue",
            "profitLoss",
            "profitLossPercentage",
            "clientIdDetails"
        ];
        const rows = data.map((item) => {
            const clientDetails = item.family.map(f => `${f.clientId}:${f.value}`).join("|");
            let row = [
                item.symbol,
                item.quantity,
                item.buyPrice,
                item.buyValue,
                item.currentPrice,
                item.presentValue,
                item.profitLoss,
                item.profitLossPercentage,
                clientDetails
            ].join(delimiter);

            return row;
        });

        // Combine headers and rows
        return [headers.join(delimiter), ...rows].join("\n");
    }
});
