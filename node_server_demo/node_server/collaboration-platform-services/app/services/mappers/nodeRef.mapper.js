var nodeRefMapper = {
    mapNodeRef: mapNodeRef
}

function mapNodeRef(ref) {
    if (ref != null) {
        var lastIndex = ref.split("/").length - 1;
        return ref.split("/")[lastIndex];
    } else {
        return null;
    }
}

module.exports = nodeRefMapper;
