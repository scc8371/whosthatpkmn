function colorDist(rgb1, rgb2) {
    // Function to calculate distance between two colors
    const rDiff = parseInt(rgb1.substring(1, 3), 16) - parseInt(rgb2.substring(1, 3), 16);
    const gDiff = parseInt(rgb1.substring(3, 5), 16) - parseInt(rgb2.substring(3, 5), 16);
    const bDiff = parseInt(rgb1.substring(5, 7), 16) - parseInt(rgb2.substring(5, 7), 16);

    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

export { colorDist };
