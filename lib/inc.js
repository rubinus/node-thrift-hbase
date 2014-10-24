/**
 * Created by rubinus on 14-10-22.
 */

"use strict";

function Inc(row) {
    if (!(this instanceof Inc)) {
        return new Inc(row);
    }
    this.row = row;
    this.familyList = [];
}

Inc.prototype.add = function (family, qualifier) {
    var familyMap = {};
    familyMap.family = family;
    familyMap.qualifier = qualifier;
    this.familyList.push(familyMap);
    return this;
};



module.exports = Inc;