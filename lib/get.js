/**
 * Created by rubinus on 14-10-22.
 */

"use strict";

function Get(row) {
    if (!(this instanceof Get)) {
        return new Get(row);
    }
    this.row = row;
    this.maxVersions = 1;
    this.familyList = [];
}


Get.prototype.addFamily = function (family) {
    var familyMap = {};
    familyMap.family = family;
    this.familyList.push(familyMap);
    return this;
};

Get.prototype.addColumn = function (family, qualifier) {
    var familyMap = {};
    familyMap.family = family;
    familyMap.qualifier = qualifier;
    this.familyList.push(familyMap);
    return this;
};

Get.prototype.setMaxVersions = function (maxVersions) {
    if (maxVersions <= 0) {
        maxVersions = 1;
    }
    this.maxVersions = maxVersions;
    return this;
};


Get.prototype.getRow = function () {
    return this.row;
};


module.exports = Get;