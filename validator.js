// function isInvalidEmail(payload) {
//     return !payload.email.includes("@")
// } >>>>> or write this way:
function isInvalidEmail(userObject) {
    return !userObject.email.includes("@")
}

// or we can express this way the above function and export it:
// export.isInvalidEmail = (userObject) => {
//     return !userObject.email.include("@")
// }

function isEmptyPayload(userObject) {
    return Object.keys(userObject).length === 0
}

module.exports = {
    isInvalidEmail,
    isEmptyPayload
}
