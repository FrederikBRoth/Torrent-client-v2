function findQualityObject(objectArray, qualityandtypeString){
    let splitArray = qualityandtypeString.split(" ")
    let qualityTypeObject = {quality: splitArray[0], type: splitArray[1]}
    let matchedObject = objectArray.find(element => (element.quality == qualityTypeObject.quality && element.type == qualityTypeObject.type))
    return matchedObject
}

module.exports.findQualityObject = findQualityObject