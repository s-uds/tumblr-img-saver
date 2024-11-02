const ICON_HREF ='#managed-icon__like-empty';

function getHighestResolutionImage(srcset) {
    const srcsetArray = srcset.split(',').map(item => {
        let [url, size] = item.trim().split(' ');
        return { url: url, width: parseInt(size.replace('w', ''), 10) };
    });

    return (srcsetArray.sort((a, b) => b.width - a.width))[0].url;
}

function isLikeButton(target) {
    if (target.tagName === 'svg') {
        return target.querySelector('use')?.getAttribute('href') === ICON_HREF;
    } else if (target.tagName === 'use') {
        return target.getAttribute('href') === ICON_HREF;
    }

    return false;
}

function findNearbyElement(x, y, radius = 10) {
    let element = document.elementFromPoint(x, y);

    if (!element) {
        // If no element was found at the point, search in a small radius
        const offsets = [
            [0, 0], [radius, 0], [-radius, 0], [0, radius], [0, -radius], // Cardinal points
            [radius, radius], [-radius, radius], [radius, -radius], [-radius, -radius] // Diagonals
        ];

        for (let [dx, dy] of offsets) {
            element = document.elementFromPoint(x + dx, y + dy);
            if (element) break; // Stop when the first element is found
        }
    }

    return element;
}

document.body.addEventListener('click', function (event) {
    if (!isLikeButton(event.target)) {
        return;
    }

    // The article element isn't available in the event target
    const parentArticle = findNearbyElement(event.clientX, event.clientY)?.closest('article');

    if (!parentArticle) {
        return;
    }

    parentArticle.querySelectorAll('img').forEach((img) => {
        // avatars images
        if (img.alt) return;

        const imgURL = getHighestResolutionImage(img.srcset);

        if (!imgURL) {
            console.warn('High resolution image not found!');
            return;
        }

        // Use the image hash
        const filename = imgURL.split('/')[6];

        chrome.runtime.sendMessage({ action: "downloadImage", url: imgURL, filename });
    })
});
