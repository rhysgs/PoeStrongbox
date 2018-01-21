
function Start() {
  if (this.pending < 0) {
    return false;
  }
  this.pending ++;
  return true;
}

function Finish() {
  if (this.pending < 0) {
    return false;
  }
  this.pending--;
  if (this.pending > 0) {
    return false;
  }
  this.pending = -1;
  if (this.onFinish) {
    this.onFinish();
  }
  return true;
}

function Abort(error) {
  if (this.pending < 0) {
    return false;
  }
  this.pending = -1;
  if (this.onAbort) {
    this.onAbort(error);
  }
  return true;
}

/**
 * 
 * @param {function()} onFinish 
 * @param {function(Object)} onAbort 
 */
function RunOnLast(onFinish, onAbort) {
  this.pending = 0;
  this.onFinish = typeof onFinish === 'function' ? onFinish : null;
  this.onAbort = typeof onAbort === 'function' ? onAbort : null;
}

RunOnLast.prototype.Start = Start;
RunOnLast.prototype.Finish = Finish;
RunOnLast.prototype.Abort = Abort;

module.exports = RunOnLast;