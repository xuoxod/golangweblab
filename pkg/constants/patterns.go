package constants

const PatternAlphaChars string = `^[a-zA-Z]+$`
const PatternAlphaAndSpaceChars string = `(^[a-z ]+$)`
const PatternNumbers string = `(^[\d]+$)`
const PatternNumbersAndOrDecimals string = `^([\d]+|[\d]+\.[\d]+)$`
const PatternAlphaNumeric string = `(^[0-9a-zA-Z]+$)`
const PatternNonAlphaNumeric string = `(^[^0-9a-zA-Z]+$)`
const PatternAdultAge string = `(^[2-9][0-9]{1}|(18|19)$)`
const PatternEmail string = `^[a-zA-Z0-9\-]+(\.[a-zA-Z0-9]+)?@[a-z]+\.[a-z]{2,3}$`
const PatternPhoneNumber string = `^(^[2-9]{1}[0-9]{2}[0-9]{7}|^[2-9]{1}[0-9]{2}\-[2-9]{1}[0-9]{2}\-[0-9]{4})$`
