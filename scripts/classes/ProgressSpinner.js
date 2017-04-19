/* @flow */
'use strict';

/** @namespace */
var CivClicker = CivClicker || {};

/**
 * @param {string} loaderSpanId ID of loader span.
 * @param {string} type Type of object, like "building" or "upgrade".
 * @property {timeLeft} number Time left on building.
 * @property {boolean} removeCheck Whether or not to remove the check mark this tick.
 * @property {string} loaderSpanId ID of span to put the spinner.
 * @property {string} type Type of object.
 * @property {string|undefined} subType Subtype of object, like 'conquest' or 'deity'.
 * @class
 */
CivClicker.ProgressSpinner = function(loaderSpanId, type, subType) {
  this.timeLeft = 0;
  this.removeCheck = false;
  this.loaderSpanId = loaderSpanId;
  this.type = type;
  this.subType = subType || undefined;
};

/**
 * This method will be bound to global.doPurchase.success event.
 * @param {object} info
 * @return
 */
CivClicker.ProgressSpinner.prototype.onPurchaseSuccess = function(info) {

  if (info.purchaseObj.type == this.type) {
    // Subtype has to be either undefined or equal defined subtype.
    // NB: Subtype is used for upgrade subtypes like deity, conquest, etc.
    if (info.purchaseObj.subType === undefined ||
        info.purchaseObj.subType == this.subType) {

      // Always pick the highest time left.
      if (info.progressTime > this.timeLeft) {
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
  if (this.timeLeft > 0) {
    this.timeLeft -= 1000;
  }

  if (this.removeCheck) {
    this.removeCheck = false;
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
