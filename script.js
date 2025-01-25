// Initialize Supabase client
const supabasePublic = supabase.createClient(
    "https://shomchwfnlxbpnfkyyta.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNob21jaHdmbmx4YnBuZmt5eXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MzAzNzcsImV4cCI6MjA1MzQwNjM3N30.B5uKJqnGu-dgCJNMDDPiMvh1g8cuVHrpJgWlAM-u3s4",
    { db: { schema: "storage" } }
);

var fileText = document.querySelector(".fileText");
var fileItem;
var fileName;

function getFile(e) {
    fileItem = e.target.files[0];
    fileName = fileItem.name;
    fileText.innerHTML = fileName;
}

document.getElementById('uploadBtn').addEventListener('click', async function() {
    if (!fileItem) {
        alert('Please select an image file first.');
        return;
    }

    try {
        console.log('Uploading file:', fileName);
        const { data, error } = await supabasePublic.storage
            .from('images')
            .upload(`public/${fileName}`, fileItem, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        console.log('Upload successful:', data);

        const { data: publicURLData, error: urlError } = supabasePublic.storage
            .from('images')
            .getPublicUrl(`public/${fileName}`);

        if (urlError) {
            throw urlError;
        }

        const publicURL = publicURLData.publicURL;
        console.log('File available at', publicURL);
        

        // Add the uploaded image to the gallery
        addImageToGallery(publicURL);
    } catch (error) {
        console.error('Error uploading file:', error.message);
    }
});

// Function to add an image to the gallery
function addImageToGallery(url) {
    const imgContainer = document.querySelector('.images-container');
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Shared Image';
    link.appendChild(img);
    imgContainer.appendChild(link);
}

// Function to load all images from the Supabase storage
async function loadGallery() {
    try {
        const { data, error } = await supabasePublic.storage
            .from('images')
            .list('public', {
                limit: 100, // Adjust the limit as needed
                offset: 0,
                sortBy: { column: 'name', order: 'asc' }
            });

        if (error) {
            throw error;
        }

        console.log('Files in storage:', data);

        for (const file of data) {
            console.log('Processing file:', file.name);
            const publicURL = `https://shomchwfnlxbpnfkyyta.supabase.co/storage/v1/object/public/images/public/${file.name}`;
            console.log('Public URL:', publicURL);
            addImageToGallery(publicURL);
        }
    } catch (error) {
        console.error('Error loading gallery:', error.message);
    }
}

// Load the gallery when the page loads
document.addEventListener('DOMContentLoaded', loadGallery);

