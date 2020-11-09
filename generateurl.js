
function randomAlphanumeric() {	
    var str = '',
    possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    numberOfLetters = 6;
    for (var i = 0; i < numberOfLetters; i++) {
        str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return str;
}
module.exports =randomAlphanumeric ;