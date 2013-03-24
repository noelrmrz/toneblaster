const BUFFER_SIZE = 4096;
function Question (context) {
  this.node = context.createJavaScriptNode(BUFFER_SIZE, 1, 2);
  Waveform.apply(this, [context, this.node]);
  this.buffer0 = [];
  this.buffer1 = [];
  this.fillBuffer();
  this.dirty = true;
  this.node.onaudioprocess = this.custom.bind(this); //this.process.bind(this);
}

Question.prototype = Object.create(Waveform.prototype);

Question.prototype.constructor = Question;

Question.prototype.fillBuffer = function() {
  for (var i = 0; i < BUFFER_SIZE; i++) {
    this.buffer0[i] = ((Math.random() * 2) - 1);
    this.buffer1[i] = ((Math.random() * 2) - 1);
  }
};

Question.prototype.process = function(event) {
  if (this.dirty) {
    this.fillBuffer();
    var channel0 = event.outputBuffer.getChannelData(0);
    var channel1 = event.outputBuffer.getChannelData(1);
    var i = channel0.length;
    var j = 0;
    var k = 0;
    while (--i) {
      channel0[++j] = this.buffer0[++k];
      channel1[++j] = this.buffer1[++k];
    }
  } 
  //this.dirty = false;
};

Question.prototype.custom = function(event) {
  if (this.dirty) {
    this.fillBuffer();
    var channel0 = event.outputBuffer.getChannelData(0);
    var channel1 = event.outputBuffer.getChannelData(1);
    var i = channel0.length;
    var j = 0;
    var k = 0;
    while (--i) {
      channel0[++j] = Math.tan(i * 0.2 * 2 * Math.pi);
      channel1[++j] = Math.tan(i * 0.2 * 2 * Math.pi);
    }
  } 
  this.dirty = false;
};

Question.prototype.swap = function (process) {
  this.onaudioprocess = process;
}

Question.stopwatch = function (context) {
  var noise = new Question(context);
  var event = {};
  event.outputBuffer = {
    channelData0 : new Array(BUFFER_SIZE),
    channelData1 : new Array(BUFFER_SIZE),
    getChannelData : function (channel) {
        return this["channelData" + channel];
    }
  };
  var sum = 0;
  var count = 0;
  var start = context.currentTime;
  for (var i = 0; i < 10; i++) {
    noise.process(event);
    count++;
  }
  var end = context.currentTime;
  sum = (end - start) / 1000;
  console.log("Count is: " + count + "\nSum is: " + sum + "\nAverage is: " + (sum / count));
}
