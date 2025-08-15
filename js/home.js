// This code will run after the HTML document has been fully loaded
document.addEventListener('DOMContentLoaded', () => {

    const backgroundImages = [
        'assets/bg1.jpg',
        'assets/bg2.jpg',
        'assets/bg3.jpg',
        'assets/bg4.jpg',
        'assets/bg5.jpg',
        'assets/bg6.jpg',
        'assets/bg7.jpg',
        'assets/bg8.jpg',
    ];

    const changeBgButton = document.getElementById('change-bg-btn');
    const mainElement = document.querySelector('body.home-page main');

    let currentImageIndex = 0;

    changeBgButton.addEventListener('click', () => {
        currentImageIndex++;

        if (currentImageIndex >= backgroundImages.length) {
            currentImageIndex = 0;
        }

        const newImageUrl = backgroundImages[currentImageIndex];

        mainElement.style.backgroundImage = `url('${newImageUrl}')`;
    });
});