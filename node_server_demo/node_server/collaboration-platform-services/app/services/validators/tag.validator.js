var tagValidator = {
    /**
     * validate the tag
     */
    validateTag: validateTag
};

/**
 * tag should not contain any special characters/whitespaces.
 */
function validateTag(tag) {
    var isTagValid = false;
    var pattern = /^[a-zA-Z0-9+-.#]*$/;
    if (pattern.test(tag)) {
        isTagValid = true;
    }
    return isTagValid;
}

module.exports = tagValidator;