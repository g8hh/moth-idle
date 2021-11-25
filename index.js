(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"index_atlas_1", frames: [[0,0,188,175]]},
		{name:"index_atlas_2", frames: [[0,0,188,175]]},
		{name:"index_atlas_3", frames: [[0,0,174,160]]},
		{name:"index_atlas_4", frames: [[0,0,174,159]]},
		{name:"index_atlas_5", frames: [[0,0,169,155]]},
		{name:"index_atlas_6", frames: [[0,146,186,87],[0,0,121,144]]},
		{name:"index_atlas_7", frames: [[0,65,191,80],[0,0,243,63]]},
		{name:"index_atlas_8", frames: [[0,0,114,131],[116,0,112,129]]},
		{name:"index_atlas_9", frames: [[0,0,112,129],[0,131,195,65]]},
		{name:"index_atlas_10", frames: [[0,67,96,96],[98,67,95,95],[0,0,195,65]]},
		{name:"index_atlas_11", frames: [[0,0,95,95],[0,97,95,95],[97,0,95,95],[97,97,95,95]]},
		{name:"index_atlas_12", frames: [[0,0,95,95],[0,97,95,95],[97,0,95,95],[97,97,95,95]]},
		{name:"index_atlas_13", frames: [[97,0,91,91],[169,93,79,94],[0,0,95,95],[0,97,167,48],[0,147,167,48],[0,197,167,48]]},
		{name:"index_atlas_14", frames: [[110,185,63,43],[175,185,63,43],[0,185,53,53],[49,90,92,34],[143,120,92,34],[49,126,92,34],[55,185,53,53],[194,0,58,58],[194,60,58,58],[0,87,47,69],[0,0,85,85],[87,0,105,43],[143,156,105,27],[87,45,105,43]]},
		{name:"index_atlas_15", frames: [[130,44,54,38],[0,45,54,38],[186,53,54,38],[0,0,63,43],[0,143,93,8],[130,84,43,38],[0,85,43,38],[65,0,63,42],[45,88,43,38],[130,0,63,42],[227,93,18,37],[65,44,63,42],[195,0,43,51],[90,124,85,17],[175,93,48,28],[177,123,48,28]]}
];


(lib.AnMovieClip = function(){
	this.currentSoundStreamInMovieclip;
	this.actionFrames = [];
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(positionOrLabel);
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		var keys = this.soundStreamDuration.keys();
		for(var i = 0;i<this.soundStreamDuration.size; i++){
			var key = keys.next().value;
			key.instance.stop();
		}
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var keys = this.soundStreamDuration.keys();
			for(var i = 0; i< this.soundStreamDuration.size ; i++){
				var key = keys.next().value; 
				var value = this.soundStreamDuration.get(key);
				if((value.end) == currentFrame){
					key.instance.stop();
					if(this.currentSoundStreamInMovieclip == key) { this.currentSoundStreamInMovieclip = undefined; }
					this.soundStreamDuration.delete(key);
				}
			}
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			if(this.soundStreamDuration.size > 0){
				var keys = this.soundStreamDuration.keys();
				var maxDuration = 0;
				for(var i=0;i<this.soundStreamDuration.size;i++){
					var key = keys.next().value;
					var value = this.soundStreamDuration.get(key);
					if(value.end > maxDuration){
						maxDuration = value.end;
						this.currentSoundStreamInMovieclip = key;
					}
				}
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_66 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_65 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_64 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_63 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_62 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_59 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_61 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_69 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_68 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_60 = function() {
	this.initialize(ss["index_atlas_7"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_67 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_58 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_56 = function() {
	this.initialize(ss["index_atlas_13"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_53 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_54 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(ss["index_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_55 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_50 = function() {
	this.initialize(ss["index_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["index_atlas_13"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["index_atlas_8"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["index_atlas_8"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["index_atlas_7"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["index_atlas_6"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(img.CachedBmp_36);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,266,136);


(lib.CachedBmp_42 = function() {
	this.initialize(ss["index_atlas_9"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["index_atlas_10"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["index_atlas_9"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["index_atlas_10"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["index_atlas_10"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["index_atlas_11"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["index_atlas_11"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["index_atlas_6"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(img.CachedBmp_29);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,416,175);


(lib.CachedBmp_19 = function() {
	this.initialize(ss["index_atlas_11"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_18 = function() {
	this.initialize(ss["index_atlas_11"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["index_atlas_12"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(ss["index_atlas_12"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_17 = function() {
	this.initialize(ss["index_atlas_12"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(img.CachedBmp_28);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,416,175);


(lib.CachedBmp_14 = function() {
	this.initialize(ss["index_atlas_12"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(img.CachedBmp_27);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,416,175);


(lib.CachedBmp_15 = function() {
	this.initialize(ss["index_atlas_13"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_10 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_9 = function() {
	this.initialize(ss["index_atlas_15"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.Растровоеизображение16 = function() {
	this.initialize(img.Растровоеизображение16);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,569,225);


(lib.CachedBmp_6 = function() {
	this.initialize(ss["index_atlas_13"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["index_atlas_13"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["index_atlas_14"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["index_atlas_13"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_11 = function() {
	this.initialize(ss["index_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(ss["index_atlas_5"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_12 = function() {
	this.initialize(ss["index_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(img.CachedBmp_1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1282,139);


(lib.CachedBmp_57 = function() {
	this.initialize(img.CachedBmp_57);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,1417,721);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.yesB = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_62();
	this.instance.setTransform(1.25,0,0.8381,0.8381);

	this.instance_1 = new lib.CachedBmp_61();
	this.instance_1.setTransform(-1.95,-0.85,0.8381,0.8381);

	this.instance_2 = new lib.CachedBmp_64();
	this.instance_2.setTransform(1.25,0,0.8381,0.8381);

	this.instance_3 = new lib.CachedBmp_63();
	this.instance_3.setTransform(-1.95,-0.85,0.8381,0.8381);

	this.instance_4 = new lib.CachedBmp_66();
	this.instance_4.setTransform(1.25,0,0.8381,0.8381);

	this.instance_5 = new lib.CachedBmp_65();
	this.instance_5.setTransform(-1.95,-0.85,0.8381,0.8381);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.9,-0.8,52.8,36);


(lib.tutShow = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_58();
	this.instance.setTransform(-1.45,-1.45,0.6335,0.6335);

	this.instance_1 = new lib.CachedBmp_59();
	this.instance_1.setTransform(-1.45,-1.45,0.6335,0.6335);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.4,-1.4,33.6,33.6);


(lib.tutor = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.text = new cjs.Text("你的飞蛾力量 = 所有这些多重的乘数", "bold 18px 'Arial'");
	this.text.textAlign = "center";
	this.text.lineHeight = 22;
	this.text.lineWidth = 288;
	this.text.parent = this;
	this.text.setTransform(157.7,144.25);

	this.text_1 = new cjs.Text("购买不同的升级来帮助你的飞蛾吸收光线。\n达到更高的等级来解锁声望和重生。", "bold 18px 'Arial'");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 22;
	this.text_1.lineWidth = 298;
	this.text_1.parent = this;
	this.text_1.setTransform(1167.85,426.2);

	this.text_2 = new cjs.Text("这是你的统计数据。 飞蛾和光量", "bold 18px 'Arial'");
	this.text_2.textAlign = "center";
	this.text_2.lineHeight = 22;
	this.text_2.lineWidth = 283;
	this.text_2.parent = this;
	this.text_2.setTransform(1246.95,201.75);

	this.text_3 = new cjs.Text("你的关卡越高，你的飞蛾就越难吸收光线。 有10种不同的颜色。", "bold 18px 'Arial'");
	this.text_3.textAlign = "center";
	this.text_3.lineHeight = 22;
	this.text_3.lineWidth = 308;
	this.text_3.parent = this;
	this.text_3.setTransform(737.85,172.55);

	this.text_4 = new cjs.Text("这是你的田地和飞蛾。 它们吸收灯的光，你也会得到一些乘数", "bold 20px 'Arial'");
	this.text_4.textAlign = "center";
	this.text_4.lineHeight = 24;
	this.text_4.lineWidth = 298;
	this.text_4.parent = this;
	this.text_4.setTransform(456,342.3);

	this.instance = new lib.CachedBmp_57();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text_4},{t:this.text_3},{t:this.text_2},{t:this.text_1},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,1417,721);


(lib.turboB = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.turbo = new cjs.Text("涡轮", "bold 22px 'Arial'");
	this.turbo.name = "turbo";
	this.turbo.textAlign = "center";
	this.turbo.lineHeight = 27;
	this.turbo.lineWidth = 84;
	this.turbo.parent = this;
	this.turbo.setTransform(45.9765,3.65,1.0434,0.9889);

	this.instance = new lib.CachedBmp_67();
	this.instance.setTransform(0.35,-1);

	this.instance_1 = new lib.CachedBmp_68();
	this.instance_1.setTransform(0.35,-1);

	this.instance_2 = new lib.CachedBmp_69();
	this.instance_2.setTransform(0.35,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.turbo}]}).to({state:[{t:this.instance_1},{t:this.turbo}]},1).to({state:[{t:this.instance_2},{t:this.turbo}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-1,92.4,34);


(lib.stageBox = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.tt = new cjs.Text("9999", "bold 25px 'Arial'", "#FFFFFF");
	this.tt.name = "tt";
	this.tt.textAlign = "center";
	this.tt.lineHeight = 30;
	this.tt.lineWidth = 62;
	this.tt.parent = this;
	this.tt.setTransform(49.3,24.65,1.5,1.5);

	this.instance = new lib.CachedBmp_56();
	this.instance.setTransform(2.75,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.tt}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.stageBox, new cjs.Rectangle(0,-1,98.7,91), null);


(lib.speedUP_b = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_54();
	this.instance.setTransform(-28.75,-28.75);

	this.instance_1 = new lib.CachedBmp_55();
	this.instance_1.setTransform(-28.75,-28.75);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-28.7,-28.7,58,58);


(lib.refillHP = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("Ag8iGIB4AAIAAENIh4AAg");
	var mask_graphics_1 = new cjs.Graphics().p("AhAiGICBAAIAAENIiBAAg");
	var mask_graphics_2 = new cjs.Graphics().p("AhFiGICLAAIAAENIiLAAg");
	var mask_graphics_3 = new cjs.Graphics().p("AhKiGICVAAIAAENIiVAAg");
	var mask_graphics_4 = new cjs.Graphics().p("AhOiGICdAAIAAENIidAAg");
	var mask_graphics_5 = new cjs.Graphics().p("AhTiGICnAAIAAENIinAAg");
	var mask_graphics_6 = new cjs.Graphics().p("AhYiGICxAAIAAENIixAAg");
	var mask_graphics_7 = new cjs.Graphics().p("AhciGIC5AAIAAENIi5AAg");
	var mask_graphics_8 = new cjs.Graphics().p("AhhiGIDDAAIAAENIjDAAg");
	var mask_graphics_9 = new cjs.Graphics().p("AhmiGIDNAAIAAENIjNAAg");
	var mask_graphics_10 = new cjs.Graphics().p("AhqiGIDVAAIAAENIjVAAg");
	var mask_graphics_11 = new cjs.Graphics().p("AhviGIDfAAIAAENIjfAAg");
	var mask_graphics_12 = new cjs.Graphics().p("Ah0iGIDpAAIAAENIjpAAg");
	var mask_graphics_13 = new cjs.Graphics().p("Ah4iGIDxAAIAAENIjxAAg");
	var mask_graphics_14 = new cjs.Graphics().p("Ah9iGID7AAIAAENIj7AAg");
	var mask_graphics_15 = new cjs.Graphics().p("AiCiGIEFAAIAAENIkFAAg");
	var mask_graphics_16 = new cjs.Graphics().p("AiHiGIEPAAIAAENIkPAAg");
	var mask_graphics_17 = new cjs.Graphics().p("AiLiGIEXAAIAAENIkXAAg");
	var mask_graphics_18 = new cjs.Graphics().p("AiQiGIEhAAIAAENIkhAAg");
	var mask_graphics_19 = new cjs.Graphics().p("AiViGIErAAIAAENIkrAAg");
	var mask_graphics_20 = new cjs.Graphics().p("AiZiGIEzAAIAAENIkzAAg");
	var mask_graphics_21 = new cjs.Graphics().p("AieiGIE9AAIAAENIk9AAg");
	var mask_graphics_22 = new cjs.Graphics().p("AijiGIFHAAIAAENIlHAAg");
	var mask_graphics_23 = new cjs.Graphics().p("AiniGIFPAAIAAENIlPAAg");
	var mask_graphics_24 = new cjs.Graphics().p("AisiGIFZAAIAAENIlZAAg");
	var mask_graphics_25 = new cjs.Graphics().p("AixiGIFjAAIAAENIljAAg");
	var mask_graphics_26 = new cjs.Graphics().p("Ai1iGIFrAAIAAENIlrAAg");
	var mask_graphics_27 = new cjs.Graphics().p("Ai6iGIF1AAIAAENIl1AAg");
	var mask_graphics_28 = new cjs.Graphics().p("Ai/iGIF/AAIAAENIl/AAg");
	var mask_graphics_29 = new cjs.Graphics().p("AjEiGIGJAAIAAENImJAAg");
	var mask_graphics_30 = new cjs.Graphics().p("AjIiGIGRAAIAAENImRAAg");
	var mask_graphics_31 = new cjs.Graphics().p("AjNiGIGbAAIAAENImbAAg");
	var mask_graphics_32 = new cjs.Graphics().p("AjSiGIGlAAIAAENImlAAg");
	var mask_graphics_33 = new cjs.Graphics().p("AjWiGIGtAAIAAENImtAAg");
	var mask_graphics_34 = new cjs.Graphics().p("AjbiGIG3AAIAAENIm3AAg");
	var mask_graphics_35 = new cjs.Graphics().p("AjgiGIHBAAIAAENInBAAg");
	var mask_graphics_36 = new cjs.Graphics().p("AjkiGIHJAAIAAENInJAAg");
	var mask_graphics_37 = new cjs.Graphics().p("AjpiGIHTAAIAAENInTAAg");
	var mask_graphics_38 = new cjs.Graphics().p("AjuiGIHdAAIAAENIndAAg");
	var mask_graphics_39 = new cjs.Graphics().p("AjyiGIHlAAIAAENInlAAg");
	var mask_graphics_40 = new cjs.Graphics().p("Aj3iGIHvAAIAAENInvAAg");
	var mask_graphics_41 = new cjs.Graphics().p("Aj8iGIH5AAIAAENIn5AAg");
	var mask_graphics_42 = new cjs.Graphics().p("AkBiGIIDAAIAAENIoDAAg");
	var mask_graphics_43 = new cjs.Graphics().p("AkFiGIILAAIAAENIoLAAg");
	var mask_graphics_44 = new cjs.Graphics().p("AkKiGIIVAAIAAENIoVAAg");
	var mask_graphics_45 = new cjs.Graphics().p("AkPiGIIfAAIAAENIofAAg");
	var mask_graphics_46 = new cjs.Graphics().p("AkTiGIInAAIAAENIonAAg");
	var mask_graphics_47 = new cjs.Graphics().p("AkYiGIIxAAIAAENIoxAAg");
	var mask_graphics_48 = new cjs.Graphics().p("AkdiGII7AAIAAENIo7AAg");
	var mask_graphics_49 = new cjs.Graphics().p("AkhiGIJDAAIAAENIpDAAg");
	var mask_graphics_50 = new cjs.Graphics().p("AkmiGIJNAAIAAENIpNAAg");
	var mask_graphics_51 = new cjs.Graphics().p("AkriGIJXAAIAAENIpXAAg");
	var mask_graphics_52 = new cjs.Graphics().p("AkviGIJfAAIAAENIpfAAg");
	var mask_graphics_53 = new cjs.Graphics().p("Ak0iGIJpAAIAAENIppAAg");
	var mask_graphics_54 = new cjs.Graphics().p("Ak5iGIJzAAIAAENIpzAAg");
	var mask_graphics_55 = new cjs.Graphics().p("Ak+iGIJ9AAIAAENIp9AAg");
	var mask_graphics_56 = new cjs.Graphics().p("AlCiGIKFAAIAAENIqFAAg");
	var mask_graphics_57 = new cjs.Graphics().p("AlHiGIKPAAIAAENIqPAAg");
	var mask_graphics_58 = new cjs.Graphics().p("AlMiGIKZAAIAAENIqZAAg");
	var mask_graphics_59 = new cjs.Graphics().p("AlQiGIKhAAIAAENIqhAAg");
	var mask_graphics_60 = new cjs.Graphics().p("AlViGIKrAAIAAENIqrAAg");
	var mask_graphics_61 = new cjs.Graphics().p("AlaiGIK1AAIAAENIq1AAg");
	var mask_graphics_62 = new cjs.Graphics().p("AleiGIK9AAIAAENIq9AAg");
	var mask_graphics_63 = new cjs.Graphics().p("AljiGILHAAIAAENIrHAAg");
	var mask_graphics_64 = new cjs.Graphics().p("AloiGILRAAIAAENIrRAAg");
	var mask_graphics_65 = new cjs.Graphics().p("AlsiGILZAAIAAENIrZAAg");
	var mask_graphics_66 = new cjs.Graphics().p("AlxiGILjAAIAAENIrjAAg");
	var mask_graphics_67 = new cjs.Graphics().p("Al2iGILtAAIAAENIrtAAg");
	var mask_graphics_68 = new cjs.Graphics().p("Al7iGIL3AAIAAENIr3AAg");
	var mask_graphics_69 = new cjs.Graphics().p("Al/iGIL/AAIAAENIr/AAg");
	var mask_graphics_70 = new cjs.Graphics().p("AmEiGIMJAAIAAENIsJAAg");
	var mask_graphics_71 = new cjs.Graphics().p("AmJiGIMTAAIAAENIsTAAg");
	var mask_graphics_72 = new cjs.Graphics().p("AmNiGIMbAAIAAENIsbAAg");
	var mask_graphics_73 = new cjs.Graphics().p("AmSiGIMlAAIAAENIslAAg");
	var mask_graphics_74 = new cjs.Graphics().p("AmXiGIMvAAIAAENIsvAAg");
	var mask_graphics_75 = new cjs.Graphics().p("AmbiGIM3AAIAAENIs3AAg");
	var mask_graphics_76 = new cjs.Graphics().p("AmgiGINBAAIAAENItBAAg");
	var mask_graphics_77 = new cjs.Graphics().p("AmliGINLAAIAAENItLAAg");
	var mask_graphics_78 = new cjs.Graphics().p("AmpiGINTAAIAAENItTAAg");
	var mask_graphics_79 = new cjs.Graphics().p("AmuiGINdAAIAAENItdAAg");
	var mask_graphics_80 = new cjs.Graphics().p("AmziGINnAAIAAENItnAAg");
	var mask_graphics_81 = new cjs.Graphics().p("Am4iGINxAAIAAENItxAAg");
	var mask_graphics_82 = new cjs.Graphics().p("Am8iGIN5AAIAAENIt5AAg");
	var mask_graphics_83 = new cjs.Graphics().p("AnBiGIODAAIAAENIuDAAg");
	var mask_graphics_84 = new cjs.Graphics().p("AnGiGIONAAIAAENIuNAAg");
	var mask_graphics_85 = new cjs.Graphics().p("AnKiGIOVAAIAAENIuVAAg");
	var mask_graphics_86 = new cjs.Graphics().p("AnPiGIOfAAIAAENIufAAg");
	var mask_graphics_87 = new cjs.Graphics().p("AnUiGIOpAAIAAENIupAAg");
	var mask_graphics_88 = new cjs.Graphics().p("AnYiGIOxAAIAAENIuxAAg");
	var mask_graphics_89 = new cjs.Graphics().p("AndiGIO7AAIAAENIu7AAg");
	var mask_graphics_90 = new cjs.Graphics().p("AniiGIPFAAIAAENIvFAAg");
	var mask_graphics_91 = new cjs.Graphics().p("AnmiGIPNAAIAAENIvNAAg");
	var mask_graphics_92 = new cjs.Graphics().p("AnriGIPXAAIAAENIvXAAg");
	var mask_graphics_93 = new cjs.Graphics().p("AnwiGIPhAAIAAENIvhAAg");
	var mask_graphics_94 = new cjs.Graphics().p("An1iGIPrAAIAAENIvrAAg");
	var mask_graphics_95 = new cjs.Graphics().p("An5iGIPzAAIAAENIvzAAg");
	var mask_graphics_96 = new cjs.Graphics().p("An+iGIP9AAIAAENIv9AAg");
	var mask_graphics_97 = new cjs.Graphics().p("AoDiGIQHAAIAAENIwHAAg");
	var mask_graphics_98 = new cjs.Graphics().p("AoHiGIQPAAIAAENIwPAAg");
	var mask_graphics_99 = new cjs.Graphics().p("AoMiGIQZAAIAAENIwZAAg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:-6.0737,y:4.55}).wait(1).to({graphics:mask_graphics_1,x:-5.6303,y:4.55}).wait(1).to({graphics:mask_graphics_2,x:-5.1606,y:4.55}).wait(1).to({graphics:mask_graphics_3,x:-4.6909,y:4.55}).wait(1).to({graphics:mask_graphics_4,x:-4.2212,y:4.55}).wait(1).to({graphics:mask_graphics_5,x:-3.7515,y:4.55}).wait(1).to({graphics:mask_graphics_6,x:-3.2818,y:4.55}).wait(1).to({graphics:mask_graphics_7,x:-2.8121,y:4.55}).wait(1).to({graphics:mask_graphics_8,x:-2.3424,y:4.55}).wait(1).to({graphics:mask_graphics_9,x:-1.8727,y:4.55}).wait(1).to({graphics:mask_graphics_10,x:-1.403,y:4.55}).wait(1).to({graphics:mask_graphics_11,x:-0.9333,y:4.55}).wait(1).to({graphics:mask_graphics_12,x:-0.4636,y:4.55}).wait(1).to({graphics:mask_graphics_13,x:0.0061,y:4.55}).wait(1).to({graphics:mask_graphics_14,x:0.4758,y:4.55}).wait(1).to({graphics:mask_graphics_15,x:0.9455,y:4.55}).wait(1).to({graphics:mask_graphics_16,x:1.4152,y:4.55}).wait(1).to({graphics:mask_graphics_17,x:1.8848,y:4.55}).wait(1).to({graphics:mask_graphics_18,x:2.3545,y:4.55}).wait(1).to({graphics:mask_graphics_19,x:2.8242,y:4.55}).wait(1).to({graphics:mask_graphics_20,x:3.2939,y:4.55}).wait(1).to({graphics:mask_graphics_21,x:3.7636,y:4.55}).wait(1).to({graphics:mask_graphics_22,x:4.2333,y:4.55}).wait(1).to({graphics:mask_graphics_23,x:4.703,y:4.55}).wait(1).to({graphics:mask_graphics_24,x:5.1727,y:4.55}).wait(1).to({graphics:mask_graphics_25,x:5.6424,y:4.55}).wait(1).to({graphics:mask_graphics_26,x:6.1121,y:4.55}).wait(1).to({graphics:mask_graphics_27,x:6.5818,y:4.55}).wait(1).to({graphics:mask_graphics_28,x:7.0515,y:4.55}).wait(1).to({graphics:mask_graphics_29,x:7.5212,y:4.55}).wait(1).to({graphics:mask_graphics_30,x:7.9909,y:4.55}).wait(1).to({graphics:mask_graphics_31,x:8.4606,y:4.55}).wait(1).to({graphics:mask_graphics_32,x:8.9303,y:4.55}).wait(1).to({graphics:mask_graphics_33,x:9.4,y:4.55}).wait(1).to({graphics:mask_graphics_34,x:9.8697,y:4.55}).wait(1).to({graphics:mask_graphics_35,x:10.3394,y:4.55}).wait(1).to({graphics:mask_graphics_36,x:10.8091,y:4.55}).wait(1).to({graphics:mask_graphics_37,x:11.2788,y:4.55}).wait(1).to({graphics:mask_graphics_38,x:11.7485,y:4.55}).wait(1).to({graphics:mask_graphics_39,x:12.2182,y:4.55}).wait(1).to({graphics:mask_graphics_40,x:12.6879,y:4.55}).wait(1).to({graphics:mask_graphics_41,x:13.1576,y:4.55}).wait(1).to({graphics:mask_graphics_42,x:13.6273,y:4.55}).wait(1).to({graphics:mask_graphics_43,x:14.097,y:4.55}).wait(1).to({graphics:mask_graphics_44,x:14.5667,y:4.55}).wait(1).to({graphics:mask_graphics_45,x:15.0364,y:4.55}).wait(1).to({graphics:mask_graphics_46,x:15.5061,y:4.55}).wait(1).to({graphics:mask_graphics_47,x:15.9758,y:4.55}).wait(1).to({graphics:mask_graphics_48,x:16.4455,y:4.55}).wait(1).to({graphics:mask_graphics_49,x:16.9152,y:4.55}).wait(1).to({graphics:mask_graphics_50,x:17.3848,y:4.55}).wait(1).to({graphics:mask_graphics_51,x:17.8545,y:4.55}).wait(1).to({graphics:mask_graphics_52,x:18.3242,y:4.55}).wait(1).to({graphics:mask_graphics_53,x:18.7939,y:4.55}).wait(1).to({graphics:mask_graphics_54,x:19.2636,y:4.55}).wait(1).to({graphics:mask_graphics_55,x:19.7333,y:4.55}).wait(1).to({graphics:mask_graphics_56,x:20.203,y:4.55}).wait(1).to({graphics:mask_graphics_57,x:20.6727,y:4.55}).wait(1).to({graphics:mask_graphics_58,x:21.1424,y:4.55}).wait(1).to({graphics:mask_graphics_59,x:21.6121,y:4.55}).wait(1).to({graphics:mask_graphics_60,x:22.0818,y:4.55}).wait(1).to({graphics:mask_graphics_61,x:22.5515,y:4.55}).wait(1).to({graphics:mask_graphics_62,x:23.0212,y:4.55}).wait(1).to({graphics:mask_graphics_63,x:23.4909,y:4.55}).wait(1).to({graphics:mask_graphics_64,x:23.9606,y:4.55}).wait(1).to({graphics:mask_graphics_65,x:24.4303,y:4.55}).wait(1).to({graphics:mask_graphics_66,x:24.9,y:4.55}).wait(1).to({graphics:mask_graphics_67,x:25.3697,y:4.55}).wait(1).to({graphics:mask_graphics_68,x:25.8394,y:4.55}).wait(1).to({graphics:mask_graphics_69,x:26.3091,y:4.55}).wait(1).to({graphics:mask_graphics_70,x:26.7788,y:4.55}).wait(1).to({graphics:mask_graphics_71,x:27.2485,y:4.55}).wait(1).to({graphics:mask_graphics_72,x:27.7182,y:4.55}).wait(1).to({graphics:mask_graphics_73,x:28.1879,y:4.55}).wait(1).to({graphics:mask_graphics_74,x:28.6576,y:4.55}).wait(1).to({graphics:mask_graphics_75,x:29.1273,y:4.55}).wait(1).to({graphics:mask_graphics_76,x:29.597,y:4.55}).wait(1).to({graphics:mask_graphics_77,x:30.0667,y:4.55}).wait(1).to({graphics:mask_graphics_78,x:30.5364,y:4.55}).wait(1).to({graphics:mask_graphics_79,x:31.0061,y:4.55}).wait(1).to({graphics:mask_graphics_80,x:31.4758,y:4.55}).wait(1).to({graphics:mask_graphics_81,x:31.9455,y:4.55}).wait(1).to({graphics:mask_graphics_82,x:32.4152,y:4.55}).wait(1).to({graphics:mask_graphics_83,x:32.8848,y:4.55}).wait(1).to({graphics:mask_graphics_84,x:33.3545,y:4.55}).wait(1).to({graphics:mask_graphics_85,x:33.8242,y:4.55}).wait(1).to({graphics:mask_graphics_86,x:34.2939,y:4.55}).wait(1).to({graphics:mask_graphics_87,x:34.7636,y:4.55}).wait(1).to({graphics:mask_graphics_88,x:35.2333,y:4.55}).wait(1).to({graphics:mask_graphics_89,x:35.703,y:4.55}).wait(1).to({graphics:mask_graphics_90,x:36.1727,y:4.55}).wait(1).to({graphics:mask_graphics_91,x:36.6424,y:4.55}).wait(1).to({graphics:mask_graphics_92,x:37.1121,y:4.55}).wait(1).to({graphics:mask_graphics_93,x:37.5818,y:4.55}).wait(1).to({graphics:mask_graphics_94,x:38.0515,y:4.55}).wait(1).to({graphics:mask_graphics_95,x:38.5212,y:4.55}).wait(1).to({graphics:mask_graphics_96,x:38.9909,y:4.55}).wait(1).to({graphics:mask_graphics_97,x:39.4606,y:4.55}).wait(1).to({graphics:mask_graphics_98,x:39.9303,y:4.55}).wait(1).to({graphics:mask_graphics_99,x:40.4,y:4.55}).wait(1));

	// Слой_1
	this.instance = new lib.CachedBmp_53();

	var maskedShapeInstanceList = [this.instance];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(100));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,92.9,8);


(lib.plusLight = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.pl = new cjs.Text("+100,000 光", "bold 25px 'Arial'", "#FFFFFF");
	this.pl.name = "pl";
	this.pl.textAlign = "center";
	this.pl.lineHeight = 30;
	this.pl.lineWidth = 218;
	this.pl.parent = this;
	this.pl.setTransform(110.85,2);

	this.timeline.addTween(cjs.Tween.get(this.pl).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.plusLight, new cjs.Rectangle(0,0,221.7,32), null);


(lib.noB = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_45();
	this.instance.setTransform(6.2,0,0.8381,0.8381);

	this.instance_1 = new lib.CachedBmp_44();
	this.instance_1.setTransform(-1.95,-1.25,0.8381,0.8381);

	this.instance_2 = new lib.CachedBmp_47();
	this.instance_2.setTransform(6.2,0,0.8381,0.8381);

	this.instance_3 = new lib.CachedBmp_46();
	this.instance_3.setTransform(-1.95,-1.25,0.8381,0.8381);

	this.instance_4 = new lib.CachedBmp_49();
	this.instance_4.setTransform(6.2,0,0.8381,0.8381);

	this.instance_5 = new lib.CachedBmp_48();
	this.instance_5.setTransform(-1.95,-1.25,0.8381,0.8381);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.9,-1.2,52.8,35.2);


(lib.mtl = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_43();
	this.instance.setTransform(-0.9,-0.9,0.9131,0.9131);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.mtl, new cjs.Rectangle(-0.9,-0.9,16.5,33.8), null);


(lib.motivator = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(0,0,0.5517,0.5517);

	this.instance_1 = new lib.CachedBmp_41();
	this.instance_1.setTransform(-0.45,-0.45,0.5517,0.5517);

	this.instance_2 = new lib.CachedBmp_42();
	this.instance_2.setTransform(0,0,0.5517,0.5517);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,-0.4,62.9,72.2);


(lib.moth_static = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_39();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.moth_static, new cjs.Rectangle(-1,-1,79,94), null);


(lib.moth = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_38();
	this.instance.setTransform(-21.75,-25.25);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.moth, new cjs.Rectangle(-21.7,-25.2,43,51), null);


(lib.loc2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.text = new cjs.Text("达到第50关即可解锁", "bold 22px 'Arial'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 27;
	this.text.lineWidth = 173;
	this.text.parent = this;
	this.text.setTransform(92.5,16);

	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.loc2, new cjs.Rectangle(-1,-1,186,87), null);


(lib.loc1 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.text = new cjs.Text("总计达到 100M 光即可解锁", "bold 22px 'Arial'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 27;
	this.text.lineWidth = 173;
	this.text.parent = this;
	this.text.setTransform(92.5,16);

	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.loc1, new cjs.Rectangle(-1,-1,186,87), null);


(lib.light_icon = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.light_icon, new cjs.Rectangle(-1,-1,47,69), null);


(lib.lampPart = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_32();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lampPart, new cjs.Rectangle(0,0,96,96), null);


(lib.hoverU = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(-0.25,0,0.4558,0.4558);

	this.instance_1 = new lib.CachedBmp_28();
	this.instance_1.setTransform(-0.25,0,0.4558,0.4558);

	this.instance_2 = new lib.CachedBmp_29();
	this.instance_2.setTransform(-0.25,0,0.4558,0.4558);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.2,0,189.6,79.8);


(lib.hovering2 = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(0,0,0.7572,0.7572);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hovering2, new cjs.Rectangle(0,0,147.7,49.2), null);


(lib.hovering = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_25();
	this.instance.setTransform(0,0,0.7572,0.7572);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hovering, new cjs.Rectangle(0,0,147.7,49.2), null);


(lib.goldenMoth = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.goldenMoth, new cjs.Rectangle(-1,-1,121,144), null);


(lib.color = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_14();

	this.instance_1 = new lib.CachedBmp_15();

	this.instance_2 = new lib.CachedBmp_16();

	this.instance_3 = new lib.CachedBmp_17();

	this.instance_4 = new lib.CachedBmp_18();

	this.instance_5 = new lib.CachedBmp_19();

	this.instance_6 = new lib.CachedBmp_20();

	this.instance_7 = new lib.CachedBmp_21();

	this.instance_8 = new lib.CachedBmp_22();

	this.instance_9 = new lib.CachedBmp_23();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).to({state:[{t:this.instance_3}]},1).to({state:[{t:this.instance_4}]},1).to({state:[{t:this.instance_5}]},1).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_7}]},1).to({state:[{t:this.instance_8}]},1).to({state:[{t:this.instance_9}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,95,95);


(lib.chipG = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.CachedBmp_11();
	this.instance.setTransform(-14.35,-31.65);

	this.instance_1 = new lib.CachedBmp_12();
	this.instance_1.setTransform(-14.05,-31.35);

	this.instance_2 = new lib.CachedBmp_13();
	this.instance_2.setTransform(-11.6,-29.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance_1}]},1).to({state:[{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-14.3,-31.6,174.3,160);


(lib.buyAmount = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.t = new cjs.Text("最大", "bold 14px 'Arial'", "#FFFFFF");
	this.t.name = "t";
	this.t.textAlign = "center";
	this.t.lineHeight = 18;
	this.t.lineWidth = 44;
	this.t.parent = this;
	this.t.setTransform(23.95,6.8);

	this.instance = new lib.CachedBmp_9();

	this.instance_1 = new lib.CachedBmp_10();

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.t,p:{color:"#FFFFFF"}}]}).to({state:[{t:this.instance_1},{t:this.t,p:{color:"#000000"}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,48,28);


(lib.autoProg = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.text = new cjs.Text("自动", "bold 22px 'Arial'");
	this.text.textAlign = "center";
	this.text.lineHeight = 27;
	this.text.lineWidth = 73;
	this.text.parent = this;
	this.text.setTransform(17.4536,0.9,0.4532,0.4532);

	this.instance = new lib.CachedBmp_7();
	this.instance.setTransform(-0.95,-0.95,0.3505,0.3505);

	this.instance_1 = new lib.CachedBmp_8();
	this.instance_1.setTransform(-0.95,-0.95,0.3505,0.3505);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text}]}).to({state:[{t:this.instance_1},{t:this.text}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.9,-0.9,36.8,15);


(lib.adButton = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.text = new cjs.Text("看一个广告获得免费\n5分钟加速", "bold 21px 'Consolas'", "#003300");
	this.text.textAlign = "center";
	this.text.lineHeight = 27;
	this.text.parent = this;
	this.text.setTransform(81.2993,8.05,0.5797,0.5797);

	this.instance = new lib.CachedBmp_4();
	this.instance.setTransform(-2,-2);

	this.instance_1 = new lib.CachedBmp_5();
	this.instance_1.setTransform(-2,-2);

	this.instance_2 = new lib.CachedBmp_6();
	this.instance_2.setTransform(-2,-2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text,p:{color:"#003300"}}]}).to({state:[{t:this.instance_1},{t:this.text,p:{color:"#003300"}}]},1).to({state:[{t:this.instance_2},{t:this.text,p:{color:"#001F00"}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-2,-2,167,48);


(lib.upgrade = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_2
	this.hover = new lib.hoverU();
	this.hover.name = "hover";
	this.hover.setTransform(95,40,1,1,0,0,0,94.7,40);
	this.hover.alpha = 0.1484;
	new cjs.ButtonHelper(this.hover, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.hover).wait(1));

	// Слой_1
	this.uCost = new cjs.Text("10 光", "bold 25px 'Arial'", "#FFFFFF");
	this.uCost.name = "uCost";
	this.uCost.textAlign = "center";
	this.uCost.lineHeight = 30;
	this.uCost.lineWidth = 315;
	this.uCost.parent = this;
	this.uCost.setTransform(94.4813,60.65,0.5768,0.5768);

	this.uCh = new cjs.Text("1 -> 2", "bold 25px 'Arial'", "#FFFFFF");
	this.uCh.name = "uCh";
	this.uCh.textAlign = "center";
	this.uCh.lineHeight = 30;
	this.uCh.lineWidth = 315;
	this.uCh.parent = this;
	this.uCh.setTransform(94.4813,29.2,0.5768,0.5768);

	this.uName = new cjs.Text("购买飞蛾 (1/25)", "bold 25px 'Arial'", "#FFFFFF");
	this.uName.name = "uName";
	this.uName.textAlign = "center";
	this.uName.lineHeight = 30;
	this.uName.lineWidth = 315;
	this.uName.parent = this;
	this.uName.setTransform(94.4813,3.65,0.5768,0.5768);

	this.instance = new lib.CachedBmp_60();
	this.instance.setTransform(-1,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.uName},{t:this.uCh},{t:this.uCost}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.upgrade, new cjs.Rectangle(-1,0,191,80), null);


(lib.rebirthW = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_2
	this.hover = new lib.hoverU();
	this.hover.name = "hover";
	this.hover.setTransform(190.95,0,1,2.1941,0,0,0,189.2,0);
	this.hover.alpha = 0.1484;
	new cjs.ButtonHelper(this.hover, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.hover).wait(1));

	// Слой_1
	this.text = new cjs.Text("将重置您的进度和声望", "bold 10px 'Arial'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 13;
	this.text.lineWidth = 185;
	this.text.parent = this;
	this.text.setTransform(94.5,135.15);

	this.cclicks = new cjs.Text("点击5次以重生", "bold 14px 'Arial'", "#FFFFFF");
	this.cclicks.name = "cclicks";
	this.cclicks.textAlign = "center";
	this.cclicks.lineHeight = 18;
	this.cclicks.lineWidth = 185;
	this.cclicks.parent = this;
	this.cclicks.setTransform(95.35,155.4);

	this.rExp = new cjs.Text("^1 -> ^1.01", "bold 16px 'Arial'", "#FFFFFF");
	this.rExp.name = "rExp";
	this.rExp.textAlign = "center";
	this.rExp.lineHeight = 20;
	this.rExp.lineWidth = 185;
	this.rExp.parent = this;
	this.rExp.setTransform(94.5,103.65);

	this.text_1 = new cjs.Text("重生指数", "bold 16px 'Arial'", "#FFFFFF");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 20;
	this.text_1.lineWidth = 185;
	this.text_1.parent = this;
	this.text_1.setTransform(94.5,81.75);

	this.rMult = new cjs.Text("x1 -> x4", "bold 16px 'Arial'", "#FFFFFF");
	this.rMult.name = "rMult";
	this.rMult.textAlign = "center";
	this.rMult.lineHeight = 20;
	this.rMult.lineWidth = 183;
	this.rMult.parent = this;
	this.rMult.setTransform(96.45,54.7);

	this.text_2 = new cjs.Text("重生乘数（乘数增益）", "bold 14px 'Arial'", "#FFFFFF");
	this.text_2.textAlign = "center";
	this.text_2.lineHeight = 18;
	this.text_2.lineWidth = 183;
	this.text_2.parent = this;
	this.text_2.setTransform(96.45,32.8);

	this.text_3 = new cjs.Text("重生", "bold 20px 'Arial'", "#FFFFFF");
	this.text_3.textAlign = "center";
	this.text_3.lineHeight = 24;
	this.text_3.lineWidth = 185;
	this.text_3.parent = this;
	this.text_3.setTransform(95.5,2);

	this.instance = new lib.CachedBmp_51();
	this.instance.setTransform(2.1,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text_3},{t:this.text_2},{t:this.rMult},{t:this.text_1},{t:this.rExp},{t:this.cclicks},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.rebirthW, new cjs.Rectangle(0,0,191.1,175.3), null);


(lib.prestigeW = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_2
	this.hover = new lib.hoverU();
	this.hover.name = "hover";
	this.hover.setTransform(190.95,0,1,2.1941,0,0,0,189.2,0);
	this.hover.alpha = 0.1484;
	new cjs.ButtonHelper(this.hover, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.hover).wait(1));

	// Слой_1
	this.text = new cjs.Text("将重置您的进度", "bold 14px 'Arial'", "#FFFFFF");
	this.text.textAlign = "center";
	this.text.lineHeight = 18;
	this.text.lineWidth = 185;
	this.text.parent = this;
	this.text.setTransform(94.5,133.5);

	this.cclicks = new cjs.Text("点击5次以声望", "bold 14px 'Arial'", "#FFFFFF");
	this.cclicks.name = "cclicks";
	this.cclicks.textAlign = "center";
	this.cclicks.lineHeight = 18;
	this.cclicks.lineWidth = 185;
	this.cclicks.parent = this;
	this.cclicks.setTransform(94.5,155.4);

	this.pExp = new cjs.Text("^1 -> ^1.01", "bold 16px 'Arial'", "#FFFFFF");
	this.pExp.name = "pExp";
	this.pExp.textAlign = "center";
	this.pExp.lineHeight = 20;
	this.pExp.lineWidth = 185;
	this.pExp.parent = this;
	this.pExp.setTransform(94.5,103.65);

	this.text_1 = new cjs.Text("声望指数", "bold 16px 'Arial'", "#FFFFFF");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 20;
	this.text_1.lineWidth = 185;
	this.text_1.parent = this;
	this.text_1.setTransform(94.5,81.75);

	this.pMult = new cjs.Text("100,000 -> 101,101", "bold 16px 'Arial'", "#FFFFFF");
	this.pMult.name = "pMult";
	this.pMult.textAlign = "center";
	this.pMult.lineHeight = 20;
	this.pMult.lineWidth = 185;
	this.pMult.parent = this;
	this.pMult.setTransform(95.5,54.7);

	this.text_2 = new cjs.Text("声望乘数", "bold 16px 'Arial'", "#FFFFFF");
	this.text_2.textAlign = "center";
	this.text_2.lineHeight = 20;
	this.text_2.lineWidth = 185;
	this.text_2.parent = this;
	this.text_2.setTransform(95.5,32.8);

	this.text_3 = new cjs.Text("声望", "bold 20px 'Arial'", "#FFFFFF");
	this.text_3.textAlign = "center";
	this.text_3.lineHeight = 24;
	this.text_3.lineWidth = 185;
	this.text_3.parent = this;
	this.text_3.setTransform(95.5,2);

	this.instance = new lib.CachedBmp_50();
	this.instance.setTransform(2.1,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.text_3},{t:this.text_2},{t:this.pMult},{t:this.text_1},{t:this.pExp},{t:this.cclicks},{t:this.text}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.prestigeW, new cjs.Rectangle(0,0,191.1,175.3), null);


(lib.midAd = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.noB = new lib.noB();
	this.noB.name = "noB";
	this.noB.setTransform(25.8,66,1.1932,1.1932);
	new cjs.ButtonHelper(this.noB, 0, 1, 2);

	this.yesB = new lib.yesB();
	this.yesB.name = "yesB";
	this.yesB.setTransform(172.35,85.6,1.1932,1.1932,0,0,0,24.2,16.9);
	new cjs.ButtonHelper(this.yesB, 0, 1, 2);

	this.instance = new lib.CachedBmp_37();
	this.instance.setTransform(-10.4,-7.75);

	this.instance_1 = new lib.CachedBmp_36();
	this.instance_1.setTransform(-23.15,-12.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance},{t:this.yesB},{t:this.noB}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.midAd, new cjs.Rectangle(-23.1,-12.7,266,136), null);


(lib.hpbar = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.HP = new lib.refillHP();
	this.HP.name = "HP";
	this.HP.setTransform(41.4,7.25,0.8043,0.8043,0,0,0,46.5,4.1);

	this.instance = new lib.CachedBmp_30();
	this.instance.setTransform(-1,-1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance},{t:this.HP}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.hpbar, new cjs.Rectangle(-5.7,-3.3,89.7,21.8), null);


(lib.cGamess = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.instance = new lib.Растровоеизображение16();
	this.instance.setTransform(0,0,0.2674,0.2674);

	this.instance_1 = new lib.hovering();
	this.instance_1.setTransform(0,0,1.0315,1.2176);
	this.instance_1.alpha = 0.3008;

	this.instance_2 = new lib.hovering2();
	this.instance_2.setTransform(0,0,1.0315,1.2176);
	this.instance_2.alpha = 0.3008;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance}]}).to({state:[{t:this.instance},{t:this.instance_1}]},1).to({state:[{t:this.instance},{t:this.instance_2}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,152.3,60.2);


(lib.adButtont = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_1
	this.adButton = new lib.adButton();
	this.adButton.name = "adButton";
	new cjs.ButtonHelper(this.adButton, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.adButton).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.adButtont, new cjs.Rectangle(-2,-2,167,48), null);


(lib.lamp = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// Слой_4
	this.hpbar = new lib.hpbar();
	this.hpbar.name = "hpbar";
	this.hpbar.setTransform(-3.7,-35.4,1,1,0,0,0,38.8,7.7);

	this.timeline.addTween(cjs.Tween.get(this.hpbar).wait(1));

	// Слой_3
	this.lp = new lib.lampPart();
	this.lp.name = "lp";
	this.lp.setTransform(-0.25,-0.25,0.8043,0.8043,0,0,0,48,47.9);
	this.lp.alpha = 0.1016;

	this.timeline.addTween(cjs.Tween.get(this.lp).wait(1));

	// Слой_2
	this.color = new lib.color();
	this.color.name = "color";
	this.color.setTransform(-0.55,-0.6,0.8043,0.8043,0,0,0,47.6,47.5);
	this.color.alpha = 0.8008;

	this.timeline.addTween(cjs.Tween.get(this.color).wait(1));

	// Слой_1
	this.instance = new lib.CachedBmp_31();
	this.instance.setTransform(-43,-42.65);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.lamp, new cjs.Rectangle(-48.2,-46.3,90.2,88.69999999999999), null);


// stage content:
(lib.index = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	this.actionFrames = [0];
	this.isSingleFrame = false;
	// timeline functions:
	this.frame_0 = function() {
		if(this.isSingleFrame) {
			return;
		}
		if(this.totalFrames == 1) {
			this.isSingleFrame = true;
		}
		this.clearAllSoundStreams();
		 
		this.cGames.addEventListener("click", goCG.bind(this));
		function goCG() {
			window.open("http://gityx.com/", "_blank");
		}
		
		const crazysdk = window.CrazyGames.CrazySDK.getInstance(); //Getting the SDK
		crazysdk.init();
		adRequested = false;
		
		var fullscreen = false;
		var elem = document.getElementById("animation_container");
		
		crazysdk.addEventListener('adStarted', adStarted.bind(this));
		crazysdk.addEventListener('adError', adError.bind(this));
		crazysdk.addEventListener('adFinished', adFinished.bind(this));
		
		
		var addedAd2 = false;
		
		var respawn = 60;
		
		
		this.addEventListener("tick", devSet.bind(this));
		function devSet() {
			
			
			if (this.helpSplash.alpha > 0) {
				this.helpSplash.alpha -= 1/12/fps*timeMult;
			}
			else if (this.helpSplash.alpha < 0) {
				this.helpSplash.alpha = 0;
			}
			
			if (respawn > 0) {
				this.adButton.visible = false;
			}
			else {
				this.adButton.visible = true;
			}
			d = new Date();
			time1_ib = d.getTime()/1000;
			
		}
		
		
		function adStarted() {
			fps = 100000000;
			fps2 = 100000000;
		
		}
		
		function adError() {
		    fps = 30;
			fps2 = 30;
			this.helpSplash.alpha = 1;
			this.helpSplash.text = "这是一个广告错误，但无论如何这里有 1.5 分钟的奖励时间给你 ;)";
			speedUPtime_ib += 90;
			respawn = 300;
		}
		
		function adFinished() {
		    fps = 30;
			fps2 = 30;
			this.helpSplash.alpha = 1;
			this.helpSplash.text = "非常感谢观看。 这是您的奖励 5 分钟！";
			speedUPtime_ib += 300;
			respawn = 300;
		}
		
		function adError2() {
		    fps = 30;
			fps2 = 30;
			
		}
		
		
		function adFinished2() {
		    fps = 30;
			fps2 = 30;
			var mGet;
			
			var moneymoney = (mults[0].times(mults[1]).times(mults[2]).times(mults[3]).times(mults[4]).times(mults[5]).times(mults[6]).times(mults[7]).times(mults[8]).times(mults[9]).times(prestigeMult)).pow(prestigePower.times(rebirthPower));
			
			var absAmount = Decimal.min(moneymoney.times(combo).times(timeMult) , lamps[0].maxHPs);
			mGet = absAmount.times(lGain).times(prestigeMult).times(rebirthMult).times(mothNow).times(100);
		
			
			light = light.plus(mGet);
			tlight = tlight.plus(mGet);
			
			this.helpSplash.text = "你得到了 " + format(mGet) + " 光";
			
			respawn = 160;
		}
		
		
		this.adButton.addEventListener("click", getAd2.bind(this));
		function getAd2() {
			if (!crazysdk.hasAdblock) {
				crazysdk.requestAd('rewarded');
				adDelay = 60;
			}
		}
		
		
		this.midAd.yesB.addEventListener("click", watchAd.bind(this));
		function watchAd() {
			this.midAd.visible = false;
			this.chipG.visible = false;
			if (!addedAd2) {
				crazysdk.addEventListener('adFinished', adFinished2.bind(this));
				addedAd2 = true;
			}
			if (!crazysdk.hasAdblock) {
				crazysdk.requestAd('rewarded');
				adDelay = 60;
			}
		}
		
		
		//ads
		
		
		var respawn = 30;
		
		
		this.chipG.visible = false
		this.midAd.visible = false
		
		
		
		this.addEventListener("tick", bonusbonus.bind(this));
		function bonusbonus() {
			
			respawn -= 1/fps;
			if (this.chipG.life > 0) {
				this.chipG.life -= 1/fps;
				this.chipG.alpha = this.chipG.life/10;
				if (this.chipG.alpha < 0) {
					this.chipG.alpha.visible = false;
					respawn = 160;
				}
			}
			
			var chance = Math.random();
			if (chance <= 0.0009 && respawn <= 0) {
				this.chipG.visible = true;
				this.chipG.x = 164;
				this.chipG.y = 128;
				this.chipG.life = 15;
				respawn = 160;
			}
			
			if (this.midAd.visible) {
				stage.addChild(this.midAd);
			}
		}
		
		var respawn2 = 20;
		var yChange = 0;
		
		
		this.chipG.addEventListener("click", showAdd.bind(this));
		function showAdd() {
			this.midAd.visible = true;
			this.midAd.x = this.chipG.x + 40;
			this.midAd.y = this.chipG.y + 125;
		}
		
		this.midAd.noB.addEventListener("click", remChip.bind(this));
		function remChip() {
			this.midAd.visible = false;
			this.chipG.visible = false;
		}
		
		
		
		this.addEventListener("tick", spUP.bind(this));
		function spUP() {
			
			timeMult = 1 + (sActive*1);
			var dt = new Date();
			time2_ib = dt.getTime()/1000;
			
			if (speedUPtime_ib > 0) {
				this.speedUP_b.visible = true;
				this.spdUP.visible = true;
				this.spdTime.visible = true;
				this.spdUP.text = "加速 (x2, 最多 30分钟)";
				this.spdTime.text = Math.floor(speedUPtime_ib*10)/10 + "s";
				
				if (sActive == true) {
					this.speedUP_b.gotoAndStop(1);
					speedUPtime_ib -= 1/fps;
				}
				else {
					this.speedUP_b.gotoAndStop(0);
				}
			}
			else {
				this.speedUP_b.visible = false;
				this.spdUP.visible = false;
				this.spdTime.visible = false;
				sActive = false;
				this.adButton.visible = true;
			}
		}
		
		this.speedUP_b.addEventListener("click", makeActive.bind(this));
		function makeActive() {
			if (sActive == false) {
				sActive = true;
			}
			else {
				sActive = false;
			}
		}
		var notation = 1;
		
		
		
		function nd(a) {
			return new Decimal(a);
		}
		
		
		function format3(num) {
			if (num < 10) {
				return Math.round(num*100)/100;
			}
			else if (num < 100) {
				return Math.round(num*10)/10;
			}
			else {
				return Math.round(num);
			}
		}
		
		function nullify(num) {
			if (num < 10) {
				return "00" + Math.floor(num);
			}
			else if (num < 100) {
				return "0" + Math.floor(num);
			}
			else {
				return Math.floor(num);
			}
		}
		
		
		function format(num) {
			if (notation == 1) {
				return format2(num);
			}
			else {
				if (num.lt(1000)) {
					return format3(num.toNumber());
				}
				else if (num.lt(100000)) {
					var num_ = num.toNumber;
					var fPart = Math.floor(num/1000);
					var sPart = (num%1000);
					return fPart + "," + nullify(sPart);
				}
				else {
					return format_short(num);
				}
			}
		}
		
		function format0(num) {
			if (notation == 1) {
				if (num.lt(1000)) {
					return format2(num.floor());
				}
				else {
					return format2(num);
				}
			}
		}
		
		
		function format2(num) {
			if (num.lt(1000)) {
				return format3(num.toNumber());
			}
			else if (num.lt(100000)) {
				var num_ = num.toNumber;
				var fPart = Math.floor(num/1000);
				var sPart = (num%1000);
				return fPart + "," + nullify(sPart);
			}
			else if (num.lt(1e6)) {
				return format3(num.div(1e3).toNumber()) + " K";
			}
			else if (num.lt(1e9)) {
				return format3(num.div(1e6).toNumber()) + " M";
			}
			else if (num.lt(1e12)) {
				return format3(num.div(1e9).toNumber()) + " B";
			}
			else if (num.lt(1e15)) {
				return format3(num.div(1e12).toNumber()) + " T";
			}
			else if (num.lt(1e18)) {
				return format3(num.div(1e15).toNumber()) + " Qa";
			}
			else if (num.lt(1e21)) {
				return format3(num.div(1e18).toNumber()) + " Qi";
			}
			else if (num.lt(1e24)) {
				return format3(num.div(1e21).toNumber()) + " Sx";
			}
			else if (num.lt(1e27)) {
				return format3(num.div(1e24).toNumber()) + " Sp";
			}
			else if (num.lt(1e30)) {
				return format3(num.div(1e27).toNumber()) + " Oc";
			}
			else if (num.lt(1e33)) {
				return format3(num.div(1e30).toNumber()) + " No";
			}
			else if (num.lt(1e36)) {
				return format3(num.div(1e33).toNumber()) + " Dc";
			}
			else if (num.lt(1e39)) {
				return format3(num.div(1e36).toNumber()) + " UD";
			}
			else if (num.lt(1e42)) {
				return format3(num.div(1e39).toNumber()) + " DD";
			}
			else if (num.lt(1e45)) {
				return format3(num.div(1e42).toNumber()) + " TD";
			}
			else if (num.lt(1e48)) {
				return format3(num.div(1e45).toNumber()) + " qD";
			}
			else if (num.lt(1e51)) {
				return format3(num.div(1e48).toNumber()) + " QD";
			}
			else if (num.lt(1e54)) {
				return format3(num.div(1e51).toNumber()) + " sD";
			}
			else if (num.lt(1e57)) {
				return format3(num.div(1e54).toNumber()) + " SD";
			}
			else if (num.lt(1e60)) {
				return format3(num.div(1e57).toNumber()) + " OD";
			}
			else if (num.lt(1e63)) {
				return format3(num.div(1e60).toNumber()) + " ND";
			}
			else if (num.lt(1e66)) {
				return format3(num.div(1e63).toNumber()) + " Vg";
			}
			else if (num.lt(1e69)) {
				return format3(num.div(1e66).toNumber()) + " UV";
			}
			else if (num.lt(1e72)) {
				return format3(num.div(1e69).toNumber()) + " DV";
			}
			else if (num.lt(1e75)) {
				return format3(num.div(1e72).toNumber()) + " TV";
			}
			else if (num.lt(1e78)) {
				return format3(num.div(1e75).toNumber()) + " qV";
			}
			else if (num.lt(1e81)) {
				return format3(num.div(1e78).toNumber()) + " QV";
			}
			else if (num.lt(1e84)) {
				return format3(num.div(1e81).toNumber()) + " sV";
			}
			else if (num.lt(1e87)) {
				return format3(num.div(1e84).toNumber()) + " SV";
			}
			else if (num.lt(1e90)) {
				return format3(num.div(1e87).toNumber()) + " OV";
			}
			else if (num.lt(1e93)) {
				return format3(num.div(1e90).toNumber()) + " NV";
			}
			else if (num.lt(1e96)) {
				return format3(num.div(1e93).toNumber()) + " Tg";
			}
			else if (num.lt(1e99)) {
				return format3(num.div(1e96).toNumber()) + " UT";
			}
			else if (num.lt(1e100)) {
				return format3(num.div(1e99).toNumber()) + " DT";
			}
			else if (num.lt(1e103)) {
				return format3(num.div(1e100).toNumber()) + " G";
			}
			else {
				return format_short(num);
			}
		}
		
		
		var curInf = new Decimal("ee30800");
		
		
		function exponentialFormat(num, precision) {
			let e = num.log10().floor()
			let m = num.div(Decimal.pow(10, e))
			if(m.toStringWithDecimalPlaces(precision) == 10) {
				m = new Decimal(1)
				e = e.add(1)
			}
			return m.toStringWithDecimalPlaces(precision)+"e"+e.toStringWithDecimalPlaces(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}
		
		function exponentialFormat2(num, precision) {
			let e = num.log10();
			let e2 = e.log10().floor();
			let m = e.div(Decimal.pow(10, e2));
		
			return "e"+m.toStringWithDecimalPlaces(precision)+"e"+e2.toStringWithDecimalPlaces(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}
		
		function commaFormat(num, precision) {
			if (num === null || num === undefined) return "NaN"
			if (num.mag < 0.001) return (0).toFixed(precision)
			return num.toStringWithDecimalPlaces(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}
		
		
		function regularFormat(num, precision) {
			if (num === null || num === undefined) return "NaN"
			if (num.mag < 0.001) return (0).toFixed(precision)
			return num.toStringWithDecimalPlaces(precision)
		}
		
		function fixValue(x, y = 0) {
			return x || new Decimal(y)
		}
		
		function sumValues(x) {
			x = Object.values(x)
			if (!x[0]) return new Decimal(0)
			return x.reduce((a, b) => Decimal.add(a, b))
		}
		
		
		function format_short(decimal, precision=1) {
			decimal = new Decimal(decimal)
			if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
				return "NaN"
			}
			if (decimal.sign<0) return "-"+format(decimal.neg(), precision)
			if (decimal.mag == Number.POSITIVE_INFINITY) return "R_INF";
			if (!decimal.gte("ee1000000")) {
				if (decimal.gte(curInf)) {
					var slog = decimal.slog()
					if (slog.gte(1e6)) return "F" + format(slog.floor())
					else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
				} else if (decimal.gte("1e1e6")) return exponentialFormat2(decimal, 3)
				else if (decimal.gte(1e4)) return exponentialFormat(decimal, 2)
				else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
				else return regularFormat(decimal, precision)
			}
			else return "INF";
		}
		
		function formatWhole(decimal) {
			decimal = new Decimal(decimal)
			if (decimal.gte(1e9)) return format(decimal, 2)
			if (decimal.lte(0.95) && !decimal.eq(0)) return format(decimal, 2)
			return format(decimal, 0)
		}
		
		function formatTime(s) {
			if (s<60) return format(s)+"s"
			else if (s<3600) return formatWhole(Math.floor(s/60))+"m "+format(s%60)+"s"
			else if (s<86400) return formatWhole(Math.floor(s/3600))+"h "+formatWhole(Math.floor(s/60)%60)+"m "+format(s%60)+"s"
			else return formatWhole(Math.floor(s/86400)) + "d "+formatWhole(Math.floor(s/3600)%24)+"h "+formatWhole(Math.floor(s/60)%60)+"m "+format(s%60)+"s"
		}
		
		function toPlaces(x, precision, maxAccepted) {
			x = new Decimal(x)
			let result = x.toStringWithDecimalPlaces(precision)
			if (new Decimal(result).gte(maxAccepted)) {
				result = new Decimal(maxAccepted-Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
			}
			return result
		}
		
		function absmin(a, b) {
			if (Math.abs(a) < Math.abs(b)) {
				return a;
			}
			else {
				return b;
			}
		}
		
		var mousePosX = 0;
		var mousePosY = 0;
		
		
		this.addEventListener("tick", main_fs.bind(this));
		function main_fs() {
		
			mousePosX = stage.mouseX / canvas.width * 1160;
			mousePosY = stage.mouseY / canvas.height * 720;
		}
		function nd(a) {
			return new Decimal(a);
		}
		
		
		
		var lamps = [];
		var moths = [];
		
		var activeLamps = 0;
		
		
		var refillMeter = 0;
		var refillMax = 3;
		
		var mothNow = 1;
		
		
		var light = nd(0);
		var tlight = nd(0);
		
		var curStage = 0;
		var curStageMax = 0;
		var curStageMaxEver = 0;
		
		
		var progress = 0;
		
		var combo = 1;
		
		function upgrade(level, bCost, bInc, maxLevel) {
			this.level = level;
			this.maxLevel = maxLevel;
			this.bCost = bCost;
			this.bInc = bInc;
			this.bTotalCost = bCost.times(bInc.pow(level));
		}
		
		var upgrades = [new upgrade(1, nd(1), nd(10), 25), new upgrade(0, nd(100), nd(2), 50),
						new upgrade(0, nd(1000), nd(5), 9999), new upgrade(0, nd(10000), nd(5), 9999),
						new upgrade(0, nd(20000), nd(3), 9999), new upgrade(0, nd(50000), nd(10), 9999),
						new upgrade(0, nd(100000), nd(9), 9999), new upgrade(0, nd(1000000), nd(100), 100)];
		
		
		
		var buyAmo = 1;
		
		function upgrade2(amo) {
			this.buyAmo = amo;
			this.totalCost = nd(1);
		}
		
		
		var upgrades2 = [new upgrade2(1), new upgrade2(1), new upgrade2(1), new upgrade2(1), 
						 new upgrade2(1), new upgrade2(1), new upgrade2(1), new upgrade2(1)];
		
		
		var mults = [nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1)];
		var suckPower = nd(1);
		
		
		var prestigeMult = nd(1);
		var prestigePower = nd(1);
		
		var prestigeMult_next = nd(1);
		var prestigePower_next = nd(1);
		
		
		var rebirthMult = nd(1);
		var rebirthPower = nd(1);
		
		var rebirthMult_next = nd(1);
		var rebirthPower_next = nd(1);
		
		var autoP = false;
		
		
		for (var y = 0 ; y < 5 ; ++y) {
			for (var x = 0 ; x < 5 ; ++x) {
				var lamp;
				lamp = new lib.lamp();
				lamp.x = 263 + (x * 82);
				lamp.y = 263 + (y * 82);
				lamp.num = x + y*5;
				lamp.level = curStage;
				lamp.grade = Math.floor(curStage/10);
				
				if (curStage < 100) {
					lamp.maxHPs = nd(5).times(nd(1.5).pow(lamp.level));
				}
				else if (curStage < 250) {
					lamp.maxHPs = nd(5).times(nd(1.5 + (curStage-100)/100).pow(lamp.level));
				}
				else if (curStage < 350) {
					lamp.maxHPs = nd(5).times(nd(3 + (curStage-250)/10).pow(lamp.level));
				}
				else if (curStage < 500) {
					lamp.maxHPs = nd(5).times(nd(13 + (curStage-350)/3).pow(lamp.level));
				}
				else {
					lamp.maxHPs = nd(5).times(nd(63 + (curStage-500)).pow(lamp.level));
				}
				
				
				if (curStage > 400) {
					lamp.maxHPs = lamp.maxHPs.pow(nd(1 + (curStage-400)/10));
				}
			
				lamp.HPs = nd(0);
				
				lamp.color.gotoAndStop(lamp.level%10);
				lamp.color.alpha = 0.8 * (lamp.HPs.div(lamp.maxHPs)).toNumber();
				lamp.hpbar.HP.gotoAndStop(Math.floor((lamp.HPs.div(lamp.maxHPs)).toNumber() * 99));
				
				lamp.refill = false;
				lamp.active = false;
				
				stage.addChild(lamp);
				lamp.addEventListener('tick', setLamp);
				lamps.push(lamp);
				
			}
		}
		
		function setLamp(e) {
			var lamp = e.currentTarget;
			
			lamp.level = curStage;
			lamp.grade = Math.floor(curStage/10);
			if (curStage < 100) {
				lamp.maxHPs = nd(5).times(nd(1.5).pow(lamp.level));
			}
			else if (curStage < 250) {
				lamp.maxHPs = nd(5).times(nd(1.5 + (curStage-100)/100).pow(lamp.level));
			}
			else if (curStage < 350) {
				lamp.maxHPs = nd(5).times(nd(3 + (curStage-250)/10).pow(lamp.level));
			}
			else if (curStage < 500) {
				lamp.maxHPs = nd(5).times(nd(13 + (curStage-350)/3).pow(lamp.level));
			}
			else {
				lamp.maxHPs = nd(5).times(nd(63 + (curStage-500)).pow(lamp.level));
			}
			if (curStage > 400) {
				lamp.maxHPs = lamp.maxHPs.pow(nd(1 + (curStage-400)/10));
			}
			
			lamp.color.gotoAndStop(lamp.level%10);
			lamp.color.alpha = 0.8 * (lamp.HPs.div(lamp.maxHPs)).toNumber();
			lamp.hpbar.HP.gotoAndStop(Math.floor((lamp.HPs.div(lamp.maxHPs)).toNumber() * 99));
		
			
			if (lamp.refill) {
				if (lamp.HPs.lt(lamp.maxHPs)) {
					lamp.HPs = lamp.HPs.plus(lamp.maxHPs.times(rSpeed).div(fps).times(timeMult));
				}
				else {
					lamp.HPs = lamp.maxHPs;
					lamp.active = true;
					lamp.refill = false;
				}
			}
			
		}
		
		
		function spawnMoth() {
			var moth;
			moth = new lib.moth();
			moth.x = 303 + (Math.random() * 288);
			moth.y = 303 + (Math.random() * 288);
				
			moth.movX = 20;
			moth.movY = 20;
			moth.target = -1;
		
			moth.suckSpeed = suckPower;
			moth.active = true;
			moth.suck = false;
				
			stage.addChild(moth);
			moth.addEventListener('tick', setMoth);
			moths.push(moth);
		}
		
		
		function spawnGoldenMoth() {
			var moth;
			moth = new lib.goldenMoth();
			moth.x = -120;
			moth.y = 110 + (Math.random() * 400);
				
			moth.movX = 150;
			moth.movY = -30 + 60*Math.random();
			if (curStage < 100) {
				moth.money = nd(5).times(nd(1.501).pow(curStage)).times(10).times(lGain).pow(prestigePower.times(rebirthPower)).times(prestigeMult).times(rebirthMult);
			}
			else {
				moth.money = nd(5).times(nd(1.501 + (curStage - 100)/100).pow(curStage)).times(10).times(lGain).pow(prestigePower.times(rebirthPower)).times(prestigeMult).times(rebirthMult);
			}
				
			stage.addChild(moth);
			moth.addEventListener('tick', setGMoth);
			moth.addEventListener('click', getBonus);
		}
		
		var sucks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		
		
		function targeted(x, moth) {
			var bool = false;
			for (var i = 0 ; i < moths.length ; ++i) {
				if (moths[i].target == x && moths[i] != moth) {
					bool = true;
				}
			}
			return bool;
		}
		
		
		
		function setMoth(e) {
			var moth = e.currentTarget;
			
			moth.suckSpeed = suckPower;
			
			moth.rotation = Math.atan2(moth.movY, moth.movX)* 180 / Math.PI - 270;
			if (moth.active && !moth.suck && moth.target != -1 && (moth.x != lamps[moth.target].x || moth.y != lamps[moth.target].y)) {
				moth.x += absmin(moth.movX/fps*timeMult, lamps[moth.target].x-moth.x);
				moth.y += absmin(moth.movY/fps*timeMult, lamps[moth.target].y-moth.y);
			}
			else if (moth.target != -1 && moth.x == lamps[moth.target].x && moth.y == lamps[moth.target].y && lamps[moth.target].HPs.gt(0)) {
				moth.suck = true;
				sucks[moth.target] = true;
				
				var absAmount = Decimal.min(moth.suckSpeed.div(fps).times(combo).times(timeMult) , lamps[moth.target].HPs);
				lamps[moth.target].HPs = lamps[moth.target].HPs.sub(absAmount);
				light = light.plus(absAmount.times(lGain).times(prestigeMult).times(rebirthMult));
				tlight = tlight.plus(absAmount.times(lGain).times(prestigeMult).times(rebirthMult));
			}
			else if (moth.target != -1 && lamps[moth.target].HPs.lte(0) && lamps[moth.target].active == true) {
				lamps[moth.target].HPs = nd(0);
				lamps[moth.target].active = false;
				lamps[moth.target].refill = false;
				sucks[moth.target] = false;
				var multGain = (nd(lamps[moth.target].grade).plus(1).times(nd(lamps[moth.target].grade).plus(1)).times(rebirthMult).div(100));
				if (lamps[moth.target].grade > 10) {
					multGain = multGain.pow(nd(lamps[moth.target].grade - 6).div(4));
				}
				mults[lamps[moth.target].level%10] = mults[lamps[moth.target].level%10].plus(multGain);
				moth.target = -1;
				moth.active = true;
				moth.suck = false;
				activeLamps -= 1;
				if (curStage == curStageMax) {
					progress += 1;
				}
			}
			else if (moth.target != -1) {
				moth.target = -1;
				moth.suck = false;
				moth.active = true;
			}
		}
		
		
		function setGMoth(e) {
			var moth = e.currentTarget;
			
			
			moth.rotation = Math.atan2(moth.movY, moth.movX)* 180 / Math.PI - 270;
			moth.x += moth.movX/fps*timeMult;
			moth.y += moth.movY/fps*timeMult;
			
			var moneymoney = (mults[0].times(mults[1]).times(mults[2]).times(mults[3]).times(mults[4]).times(mults[5]).times(mults[6]).times(mults[7]).times(mults[8]).times(mults[9]).times(prestigeMult)).pow(prestigePower.times(rebirthPower));
			
			var absAmount = Decimal.min(moneymoney.times(combo).times(timeMult) , lamps[0].maxHPs);
			moth.money = absAmount.times(lGain).times(prestigeMult).times(rebirthMult).times(mothNow).times(10);
		
			
			if (moth.x > 1280) {
				moth.alpha = 0;
				moth.visible = false;
				moth.removeEventListener('tick', setGMoth);
				moth.removeEventListener('click', getBonus);
				stage.removeChild(moth);
			}
		}
		
		
		function getBonus(e) {
			var moth = e.currentTarget;
			
			var txt;
			txt = new lib.plusLight();
			txt.x = moth.x;
			txt.y = moth.y;
			
			light = light.plus(moth.money);
			tlight = tlight.plus(moth.money);
			txt.pl.text = "+" + format(moth.money) + " 光"
			
			moth.removeEventListener('tick', setGMoth);
			moth.removeEventListener('click', getBonus);
			stage.removeChild(moth);
			stage.addChild(txt);
			txt.addEventListener('tick', setText);
		}
			
		
		function setText(e) {
			var txt = e.currentTarget;
			
			txt.alpha -= (1/fps)/2
			
			if (txt.alpha <= 0) {
				txt.visible = false;
				txt.removeEventListener('click', setText);
				stage.removeChild(txt);
				
			}
		}
			
		
		function absmin(a , b) {
			if (Math.abs(a) < Math.abs(b)) {
				return a;
			}
			else {
				return b;
			}
		}
		
		
		
		var rSpeed = nd(0.1);
		var rRate = 3;
		var lGain = nd(1);
		var comboPower = nd(1);
		var maxCombo = 2;
		var goldenChance = 0.01;
		
		var pClicks = 5;
		var rClicks = 5;
		
		var fps = 30;
		var fps2 = 30;
		
		var speedUPtime_ib = 0;
		var sActive = false;
		var timeMult = 1;
		
		var tutVis = true;
		
		var d = new Date();
		var timeStart_ib = d.getTime()/1000;
		var time1_ib = d.getTime()/1000;
		var time2_ib = d.getTime()/1000;
		
		window.setInterval(calculateFPS, 1000);
		window.setInterval(saving, 10000);
		
		function calculateFPS() {
			fps = Math.max(5, fps2);
			fps2 = 1;
		}
		
		
		function loading() {
			if (localStorage.getItem('Moth_tlight')) {
				tlight = nd(JSON.parse(localStorage.getItem('Moth_tlight')));
				light = nd(JSON.parse(localStorage.getItem('Moth_light')));
				curStage = JSON.parse(localStorage.getItem('Moth_curStage'));
				curStageMax = JSON.parse(localStorage.getItem('Moth_curStageMax'));
				curStageMaxEver = JSON.parse(localStorage.getItem('Moth_curStageMaxEver'));
				progress = JSON.parse(localStorage.getItem('Moth_progress'));
				combo = JSON.parse(localStorage.getItem('Moth_combo'));
				upgrades = JSON.parse(localStorage.getItem('Moth_upgrades'));
				mults = JSON.parse(localStorage.getItem('Moth_mults'));
				prestigeMult = nd(JSON.parse(localStorage.getItem('Moth_prestigeMult')));
				prestigePower = nd(JSON.parse(localStorage.getItem('Moth_prestigePower')));
				rebirthMult = nd(JSON.parse(localStorage.getItem('Moth_rebirthMult')));
				rebirthPower = nd(JSON.parse(localStorage.getItem('Moth_rebirthPower')));
				speedUPtime_ib = JSON.parse(localStorage.getItem('Moth_speedUPtime_ib'));
				time1_ib = JSON.parse(localStorage.getItem('Moth_time1_ib'));
				tutVis = JSON.parse(localStorage.getItem('Moth_tutVis'));
				
				if (localStorage.getItem('Moth_buyAmo')) {
					buyAmo = JSON.parse(localStorage.getItem('Moth_buyAmo'));
				}
				
				for (var i = 0 ; i < upgrades.length ; ++i) {
					upgrades[i].bCost = nd(upgrades[i].bCost);
					upgrades[i].bInc = nd(upgrades[i].bInc);
					upgrades[i].bTotalCost = nd(upgrades[i].bTotalCost);
					upgrades2[i].totalCost = (Decimal.pow(upgrades[i].bInc, upgrades2[i].buyAmo).sub(1)).div((upgrades[i].bInc).sub(1)).times(upgrades[i].bTotalCost);
					
				}
				
				for (var i = 0 ; i < mults.length ; ++i) {
					mults[i] = nd(mults[i]);
		
				}
			}
		}
		
		loading();
		
		
		var bonus = time2_ib - time1_ib;
		var bonus = bonus/20;
		var bonus = Math.pow(bonus, 0.69);
		
		if (bonus >= 2) {
			speedUPtime_ib += bonus;
		}
		if (speedUPtime_ib > 1800) {
			speedUPtime_ib = 1800;
		}
		
		function saving() {
			localStorage.setItem('Moth_tlight', JSON.stringify(tlight));
			localStorage.setItem('Moth_light', JSON.stringify(light));
			localStorage.setItem('Moth_curStage', JSON.stringify(curStage));
			localStorage.setItem('Moth_curStageMax', JSON.stringify(curStageMax));
			localStorage.setItem('Moth_curStageMaxEver', JSON.stringify(curStageMaxEver));
			localStorage.setItem('Moth_progress', JSON.stringify(progress));
			localStorage.setItem('Moth_combo', JSON.stringify(combo));
			localStorage.setItem('Moth_upgrades', JSON.stringify(upgrades));
			localStorage.setItem('Moth_mults', JSON.stringify(mults));
			localStorage.setItem('Moth_prestigeMult', JSON.stringify(prestigeMult));
			localStorage.setItem('Moth_prestigePower', JSON.stringify(prestigePower));
			localStorage.setItem('Moth_rebirthMult', JSON.stringify(rebirthMult));
			localStorage.setItem('Moth_rebirthPower', JSON.stringify(rebirthPower));
			localStorage.setItem('Moth_speedUPtime_ib', JSON.stringify(speedUPtime_ib));
			localStorage.setItem('Moth_time1_ib', JSON.stringify(time1_ib));
			localStorage.setItem('Moth_tutVis', JSON.stringify(tutVis));
			localStorage.setItem('Moth_buyAmo', JSON.stringify(buyAmo));
		
			console.log("GAME SAVED");
		}
		
		
		this.addEventListener("tick", main.bind(this));
		function main() {
			
			
			fps2 += 1;
			time1_ib = d.getTime()/1000;
			
			this.moths.text = "飞蛾: " + Math.round(mothNow);
			this.light.text = "光: " + format(light);
			
			this.combos.text = "组合: " + format(nd(combo).times(100)) + "%";
			
			
			suckPower = (mults[0].times(mults[1]).times(mults[2]).times(mults[3]).times(mults[4]).times(mults[5]).times(mults[6]).times(mults[7]).times(mults[8]).times(mults[9]).times(prestigeMult)).pow(prestigePower.times(rebirthPower));
			refillMax = rRate;
			
			this.m1.text = format(mults[0]);
			this.m2.text = format(mults[1]);
			this.m3.text = format(mults[2]);
			this.m4.text = format(mults[3]);
			this.m5.text = format(mults[4]);
			this.m6.text = format(mults[5]);
			this.m7.text = format(mults[6]);
			this.m8.text = format(mults[7]);
			this.m9.text = format(mults[8]);
			this.m10.text = format(mults[9]);
			
			this.mothP.text = "飞蛾力量: " + format(suckPower);
			this.lampHP.text = "灯生命值: " + format(lamps[0].maxHPs);
			
			
			
			if (refillMeter < refillMax) {
				refillMeter += 1/fps*timeMult;
			}
			
			if (refillMeter >= refillMax && activeLamps < 25) {
				var t = Math.floor(25 * Math.random());
				while (lamps[t].active || lamps[t].refill) {
					t = Math.floor(25 * Math.random());
				}
				lamps[t].refill = true;
				refillMeter = refillMeter % refillMax;
				activeLamps += 1;
			}
			
			
			
			mothNow = upgrades[0].level;
			if (moths.length < mothNow) {
				spawnMoth();
			}
			
			for (var i = 0 ; i < 8 ; ++i) {
				upgrades[i].bTotalCost = upgrades[i].bCost.times(upgrades[i].bInc.pow(upgrades[i].level));
				upgrades2[i].totalCost = (Decimal.pow(upgrades[i].bInc, upgrades2[i].buyAmo).sub(1)).div((upgrades[i].bInc).sub(1)).times(upgrades[i].bTotalCost);
			}
			
			this.u1.uName.text = "购买飞蛾 (" + Math.round(upgrades[0].level) + "/" + Math.round(upgrades[0].maxLevel) + ")"
			this.u1.uCh.text = Math.round(upgrades[0].level) + " -> " + Math.round(upgrades[0].level + upgrades2[0].buyAmo);
			this.u1.uCost.text = format(upgrades2[0].totalCost) + " 光";
			
			this.u2.uName.text = "飞蛾速度 (" + Math.round(upgrades[1].level) + "/" + Math.round(upgrades[1].maxLevel) + ")"
			this.u2.uCh.text = Math.round(10 + upgrades[1].level) + " -> " + Math.round(10 + upgrades[1].level + upgrades2[1].buyAmo);
			this.u2.uCost.text = format(upgrades2[1].totalCost) + " 光";
			
			this.u3.uName.text = "补充速度 (" + Math.round(upgrades[2].level) + ")"
			rSpeed = nd(0.1 + (0.05*upgrades[2].level));
			var rSpeed_next = nd(0.1 + (0.05*(upgrades[2].level+upgrades2[2].buyAmo)));
			this.u3.uCh.text = format(rSpeed) + " -> " + format(rSpeed_next);
			this.u3.uCost.text = format(upgrades2[2].totalCost) + " 光";
			
			this.u4.uName.text = "补充率 (" + Math.round(upgrades[3].level) + ")"
			rRate = 3 * Math.pow(0.9, upgrades[3].level);
			rRate = Math.max(rRate, 0.00001);
			var rRate_next = 3 * Math.pow(0.9, upgrades[3].level+upgrades2[3].buyAmo);
			this.u4.uCh.text = format(nd(rRate)) + "s -> " + format(nd(rRate_next)) + "s";
			this.u4.uCost.text = format(upgrades2[3].totalCost) + " 光";
			
			this.u5.uName.text = "光增益 (" + Math.round(upgrades[4].level) + ")"
			lGain = nd(1 + upgrades[4].level*0.05);
			var lGain_next = nd(1 + (upgrades[4].level+upgrades2[4].buyAmo)*0.05);
			this.u5.uCh.text = format(lGain.times(100)) + "% -> " + format(lGain_next.times(100)) + "%";
			this.u5.uCost.text = format(upgrades2[4].totalCost) + " 光";
			
			this.u6.uName.text = "点击力量 (" + Math.round(upgrades[5].level) + ")"
			comboPower = nd(1 + upgrades[5].level*0.5).div(100);
			var comboPower_next = nd(1 + (upgrades[5].level+upgrades2[5].buyAmo)*0.5).div(100);
			this.u6.uCh.text = format(comboPower.times(100)) + "% -> " + format(comboPower_next.times(100)) + "%";
			this.u6.uCost.text = format(upgrades2[5].totalCost) + " 光";
			
			this.u7.uName.text = "最大组合 (" + Math.round(upgrades[6].level) + ")"
			maxCombo = 2 + upgrades[6].level*0.05;
			var maxCombo_next = 2 + (upgrades[6].level+upgrades2[6].buyAmo)*0.05;
			this.u7.uCh.text = format(nd(maxCombo).times(100)) + "% -> " + format(nd(maxCombo_next).times(100)) + "%";
			this.u7.uCost.text = format(upgrades2[6].totalCost) + " 光";
			
			this.u8.uName.text = "黄金几率 (" + Math.round(upgrades[7].level)+ "/" + Math.round(upgrades[7].maxLevel) + ")"
			goldenChance = 0.01 + upgrades[7].level*0.002;
			var goldenChance_next = 0.01 + (upgrades[7].level+upgrades2[7].buyAmo)*0.002;
			this.u8.uCh.text = format(nd(goldenChance).times(100)) + "% -> " + format(nd(goldenChance_next).times(100)) + "%";
			this.u8.uCost.text = format(upgrades2[7].totalCost) + " 光";
			
			
			var c = Math.random();
			if (c < 1 - Math.pow(1 - goldenChance, 1/fps*timeMult)) {
				spawnGoldenMoth();
			}
			
			if (combo > 1) {
				combo -= 0.02/fps;
			}
			if (combo < 1) {
				combo = 1;
			}
			if (combo > maxCombo) {
				combo = maxCombo;
			}
			
			
			if (curStage%10 == 0) {
				this.stColor.text = "白色";
				this.stColor.color = "#FFFFFF";
			}
			else if (curStage%10 == 1) {
				this.stColor.text = "红色";
				this.stColor.color = "#FF0000";
			}
			else if (curStage%10 == 2) {
				this.stColor.text = "橙色";
				this.stColor.color = "#FF9900";
			}
			else if (curStage%10 == 3) {
				this.stColor.text = "黄色";
				this.stColor.color = "#FFFF66";
			}
			else if (curStage%10 == 4) {
				this.stColor.text = "绿色";
				this.stColor.color = "#66CC00";
			}
			else if (curStage%10 == 5) {
				this.stColor.text = "青色";
				this.stColor.color = "#00FFFF";
			}
			else if (curStage%10 == 6) {
				this.stColor.text = "蓝色";
				this.stColor.color = "#0000CC";
			}
			else if (curStage%10 == 7) {
				this.stColor.text = "紫色";
				this.stColor.color = "#663399";
			}
			else if (curStage%10 == 8) {
				this.stColor.text = "粉色";
				this.stColor.color = "#FF00FF";
			}
			else if (curStage%10 == 9) {
				this.stColor.text = "棕色";
				this.stColor.color = "#663300";
			}
			
			
			this.m0.text = format(prestigeMult);
			this.powt.text = "^" + format(prestigePower.times(rebirthPower));
			
			
			if (progress >= 10 && curStage == curStageMax) {
				curStageMax += 1;
				progress = 0;
			}
			
			
			this.curStageB.tt.text = Math.round(curStage);
			if (curStage - 1 >= 0) {
				this.stageM1.visible = true;
				this.stageM1.tt.text = Math.round(curStage-1);
			}
			else {
				this.stageM1.visible = false;
			}
			if (curStage - 2 >= 0) {
				this.stageM2.visible = true;
				this.stageM2.tt.text = Math.round(curStage-2);
			}
			else {
				this.stageM2.visible = false;
			}
			if (curStage + 1 <= curStageMax) {
				this.stageP1.visible = true;
				this.stageP1.tt.text = Math.round(curStage+1);
			}
			else {
				this.stageP1.visible = false;
			}
			if (curStage + 2 <= curStageMax) {
				this.stageP2.visible = true;
				this.stageP2.tt.text = Math.round(curStage+2);
			}
			else {
				this.stageP2.visible = false;
			}
			
			if (curStage == curStageMax) {
				this.lampstnl.visible = true;
				this.lampstnl.text = Math.round(progress) + " / 10";
			}
			else {
				this.lampstnl.visible = false;
			}
			
			
			if (autoP) {
				this.autoProg.gotoAndStop(1);
				if (curStage != curStageMax) {
					curStage = curStageMax;
					killLamps();
				}
			}
			else {
				this.autoProg.gotoAndStop(0);
			}
			
			
			
			if (tlight.gte(1e6)) {
				this.loc1.visible = false;
				this.prestigeW.visible = true;
				
				prestigeMult_next = nd(2).pow((tlight.plus(1)).log(1e6));
				prestigePower_next = nd(1).plus(tlight.plus(1).log(1e10).div(100));
		
				if (prestigeMult_next.gte("1e1000")) {
					prestigeMult_next = prestigeMult_next.div("1e1000").pow(0.001).times("1e1000");
				}
				
				
				if (prestigePower_next.gte(4)) {
					prestigePower_next = prestigePower_next.div(4).pow(0.001).times(4);
				}
				
				
				
				this.prestigeW.pMult.text = format(prestigeMult) + " -> " + format(prestigeMult_next);
				this.prestigeW.pExp.text = format(prestigePower) + " -> " + format(prestigePower_next);
				this.prestigeW.cclicks.text = "点击 " + Math.round(pClicks) + " 次以声望";
				this.tip.visible = true;
			}
			else {
				this.loc1.visible = true;
				this.prestigeW.visible = false;
				this.tip.visible = false;
			}
			
			
			if (curStageMax > curStageMaxEver) {
				curStageMaxEver = curStageMax;
			}
			
			if (curStageMaxEver >= 50) {
				this.loc2.visible = false;
				this.rebirthW.visible = true;
				this.turboB.visible = true;
		
				rebirthMult_next = nd(curStageMaxEver).div(100).pow(nd(1 + curStageMaxEver/100)).plus(1);
				rebirthPower_next = nd(1).plus(nd(curStageMaxEver).div(50).pow(2).div(100));
				
				if (rebirthPower_next.gte(4)) {
					rebirthPower_next = rebirthPower_next.div(4).pow(0.001).times(4);
				}
				
				
				this.rebirthW.rMult.text = "x" + format(rebirthMult) + " -> x" + format(rebirthMult_next);
				this.rebirthW.rExp.text = format(rebirthPower) + " -> " + format(rebirthPower_next);
				this.rebirthW.cclicks.text = "点击 " + Math.round(rClicks) + " 次以转生";
				
			}
			else {
				this.loc2.visible = true;
				this.rebirthW.visible = false;
				this.turboB.visible = false;
			}
			
			if (tutVis) {
				this.tutor.visible = true;
				stage.addChild(this.tutor);
			}
			else {
				this.tutor.visible = false;
			}
			
			
			this.buy1.t.text = "1";
			this.buy10.t.text = "10";
			this.buy100.t.text = "100";
			this.buyMax.t.text = "最大";
			
			if (buyAmo == 1) {
				this.buy1.gotoAndStop(1);
				this.buy10.gotoAndStop(0);
				this.buy100.gotoAndStop(0);
				this.buyMax.gotoAndStop(0);
				for (var i = 0 ; i < 8 ; ++i) {
					upgrades2[i].buyAmo = 1;
				}
			}
			else if (buyAmo == 2) {
				this.buy1.gotoAndStop(0);
				this.buy10.gotoAndStop(1);
				this.buy100.gotoAndStop(0);
				this.buyMax.gotoAndStop(0);
				for (var i = 0 ; i < 8 ; ++i) {
					upgrades2[i].buyAmo = 10;
					upgrades2[i].buyAmo = Math.min(upgrades2[i].buyAmo, upgrades[i].maxLevel - upgrades[i].level);
				}
			}
			else if (buyAmo == 3) {
				this.buy1.gotoAndStop(0);
				this.buy10.gotoAndStop(0);
				this.buy100.gotoAndStop(1);
				this.buyMax.gotoAndStop(0);
				for (var i = 0 ; i < 8 ; ++i) {
					upgrades2[i].buyAmo = 100;
					upgrades2[i].buyAmo = Math.min(upgrades2[i].buyAmo, upgrades[i].maxLevel - upgrades[i].level);
				}
			}
			else if (buyAmo == 4) {
				this.buy1.gotoAndStop(0);
				this.buy10.gotoAndStop(0);
				this.buy100.gotoAndStop(0);
				this.buyMax.gotoAndStop(1);
				for (var i = 0 ; i < 8 ; ++i) {
					upgrades2[i].buyAmo = Decimal.floor(Decimal.log(light.div(upgrades[i].bTotalCost).times(upgrades[i].bInc.sub(1)).plus(1), nd(2)).div(Decimal.log(upgrades[i].bInc, nd(2)))).toNumber();
					upgrades2[i].buyAmo = Math.max(upgrades2[i].buyAmo, 1);
					upgrades2[i].buyAmo = Math.min(upgrades2[i].buyAmo, upgrades[i].maxLevel - upgrades[i].level);
				}
			}
			
			
			var mothDistance  = [];
			var mothsO = [];
			
			for (var j = 0 ; j < moths.length ; ++j) {
				var distance = 9999999;
				for (var i = 0 ; i < 25 ; ++i) {
					if (lamps[i].active) {
						var dist = (lamps[i].x-moths[j].x)*(lamps[i].x-moths[j].x) + (lamps[i].y-moths[j].y)*(lamps[i].y-moths[j].y);
						if (dist < distance) {
							distance = dist;
						}
					}
				}
				mothDistance.push(distance);
			}
			
			for (var i = 0 ; i < moths.length ; ++i) {
				var minDist = 99999999;
				var minMoth = 0;
				for (var j = 0 ; j < moths.length ; ++j) {
					if (mothDistance[j] < minDist && !isIn(moths[j], mothsO)) {
						minDist = mothDistance[j];
						minMoth = j;
					}
				}
				mothsO.push(moths[minMoth]);
			}	
			
			
			for (var j = 0 ; j < mothsO.length ; ++j) {
				if (!mothsO[j].suck) {
				var distance = -1;
				for (var i = 0 ; i < 25 ; ++i) {
					if (lamps[i].active && !sucks[i] && !targeted(i, mothsO[j])) {
						var dist = (lamps[i].x-mothsO[j].x)*(lamps[i].x-mothsO[j].x) + (lamps[i].y-mothsO[j].y)*(lamps[i].y-mothsO[j].y);
						if (distance == -1 || dist < distance) {
							mothsO[j].target = i;
							distance = dist;
							mothsO[j].movX = (lamps[i].x-mothsO[j].x)/(Math.sqrt(distance) + 0.1)*5*(10 + upgrades[1].level)*combo;
							mothsO[j].movY = (lamps[i].y-mothsO[j].y)/(Math.sqrt(distance) + 0.1)*5*(10 + upgrades[1].level)*combo;
						}
					}
				}
				if (distance == -1) {
					mothsO[j].active = false;
					mothsO[j].target = -1;
				}
				else if (!mothsO[j].suck) {
					mothsO[j].active = true;
				}
			}
			}
			
			
			
			
			
		}
		
		
		
		function isIn(value, array) {
			var bool = false;
			for (var i = 0 ; i < array.length ; ++i) {
				if (array[i] == value) {
					bool = true;
				}
			}
			return bool;
		}
		
		
		
		
		this.prestigeW.addEventListener("click", PRESTIGE.bind(this));
		function PRESTIGE() {
			if (pClicks > 1) {
				pClicks -= 1;
			}
			else {
				pClicks = 5;
				prestigeMult = prestigeMult_next;
				prestigePower = prestigePower_next;
				activeLamps = 0;
				refillMeter = 0;
				refillMax = 3;
				mothNow = 1;
				light = nd(0);
				curStage = 0;
				curStageMax = 0;
				
				progress = 0;
				combo = 1;
				upgrades = [new upgrade(1, nd(1), nd(10), 25), new upgrade(0, nd(100), nd(2), 50),
						new upgrade(0, nd(1000), nd(5), 9999), new upgrade(0, nd(10000), nd(5), 9999),
						new upgrade(0, nd(20000), nd(3), 9999), new upgrade(0, nd(50000), nd(10), 9999),
						new upgrade(0, nd(100000), nd(9), 9999), new upgrade(0, nd(1000000), nd(100), 100)];
		
				mults = [nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1)];
				suckPower = nd(1);
				
				killLamps();
				killMoths();
				light = nd(0);
			}
		}
		
		
		
		
		
		this.rebirthW.addEventListener("click", REBIRTH.bind(this));
		function REBIRTH() {
			if (rClicks > 1) {
				rClicks -= 1;
			}
			else {
				rClicks = 5;
				rebirthMult = rebirthMult_next;
				rebirthPower = rebirthPower_next;
				
				prestigeMult = nd(1);
				prestigePower = nd(1);
				
				activeLamps = 0;
				refillMeter = 0;
				refillMax = 3;
				mothNow = 1;
				light = nd(0);
				tlight = nd(0);
				curStage = 0;
				curStageMax = 0;
				
				progress = 0;
				combo = 1;
				upgrades = [new upgrade(1, nd(1), nd(10), 25), new upgrade(0, nd(100), nd(2), 50),
						new upgrade(0, nd(1000), nd(5), 9999), new upgrade(0, nd(10000), nd(5), 9999),
						new upgrade(0, nd(20000), nd(3), 9999), new upgrade(0, nd(50000), nd(10), 9999),
						new upgrade(0, nd(100000), nd(9), 9999), new upgrade(0, nd(1000000), nd(100), 100)];
		
				mults = [nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1), nd(1)];
				suckPower = nd(1);
				
				killLamps();
				killMoths();
				light = nd(0);
			}
		}
		
		
		
		
		
		function killLamps() {
			for (var i = 0 ; i < 25 ; ++i) {
				lamps[i].HPs = nd(0);
				lamps[i].refill = false;
				lamps[i].active = false;
			}
			for (var i = 0 ; i < moths.length ; ++i) {
				moths[i].active = true;
				moths[i].suck = false;
			}
			sucks = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			activeLamps = 0;
		}
		
		
		function killMoths() {
			for (var i = 0 ; i < moths.length ; ++i) {
				stage.removeChild(moths[i]);
				moths[i].removeEventListener('tick', setMoth);
			}
			moths = [];
		}
		
		
		this.stageM1.addEventListener("click", goM1.bind(this));
		function goM1() {
			curStage -= 1;
			killLamps();
		}
		
		
		this.stageM2.addEventListener("click", goM2.bind(this));
		function goM2() {
			curStage -= 2;
			killLamps();
		}
		
		this.stageP1.addEventListener("click", goP1.bind(this));
		function goP1() {
			curStage += 1;
			killLamps();
		}
		
		
		this.stageP2.addEventListener("click", goP2.bind(this));
		function goP2() {
			curStage += 2;
			killLamps();
		}
		
		this.u1.hover.addEventListener("click", u1buy.bind(this));
		function u1buy() {
			if (light.gte(upgrades2[0].totalCost) && upgrades[0].level < upgrades[0].maxLevel) {
				light = light.sub(upgrades2[0].totalCost);
				upgrades[0].level += upgrades2[0].buyAmo;
			}
		}
		
		
		this.u2.hover.addEventListener("click", u2buy.bind(this));
		function u2buy() {
			if (light.gte(upgrades2[1].totalCost) && upgrades[1].level < upgrades[1].maxLevel) {
				light = light.sub(upgrades2[1].totalCost);
				upgrades[1].level += upgrades2[1].buyAmo;
			}
		}
		
		
		this.u3.hover.addEventListener("click", u3buy.bind(this));
		function u3buy() {
			if (light.gte(upgrades2[2].totalCost) && upgrades[2].level < upgrades[2].maxLevel) {
				light = light.sub(upgrades2[2].totalCost);
				upgrades[2].level += upgrades2[2].buyAmo;
			}
		}
		
		
		this.u4.hover.addEventListener("click", u4buy.bind(this));
		function u4buy() {
			if (light.gte(upgrades2[3].totalCost) && upgrades[3].level < upgrades[3].maxLevel) {
				light = light.sub(upgrades2[3].totalCost);
				upgrades[3].level += upgrades2[3].buyAmo;
			}
		}
		
		
		this.u5.hover.addEventListener("click", u5buy.bind(this));
		function u5buy() {
			if (light.gte(upgrades2[4].totalCost) && upgrades[4].level < upgrades[4].maxLevel) {
				light = light.sub(upgrades2[4].totalCost);
				upgrades[4].level += upgrades2[4].buyAmo;
			}
		}
		
		
		this.u6.hover.addEventListener("click", u6buy.bind(this));
		function u6buy() {
			if (light.gte(upgrades2[5].totalCost) && upgrades[5].level < upgrades[5].maxLevel) {
				light = light.sub(upgrades2[5].totalCost);
				upgrades[5].level += upgrades2[5].buyAmo;
			}
		}
		
		
		this.u7.hover.addEventListener("click", u7buy.bind(this));
		function u7buy() {
			if (light.gte(upgrades2[6].totalCost) && upgrades[6].level < upgrades[6].maxLevel) {
				light = light.sub(upgrades2[6].totalCost);
				upgrades[6].level += upgrades2[6].buyAmo;
			}
		}
		
		
		this.u8.hover.addEventListener("click", u8buy.bind(this));
		function u8buy() {
			if (light.gte(upgrades2[7].totalCost) && upgrades[7].level < upgrades[7].maxLevel) {
				light = light.sub(upgrades2[7].totalCost);
				upgrades[7].level += upgrades2[7].buyAmo;
			}
		}
		
		
		this.motivator.addEventListener("click", motiv.bind(this));
		function motiv() {
			if (combo < maxCombo) {
				combo += comboPower.toNumber();
			}
		}
		
		
		this.autoProg.addEventListener("click", setAP.bind(this));
		function setAP() {
			if (!autoP) { autoP = true;}
			else {
				autoP = false;
			}
		}
		
		
		this.tutor.addEventListener("click", hideTutor.bind(this));
		function hideTutor() {
			tutVis = false;
		}
		
		
		this.tutShow.addEventListener("click", showTutor.bind(this));
		function showTutor() {
			tutVis = true;
		}
		
		
		this.buy1.addEventListener("click", setA1.bind(this));
		function setA1() {
			buyAmo = 1;
		}
		
		this.buy10.addEventListener("click", setA10.bind(this));
		function setA10() {
			buyAmo = 2;
		}
		
		this.buy100.addEventListener("click", setA100.bind(this));
		function setA100() {
			buyAmo = 3;
		}
		
		this.buyMax.addEventListener("click", setAmax.bind(this));
		function setAmax() {
			buyAmo = 4;
		}
		
		
		
		
		
		
		this.turboB.addEventListener("click", turboSpeed.bind(this));
		function turboSpeed() {
			curStage = curStageMax;
			
			
			for (var i = 0 ; i < 1000 ; ++i) {
				lamps[0].level = curStage;
				lamps[0].grade = Math.floor(curStage/10);
				if (curStage < 100) {
					lamps[0].maxHPs = nd(5).times(nd(1.5).pow(lamps[0].level));
				}
				else if (curStage < 250) {
					lamps[0].maxHPs = nd(5).times(nd(1.5 + (curStage-100)/100).pow(lamps[0].level));
				}
				else if (curStage < 350) {
					lamps[0].maxHPs = nd(5).times(nd(3 + (curStage-250)/10).pow(lamps[0].level));
				}
				else if (curStage < 500) {
					lamps[0].maxHPs = nd(5).times(nd(13 + (curStage-350)/3).pow(lamps[0].level));
				}
				else {
					lamps[0].maxHPs = nd(5).times(nd(63 + (curStage-500)).pow(lamps[0].level));
				}
				
				if (curStage > 400) {
					lamps[0].maxHPs = lamps[0].maxHPs.pow(nd(1 + (curStage-400)/10));
				}
					
				suckPower = (mults[0].times(mults[1]).times(mults[2]).times(mults[3]).times(mults[4]).times(mults[5]).times(mults[6]).times(mults[7]).times(mults[8]).times(mults[9]).times(prestigeMult)).pow(prestigePower.times(rebirthPower));
				
				if (suckPower.gte(lamps[0].maxHPs.times(10))) {
					var multGain = (nd(lamps[0].grade).plus(1).times(nd(lamps[0].grade).plus(1)).times(rebirthMult).div(100));
					if (lamps[0].grade > 10) {
						multGain = multGain.pow(nd(lamps[0].grade - 6).div(4));
					}
					mults[lamps[0].level%10] = mults[lamps[0].level%10].plus(multGain.times(10));
					if (curStage == curStageMax) {
						curStageMax += 1;
						curStage = curStageMax;
						progress = 0;
						killLamps();
					}
				}
				else {
					break;
				}
				
			}
		}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// tutor
	this.tutor = new lib.tutor();
	this.tutor.name = "tutor";
	this.tutor.setTransform(0,359.4,0.9035,1,0,0,0,0,359.4);
	new cjs.ButtonHelper(this.tutor, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.tutor).wait(1));

	// cgames
	this.midAd = new lib.midAd();
	this.midAd.name = "midAd";
	this.midAd.setTransform(-229.7,231.4,0.7932,0.7932);

	this.chipG = new lib.chipG();
	this.chipG.name = "chipG";
	this.chipG.setTransform(-170.45,79.8,0.6729,0.6729,0,0,0,9,-10.2);
	new cjs.ButtonHelper(this.chipG, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.chipG},{t:this.midAd}]}).wait(1));

	// format
	this.cGames = new lib.cGamess();
	this.cGames.name = "cGames";
	this.cGames.setTransform(32.2,714.45,1.0847,1.0847,0,0,0,0.4,60.3);
	new cjs.ButtonHelper(this.cGames, 0, 1, 2);

	this.timeline.addTween(cjs.Tween.get(this.cGames).wait(1));

	// locks
	this.loc2 = new lib.loc2();
	this.loc2.name = "loc2";
	this.loc2.setTransform(751.9,567.85,1,1,0,0,0,92,42.5);

	this.loc1 = new lib.loc1();
	this.loc1.name = "loc1";
	this.loc1.setTransform(751.9,385.45,1,1,0,0,0,92,42.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.loc1},{t:this.loc2}]}).wait(1));

	// Слой_1
	this.turboB = new lib.turboB();
	this.turboB.name = "turboB";
	this.turboB.setTransform(912.35,140.45,1,1,0,0,0,46.1,15.9);
	new cjs.ButtonHelper(this.turboB, 0, 1, 2);

	this.buyMax = new lib.buyAmount();
	this.buyMax.name = "buyMax";
	this.buyMax.setTransform(1231.15,275.75,1,1,0,0,0,23.9,14.1);

	this.buy100 = new lib.buyAmount();
	this.buy100.name = "buy100";
	this.buy100.setTransform(1177.55,275.75,1,1,0,0,0,23.9,14.1);

	this.buy10 = new lib.buyAmount();
	this.buy10.name = "buy10";
	this.buy10.setTransform(1123.95,275.75,1,1,0,0,0,23.9,14.1);

	this.buy1 = new lib.buyAmount();
	this.buy1.name = "buy1";
	this.buy1.setTransform(1070.35,275.75,1,1,0,0,0,23.9,14.1);

	this.tip = new cjs.Text("Prestige & Rebirth mults also boost light gain", "bold 18px 'Arial'", "#FFFFFF");
	this.tip.name = "tip";
	this.tip.textAlign = "center";
	this.tip.lineHeight = 22;
	this.tip.lineWidth = 496;
	this.tip.parent = this;
	this.tip.setTransform(942.8,681.65);

	this.tutShow = new lib.tutShow();
	this.tutShow.name = "tutShow";
	this.tutShow.setTransform(1280.15,717.75,1.5784,1.5784,0,0,0,30.7,30.7);
	new cjs.ButtonHelper(this.tutShow, 0, 1, 2);

	this.helpSplash = new cjs.Text(":)", "bold 14px 'Arial'", "#C6FFA0");
	this.helpSplash.name = "helpSplash";
	this.helpSplash.lineHeight = 18;
	this.helpSplash.lineWidth = 227;
	this.helpSplash.parent = this;
	this.helpSplash.setTransform(235.8113,655.0413,1.3098,1.3063);

	this.adButton = new lib.adButtont();
	this.adButton.name = "adButton";
	this.adButton.setTransform(110.5,618.65,0.9527,0.9502,0,0,0,81.7,22.7);

	this.speedUP_b = new lib.speedUP_b();
	this.speedUP_b.name = "speedUP_b";
	this.speedUP_b.setTransform(28.85,564.25,0.8939,0.8916,0,0,0,0.1,0.1);

	this.spdTime = new cjs.Text("1h 30m 59s", "bold 18px 'Arial'", "#FFFFFF");
	this.spdTime.name = "spdTime";
	this.spdTime.textAlign = "center";
	this.spdTime.lineHeight = 22;
	this.spdTime.lineWidth = 161;
	this.spdTime.parent = this;
	this.spdTime.setTransform(131.5,562.25,0.9704,0.9678);

	this.spdUP = new cjs.Text("加速 (x2, 最多 1小时)", "bold 18px 'Arial'", "#FFFFFF");
	this.spdUP.name = "spdUP";
	this.spdUP.textAlign = "center";
	this.spdUP.lineHeight = 22;
	this.spdUP.lineWidth = 208;
	this.spdUP.parent = this;
	this.spdUP.setTransform(132.813,543.4,0.7418,0.7398);

	this.rebirthW = new lib.rebirthW();
	this.rebirthW.name = "rebirthW";
	this.rebirthW.setTransform(751.05,571.95,1,1,0,0,0,95,87.7);

	this.prestigeW = new lib.prestigeW();
	this.prestigeW.name = "prestigeW";
	this.prestigeW.setTransform(751.05,388.05,1,1,0,0,0,95,87.7);

	this.autoProg = new lib.autoProg();
	this.autoProg.name = "autoProg";
	this.autoProg.setTransform(912.4,95.65,2.8529,2.8529,0,0,0,17.5,6.7);

	this.lampstnl = new cjs.Text("0 / 10", "bold 23px 'Arial'", "#FFFFFF");
	this.lampstnl.name = "lampstnl";
	this.lampstnl.textAlign = "center";
	this.lampstnl.lineHeight = 28;
	this.lampstnl.lineWidth = 100;
	this.lampstnl.parent = this;
	this.lampstnl.setTransform(366.1,98.5,1.6212,1.6212);

	this.stColor = new cjs.Text("白色", "bold 25px 'Arial'", "#FFFFFF");
	this.stColor.name = "stColor";
	this.stColor.lineHeight = 30;
	this.stColor.lineWidth = 123;
	this.stColor.parent = this;
	this.stColor.setTransform(694.85,179.85);

	this.text = new cjs.Text("关卡色彩:", "bold 25px 'Arial'", "#FFFFFF");
	this.text.lineHeight = 30;
	this.text.lineWidth = 174;
	this.text.parent = this;
	this.text.setTransform(528.9,179.85);

	this.stageM2 = new lib.stageBox();
	this.stageM2.name = "stageM2";
	this.stageM2.setTransform(486.9,117.7,0.6444,0.6444,0,0,0,49.2,44.3);

	this.stageP2 = new lib.stageBox();
	this.stageP2.name = "stageP2";
	this.stageP2.setTransform(809.05,117.7,0.6444,0.6444,0,0,0,49.2,44.3);

	this.stageM1 = new lib.stageBox();
	this.stageM1.name = "stageM1";
	this.stageM1.setTransform(558.6,117.7,0.6444,0.6444,0,0,0,49.2,44.3);

	this.stageP1 = new lib.stageBox();
	this.stageP1.name = "stageP1";
	this.stageP1.setTransform(737.35,117.7,0.6444,0.6444,0,0,0,49.2,44.3);

	this.curStageB = new lib.stageBox();
	this.curStageB.name = "curStageB";
	this.curStageB.setTransform(649.4,117.65,1,1,0,0,0,49.3,44.3);

	this.text_1 = new cjs.Text("点击铃铛加速你的飞蛾", "bold 20px 'Arial'", "#FFFFFF");
	this.text_1.textAlign = "center";
	this.text_1.lineHeight = 24;
	this.text_1.lineWidth = 199;
	this.text_1.parent = this;
	this.text_1.setTransform(124.1,442.85);

	this.combos = new cjs.Text("组合: 200%", "bold 25px 'Arial'", "#FFFFFF");
	this.combos.name = "combos";
	this.combos.textAlign = "center";
	this.combos.lineHeight = 30;
	this.combos.lineWidth = 223;
	this.combos.parent = this;
	this.combos.setTransform(119.95,402.4);

	this.motivator = new lib.motivator();
	this.motivator.name = "motivator";
	this.motivator.setTransform(115.35,319.4,1.8126,1.8077,0,0,0,31.3,36);
	new cjs.ButtonHelper(this.motivator, 0, 1, 2);

	this.u4 = new lib.upgrade();
	this.u4.name = "u4";
	this.u4.setTransform(955.2,614.85,1,1,0,0,0,94.7,40);

	this.u3 = new lib.upgrade();
	this.u3.name = "u3";
	this.u3.setTransform(955.2,524.25,1,1,0,0,0,94.7,40);

	this.u2 = new lib.upgrade();
	this.u2.name = "u2";
	this.u2.setTransform(955.2,433.65,1,1,0,0,0,94.7,40);

	this.u1 = new lib.upgrade();
	this.u1.name = "u1";
	this.u1.setTransform(955.2,343.05,1,1,0,0,0,94.7,40);

	this.plusLight = new lib.plusLight();
	this.plusLight.name = "plusLight";
	this.plusLight.setTransform(557.95,898.75,1,1,0,0,0,110.9,16);

	this.goldenMoth = new lib.goldenMoth();
	this.goldenMoth.name = "goldenMoth";
	this.goldenMoth.setTransform(361.25,888.1,1,1,0,0,0,59.2,70.8);

	this.u8 = new lib.upgrade();
	this.u8.name = "u8";
	this.u8.setTransform(1160.3,614.85,1,1,0,0,0,94.7,40);

	this.u7 = new lib.upgrade();
	this.u7.name = "u7";
	this.u7.setTransform(1160.3,524.25,1,1,0,0,0,94.7,40);

	this.u6 = new lib.upgrade();
	this.u6.name = "u6";
	this.u6.setTransform(1160.3,433.65,1,1,0,0,0,94.7,40);

	this.u5 = new lib.upgrade();
	this.u5.name = "u5";
	this.u5.setTransform(1160.3,343.05,1,1,0,0,0,94.7,40);

	this.lampHP = new cjs.Text("灯生命值: 5", "bold 25px 'Arial'", "#FFFFFF");
	this.lampHP.name = "lampHP";
	this.lampHP.textAlign = "center";
	this.lampHP.lineHeight = 30;
	this.lampHP.lineWidth = 370;
	this.lampHP.parent = this;
	this.lampHP.setTransform(1125.35,228.2,0.7721,0.7721);

	this.powt = new cjs.Text("^1", "bold 23px 'Arial'", "#999999");
	this.powt.name = "powt";
	this.powt.textAlign = "center";
	this.powt.lineHeight = 28;
	this.powt.lineWidth = 100;
	this.powt.parent = this;
	this.powt.setTransform(207.1,73.4,1.0172,1.0172);

	this.mothP = new cjs.Text("飞蛾力量: 1", "bold 25px 'Arial'", "#FFFFFF");
	this.mothP.name = "mothP";
	this.mothP.textAlign = "center";
	this.mothP.lineHeight = 30;
	this.mothP.lineWidth = 370;
	this.mothP.parent = this;
	this.mothP.setTransform(1125.35,203.55,0.7721,0.7721);

	this.instance = new lib.moth();
	this.instance.setTransform(243.45,889.55);

	this.lamp = new lib.lamp();
	this.lamp.name = "lamp";
	this.lamp.setTransform(142.1,889.05);

	this.light = new cjs.Text("光: 100,000", "bold 25px 'Arial'", "#FFFFFF");
	this.light.name = "light";
	this.light.lineHeight = 30;
	this.light.lineWidth = 264;
	this.light.parent = this;
	this.light.setTransform(1064.15,139.55,0.7721,0.7721);

	this.moths = new cjs.Text("飞蛾: 12", "bold 25px 'Arial'", "#FFFFFF");
	this.moths.name = "moths";
	this.moths.lineHeight = 30;
	this.moths.lineWidth = 264;
	this.moths.parent = this;
	this.moths.setTransform(1064.15,81.35,0.7721,0.7721);

	this.instance_1 = new lib.light_icon();
	this.instance_1.setTransform(1023.9,152.3,0.7721,0.7721,0,0,0,22.8,33.4);

	this.instance_2 = new lib.moth_static();
	this.instance_2.setTransform(1003.35,62.95,0.5556,0.5556,0,0,0,0,0.1);

	this.m0 = new cjs.Text("123", "bold 23px 'Arial'", "#999999");
	this.m0.name = "m0";
	this.m0.textAlign = "center";
	this.m0.lineHeight = 28;
	this.m0.lineWidth = 100;
	this.m0.parent = this;
	this.m0.setTransform(69.4,73.4,1.0172,1.0172);

	this.instance_3 = new lib.mtl();
	this.instance_3.setTransform(1158.3,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m10 = new cjs.Text("2", "bold 25px 'Arial'", "#663300");
	this.m10.name = "m10";
	this.m10.textAlign = "center";
	this.m10.lineHeight = 30;
	this.m10.lineWidth = 100;
	this.m10.parent = this;
	this.m10.setTransform(1223,11.15,1.0952,1.0952);

	this.instance_4 = new lib.mtl();
	this.instance_4.setTransform(1028.75,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m9 = new cjs.Text("2", "bold 25px 'Arial'", "#FF00FF");
	this.m9.name = "m9";
	this.m9.textAlign = "center";
	this.m9.lineHeight = 30;
	this.m9.lineWidth = 100;
	this.m9.parent = this;
	this.m9.setTransform(1093.45,11.15,1.0952,1.0952);

	this.instance_5 = new lib.mtl();
	this.instance_5.setTransform(899.15,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m8 = new cjs.Text("2", "bold 25px 'Arial'", "#663399");
	this.m8.name = "m8";
	this.m8.textAlign = "center";
	this.m8.lineHeight = 30;
	this.m8.lineWidth = 100;
	this.m8.parent = this;
	this.m8.setTransform(963.9,11.15,1.0952,1.0952);

	this.instance_6 = new lib.mtl();
	this.instance_6.setTransform(769.6,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m7 = new cjs.Text("2", "bold 25px 'Arial'", "#0000CC");
	this.m7.name = "m7";
	this.m7.textAlign = "center";
	this.m7.lineHeight = 30;
	this.m7.lineWidth = 100;
	this.m7.parent = this;
	this.m7.setTransform(834.3,11.15,1.0952,1.0952);

	this.instance_7 = new lib.mtl();
	this.instance_7.setTransform(640.05,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m6 = new cjs.Text("2", "bold 25px 'Arial'", "#00FFFF");
	this.m6.name = "m6";
	this.m6.textAlign = "center";
	this.m6.lineHeight = 30;
	this.m6.lineWidth = 100;
	this.m6.parent = this;
	this.m6.setTransform(704.75,11.15,1.0952,1.0952);

	this.instance_8 = new lib.mtl();
	this.instance_8.setTransform(510.5,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m5 = new cjs.Text("2", "bold 25px 'Arial'", "#66CC00");
	this.m5.name = "m5";
	this.m5.textAlign = "center";
	this.m5.lineHeight = 30;
	this.m5.lineWidth = 100;
	this.m5.parent = this;
	this.m5.setTransform(575.2,11.15,1.0952,1.0952);

	this.instance_9 = new lib.mtl();
	this.instance_9.setTransform(380.9,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m4 = new cjs.Text("2", "bold 25px 'Arial'", "#FFFF66");
	this.m4.name = "m4";
	this.m4.textAlign = "center";
	this.m4.lineHeight = 30;
	this.m4.lineWidth = 100;
	this.m4.parent = this;
	this.m4.setTransform(445.6,11.15,1.0952,1.0952);

	this.instance_10 = new lib.mtl();
	this.instance_10.setTransform(251.35,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m3 = new cjs.Text("2", "bold 25px 'Arial'", "#FF9900");
	this.m3.name = "m3";
	this.m3.textAlign = "center";
	this.m3.lineHeight = 30;
	this.m3.lineWidth = 100;
	this.m3.parent = this;
	this.m3.setTransform(316.05,11.15,1.0952,1.0952);

	this.instance_11 = new lib.mtl();
	this.instance_11.setTransform(121.8,26.5,1.0952,1.0952,0,0,0,7.2,16);

	this.m2 = new cjs.Text("2", "bold 25px 'Arial'", "#FF0000");
	this.m2.name = "m2";
	this.m2.textAlign = "center";
	this.m2.lineHeight = 30;
	this.m2.lineWidth = 100;
	this.m2.parent = this;
	this.m2.setTransform(186.5,11.15,1.0952,1.0952);

	this.m1 = new cjs.Text("2", "bold 25px 'Arial'", "#FFFFFF");
	this.m1.name = "m1";
	this.m1.textAlign = "center";
	this.m1.lineHeight = 30;
	this.m1.lineWidth = 100;
	this.m1.parent = this;
	this.m1.setTransform(56.9,11.15,1.0952,1.0952);

	this.instance_12 = new lib.CachedBmp_1();
	this.instance_12.setTransform(-0.95,53.7);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_12},{t:this.m1},{t:this.m2},{t:this.instance_11},{t:this.m3},{t:this.instance_10},{t:this.m4},{t:this.instance_9},{t:this.m5},{t:this.instance_8},{t:this.m6},{t:this.instance_7},{t:this.m7},{t:this.instance_6},{t:this.m8},{t:this.instance_5},{t:this.m9},{t:this.instance_4},{t:this.m10},{t:this.instance_3},{t:this.m0},{t:this.instance_2},{t:this.instance_1},{t:this.moths},{t:this.light},{t:this.lamp},{t:this.instance},{t:this.mothP},{t:this.powt},{t:this.lampHP},{t:this.u5},{t:this.u6},{t:this.u7},{t:this.u8},{t:this.goldenMoth},{t:this.plusLight},{t:this.u1},{t:this.u2},{t:this.u3},{t:this.u4},{t:this.motivator},{t:this.combos},{t:this.text_1},{t:this.curStageB},{t:this.stageP1},{t:this.stageM1},{t:this.stageP2},{t:this.stageM2},{t:this.text},{t:this.stColor},{t:this.lampstnl},{t:this.autoProg},{t:this.prestigeW},{t:this.rebirthW},{t:this.spdUP},{t:this.spdTime},{t:this.speedUP_b},{t:this.adButton},{t:this.helpSplash},{t:this.tutShow},{t:this.tip},{t:this.buy1},{t:this.buy10},{t:this.buy100},{t:this.buyMax},{t:this.turboB}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(392,359,890.5,601.3);
// library properties:
lib.properties = {
	id: 'AA90A61D973BC042AC0AE62308F30FCD',
	width: 1280,
	height: 720,
	fps: 30,
	color: "#000000",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_36.png?1636989056629", id:"CachedBmp_36"},
		{src:"images/CachedBmp_29.png?1636989056629", id:"CachedBmp_29"},
		{src:"images/CachedBmp_28.png?1636989056629", id:"CachedBmp_28"},
		{src:"images/CachedBmp_27.png?1636989056629", id:"CachedBmp_27"},
		{src:"images/Растровоеизображение16.png?1636989056629", id:"Растровоеизображение16"},
		{src:"images/CachedBmp_1.png?1636989056629", id:"CachedBmp_1"},
		{src:"images/CachedBmp_57.png?1636989056629", id:"CachedBmp_57"},
		{src:"images/index_atlas_1.png?1636989056576", id:"index_atlas_1"},
		{src:"images/index_atlas_2.png?1636989056577", id:"index_atlas_2"},
		{src:"images/index_atlas_3.png?1636989056577", id:"index_atlas_3"},
		{src:"images/index_atlas_4.png?1636989056577", id:"index_atlas_4"},
		{src:"images/index_atlas_5.png?1636989056577", id:"index_atlas_5"},
		{src:"images/index_atlas_6.png?1636989056577", id:"index_atlas_6"},
		{src:"images/index_atlas_7.png?1636989056577", id:"index_atlas_7"},
		{src:"images/index_atlas_8.png?1636989056577", id:"index_atlas_8"},
		{src:"images/index_atlas_9.png?1636989056577", id:"index_atlas_9"},
		{src:"images/index_atlas_10.png?1636989056577", id:"index_atlas_10"},
		{src:"images/index_atlas_11.png?1636989056577", id:"index_atlas_11"},
		{src:"images/index_atlas_12.png?1636989056577", id:"index_atlas_12"},
		{src:"images/index_atlas_13.png?1636989056577", id:"index_atlas_13"},
		{src:"images/index_atlas_14.png?1636989056578", id:"index_atlas_14"},
		{src:"images/index_atlas_15.png?1636989056578", id:"index_atlas_15"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['AA90A61D973BC042AC0AE62308F30FCD'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}			
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;			
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});			
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;			
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;