document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const linkInput = document.getElementById("linkInput");
    const fileInput = document.getElementById("fileInput");
    const urlInput = document.getElementById("urlInput");
    const summaryDiv = document.getElementById("summary");
    const summarizeButton = document.getElementById("summarizeButton");

    // Update placeholder with the filename when a file is attached
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            linkInput.value = file.name; // Show file name in the text input
        } else {
            linkInput.value = ""; // Clear if no file is selected
        }
    });

    // Summarize Button Handler
    summarizeButton.addEventListener("click", async () => {
        summaryDiv.innerText = "Processing..."; // Display loading text

        if (textInput.value.trim()) {
            await summarizeText(textInput.value);
        } else if (fileInput.files[0]) {
            await summarizePDF(fileInput.files[0]);
        } else if (urlInput.value.trim()) {
            await summarizeURL(urlInput.value);
        } else {
            summaryDiv.innerText = "Please provide text, upload a file, or enter a URL.";
        }
    });

    // Function to handle text summarization
    async function summarizeText(text) {
        try {
            const response = await fetch("http://localhost:5001/summarize-text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            summaryDiv.innerText = data.summary || data.error;
        } catch (error) {
            summaryDiv.innerText = `Error: ${error.message}`;
        }
    }

    // Function to handle PDF summarization
    async function summarizePDF(file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5001/summarize-pdf", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            summaryDiv.innerText = data.summary || data.error;
        } catch (error) {
            summaryDiv.innerText = `Error: ${error.message}`;
        }
    }

    // Function to handle URL summarization
    async function summarizeURL(url) {
        try {
            const response = await fetch("http://localhost:5001/summarize-website", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            summaryDiv.innerText = data.summary || data.error;
        } catch (error) {
            summaryDiv.innerText = `Error: ${error.message}`;
        }
    }
});
