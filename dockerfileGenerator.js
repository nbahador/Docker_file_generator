// dockerfileGenerator.js

document.getElementById('generateButton').addEventListener('click', () => {
    const imageName = document.getElementById("imageName").value; // Get the Docker image name
    const imageTag = document.getElementById("imageTag").value; // Get the Docker image tag

    // Check if both fields are filled
    if (!imageName || !imageTag) {
        document.getElementById('dockerfileOutput').textContent = 'Please enter both Docker image name and tag.';
        return;
    }

    // Generate the Dockerfile content
    const dockerfileContent = `
FROM ${imageName}:${imageTag}

# install the code
RUN mkdir -p /opt/fwdti
COPY ./fit_fw* /opt/fwdti/
RUN chmod -R 775 /opt/fwdti

# set run command to call the script
ENTRYPOINT ["/opt/fwdti/fit_fw_scilpy.sh"]
    `;

    // Output the Dockerfile content to the page
    document.getElementById('dockerfileOutput').textContent = dockerfileContent;
});
