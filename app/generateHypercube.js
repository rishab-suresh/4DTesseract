export function generateHypercubeVertices(dimensions) {
    if (dimensions === 0){
        return [[]];
    }

    const lowerDimensionVertices = generateHypercubeVertices(dimensions -1 );
    const newVertices = [];
    for (const vertex of lowerDimensionVertices){
        newVertices.push([...vertex,-1]);
        newVertices.push([...vertex,1]);
    }
    return newVertices;
}