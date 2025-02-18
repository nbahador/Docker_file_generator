// dockerfileGenerator.js

async function fetchDockerImageDetails(imageKeyword) {
    const url = `https://hub.docker.com/v2/repositories/library/${imageKeyword}/tags/`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const latestTag = data.results[0].name;  // Get the latest tag (you can modify logic if needed)
            return { imageName: imageKeyword, tag: latestTag };
        } else {
            throw new Error('No tags found for the given image keyword.');
        }
    } catch (error) {
        console.error('Error fetching Docker image details:', error);
        return null;
    }
}

async function generateDockerfile() {
    const imageKeyword = prompt("Enter the Docker image keyword (e.g., scilus):");
    
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
        
        console.log("Generated
