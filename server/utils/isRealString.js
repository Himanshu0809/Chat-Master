//this is made to check the username and room name are not only spaces
let isRealString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

module.exports={isRealString};