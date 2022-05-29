const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    async hasher(w) {
        return await bcrypt.hash(w, saltRounds);
    },

    async checker(w, prevw) {
        const res = await bcrypt.compare(w, prevw);
        return res;
    }
}