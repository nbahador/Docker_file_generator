// dockerfileGenerator.js

async function fetchDockerImageDetails(imageKeyword) {
    const url = `https://hub.docker.com/v2/repositories/library/${imageKeyword}/tags/`;
    
    try {
        // Add a debug message before making the request
        document.getElementById('debugOutput').textContent = `Fetching data for: ${imageKeyword}`;

        const response = await fetch(url);
        
        // Check if the response is valid
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data from Docker Hub:', data); // Debug log for fetched data

        if (data.results && data.results.length > 0) {
            const latestTag = data.results[0].name;  // Get the latest tag
            return { imageName: imageKeyword, tag: latestTag };
        } else {
            throw new Error('No tags found for the given image keyword.');
        }
    } catch (error) {
        console.error('Error fetching Docker image details:', error);
        document.getElementById('debugOutput').textContent = `Error: ${error.message}`; // Display error in debug output
        return null;
    }
}

// Event listener for button click
document.getElementById('generateButton').addEventListener('click', async () => {
    const imageKeyword = document.getElementById("imageKeyword").value; // Get the input value
    
    if (!imageKeyword) {
        document.getElementById('dockerfileOutput').textContent = 'Please enter a Docker image keyword.';
        return;
    }

    // Clear previous debug and output
    document.getElementById('dockerfileOutput').textContent = '';
    document.getElementById('debugOutput').textContent = 'Processing...';

    const imageDetails = await fetchDockerImageDetails(imageKeyword);
    
    if (imageDetails) {
        const { imageName, tag } = imageDetails;
        
        // Generate the Dockerfile with the retrieved image name and tag
        const dockerfileContent = `
FROM ${imageName}/${imageName}:${tag}

# install the code
RUN mkdir -p /opt/fwdti
COPY ./fit_fw* /opt/fwdti/
RUN chmod -R 775 /opt/fwdti

# set run command to call the script
ENTRYPOINT ["/opt/fwdti/fit_fw_scilpy.sh"]
        `;
        
        // Output the Dockerfile content to an element in the HTML
        document.getElementById('dockerfileOutput').textContent = dockerfileContent;
    } else {
        document.getElementById('dockerfileOutput').textContent = 'Error: Unable to fetch image details.';
    }
});
