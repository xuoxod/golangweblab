package constants

import "time"

var SecretKey []byte = []byte("JELsI,bRyEgIKlRU%")

// Date
var strLongDateOnly = "January 2, 2006"
var strShortDateOnly = "Jan 2, 2006"
var numLongDateOnly = "01/02/2006"
var numShortDateOnly = "1/2/06"

var StrLongDateOnly = time.Now().Format(strLongDateOnly)
var StrShortDateOnly = time.Now().Format(strShortDateOnly)
var NumLongNumberDateOnly = time.Now().Format(numLongDateOnly)
var NumShortNumberDateOnly = time.Now().Format(numShortDateOnly)

// Time
var numNormalTime = "3:04pm"
var numNormalTimeFull = "3:04:05pm"
var numMilitaryTime = "15:04"
var numMilitaryTimeFull = "15:04:05"

var NumNormalTime = time.Now().Format(numNormalTime)
var NumNormalTimeFull = time.Now().Format(numNormalTimeFull)
var NumMilitaryTime = time.Now().Format(numMilitaryTime)
var NumMilitaryTimeFull = time.Now().Format(numMilitaryTimeFull)

// Date and Time
var strLongDateNormalTime = "January 2, 2006,3:04pm"
var strLongDateNormalTimeFull = "January 2, 2006,3:04:05pm"
var strShortDateNormalTime = "Jan 2,2006,3:04pm"
var strShortDateNormalTimeFull = "Jan 2,2006,3:04:05pm"
var strLongDateMilitaryTime = "January 2, 2006,15:04"
var strLongDateMilitaryTimeFull = "January 2, 2006,15:04:05"
var numLongDateNormalTime = "01/02/2006,3:04pm"
var numLongDateNormalTimeFull = "01/02/2006,3:04:05pm"

var StrLongDateNormalTime = time.Now().Format(strLongDateNormalTime)
var StrShortDateNormalTime = time.Now().Format(strShortDateNormalTime)
var StrLongDateNormalTimeFull = time.Now().Format(strLongDateNormalTimeFull)
var StrShortDateNormalTimeFull = time.Now().Format(strShortDateNormalTimeFull)
var StrLongDateMilitaryTime = time.Now().Format(strLongDateMilitaryTime)
var StrLongDateMilitaryTimeFull = time.Now().Format(strLongDateMilitaryTimeFull)
var NumLongDateNormalTime = time.Now().Format(numLongDateNormalTime)
var NumLongDateNormalTimeFull = time.Now().Format(numLongDateNormalTimeFull)
