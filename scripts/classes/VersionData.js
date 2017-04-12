/**
 * Class for version.
 *
 * @param {number} major
 * @param {number} minor
 * @param {number} sub
 * @param {string} mod
 */
function VersionData(major,minor,sub,mod) {
	this.major = major;
	this.minor = minor;
	this.sub = sub;
	this.mod = mod;
}

/**
 * Returns number representation of number.
 * @return {number}
 */
VersionData.prototype.toNumber = function() {
  return this.major*1000 + this.minor + this.sub/1000;
};

/**
 * Returns string of version.
 * @return {string}
 */
VersionData.prototype.toString = function() {
  return String(this.major) + "."
    + String(this.minor) + "." + String(this.sub) + String(this.mod);
};
