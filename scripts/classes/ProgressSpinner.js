/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * @param {string} loaderSpanId ID of loader span.
 * @param {string} type Type of object, like "building" or "upgrade".
 * @property {number|String} timeLeft Time left on building, or 'stop' for no action.
 * @property {boolean} removeCheck Whether or not to remove the check mark this tick.
 * @property {string} loaderSpanId ID of span to put the spinner.
 * @property {array} types Types of objects. Deity page has both buildings and upgrades.
 * @property {array} subTypes Subtypes of object, like 'conquest', 'deity', 'altar'.
 * @class
 */
CivClicker.ProgressSpinner = function(loaderSpanId, types, subTypes) {
  this.timeLeft = new String('stop');
  this.removeCheck = false;
  this.loaderSpanId = loaderSpanId;
  this.types = types || [];
  this.subTypes = subTypes || [];
};

/**
 * This method will be bound to global.doPurchase.success event.
 * @param {object} info
 * @return
 */
CivClicker.ProgressSpinner.prototype.onPurchaseSuccess = function(info) {

  if (this.types.indexOf(info.purchaseObj.type) !== -1) {
    // Subtype has to be either undefined or equal defined subtype.
    // NB: Subtype is used for upgrade subtypes like deity, conquest, etc.
    if (info.purchaseObj.subType === undefined ||
        this.subTypes.indexOf(info.purchaseObj.subType) !== -1) {

      // Always pick the highest time left.
      // timeLeft can also be String('stop').
      // NB: 'asd' instanceof String === false
      if (this.timeLeft instanceof String
          || info.progressTime > this.timeLeft) {
        this.timeLeft = info.progressTime;
      }

      if (this.removeCheck) {
        this.removeCheck = false;
        $(this.loaderSpanId).removeClass('fa fa-check');
      }

      $(this.loaderSpanId).show().addClass('fa fa-spinner fa-pulse');
    }
  }
};

/**
 * Bound to global.tick event.
 * When time runs out, add a little check for one second.
 * @return
 */
CivClicker.ProgressSpinner.prototype.onTick = function() {

  if (this.timeLeft == 'stop') {
    return;
  }

  if (this.timeLeft > 0) {
    this.timeLeft -= 1000;
  }

  if (this.removeCheck) {
    this.removeCheck = false;
    this.timeLeft = new String('stop');
    $(this.loaderSpanId).fadeOut('slow', function() {
      $(this.loaderSpanId).removeClass('fa fa-check');
    });
  }

  if (this.timeLeft <= 0) {
    $(this.loaderSpanId)
      .removeClass('fa fa-spinner fa-pulse')
      .addClass('fa fa-check');

    // Remove the check next tick.
    this.removeCheck = true;

    // Never less than 0.
    this.timeLeft = 0;
  }
};
