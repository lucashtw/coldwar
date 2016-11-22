/*global Scenes:true, Actors:true */
/*jshint browser:true */
/*jshint strict:false */
/*jshint latedef:false */

Scenes.story = function(env, opts){
  this.env = env;
  this.opts = this.genOpts(opts);
  this.attrs = this.genAttrs();
  this.init();
};

Scenes.story.prototype = Object.create(Scene.prototype);

Scenes.story.prototype.title = 'Story';

Scenes.story.prototype.layout = '';

Scenes.story.prototype.init = function(){

  this.maze = new Actors.TitleMaze(
    this.env, {
      scene: this
    }, {
      rows: 16,
      cols: 16,
    }, {
    })

}

Scenes.story.prototype.getCast = function(){
  return {
    TitleMaze: Actors.TitleMaze,
    TitleCell: Actors.TitleCell,
  }
};

Scenes.story.prototype.defaults = [{
  key: 'max_x',
  value: 640,
  min: 32,
  max: 1024
}, {
  key: 'max_y',
  value: 360,
  min: 32,
  max: 768
}, {
  key: 'max_z',
  value: 1,
  min: 1,
  max: 1
}, {
  key: 'step_delay',
  value: 1,
  min: 1,
  max: 120
}, {
  key: 'step_hold',
  value: 2,
  min: 1,
  max: 1000
}, {
  key: 'step_skip',
  value: 0.25,
  min: 1,
  max: 20
}, {
  key: 'frame_hold',
  value: 180,
  min: 1,
  max: 2400
}, {
  key: 'font-size',
  value: 24,
  min: 8,
  max: 64
}];

Scenes.story.prototype.genAttrs = function(){
  return {
    frame_index: 0,
    step_index: 0,
    time: 0,
    hold: 0,
  };
};

Scenes.story.prototype.update = function(delta){

  this.maze.update(delta);

  if(this.attrs.hold > 0){
    this.attrs.hold -= delta;
    if(this.attrs.hold <= 0){
      this.attrs.hold = 0;
      this.attrs.step_index = 0;
      this.attrs.frame_index ++;
      // if(this.attrs.frame_index === Scenes.story.prototype.frames.length){
      //   this.attrs.frame_index = 0;
      // }
    }
  } else if(this.attrs.frame_index < Scenes.story.prototype.frames.length) {
    this.attrs.time += this.env.diff * 100;
    if (this.attrs.time > this.opts.step_hold) {
      this.attrs.time = 0;
      this.attrs.step_index += this.opts.step_skip;
      if (this.attrs.step_index >= Scenes.story.prototype.frames[this.attrs.frame_index].text.length) {
        this.attrs.hold = this.opts.frame_hold;
      }
    }
  }
  
}

Scenes.story.prototype.paint = function(fx, gx, sx){

  this.maze.paint(gx)

  gx.ctx.fillStyle = 'rgba(0,0,0,0.35)';
  gx.ctx.fillStyle = 'rgba(0,0,0,0.35)';
  gx.ctx.beginPath()
  gx.ctx.fillRect(0, 0, this.opts.max_x, this.opts.max_y)

  var frame;
  if(this.attrs.frame_index < Scenes.story.prototype.frames.length){
    frame = Scenes.story.prototype.frames[this.attrs.frame_index];
  }

  if(!frame){
    return;
  }

  var ix = this.attrs.step_index;
  if(ix >= frame.text.length){
    ix = frame.text.length;
  }
  
  var yy = (this.opts.max_y * 0.2);
  var dy = (this.opts.max_y * 0.066);
  var xx = (this.opts.max_x * 0.01);
  var dx = (this.opts.max_x * 0.03) + Math.random() * 0.1;
  var x, y;

  y = 0;
  x = 0;

  fx.ctx.fillStyle = '#f00';
  fx.ctx.font = '18pt robotron';

  if(Math.random() < 0.5){
    fx.ctx.save();
    fx.ctx.translate(this.opts.max_x * 0.1, this.opts.max_y * 0.1);

    if(Math.random() < 0.1){
      fx.ctx.translate(0, ((Math.random()-0.5))*this.opts.max_y * 0.5)
    }
    
    for (var i = 0; i < ix; i++) {
      if(frame.text[i] === "\n"){
        y ++;
        x = 0;
        continue;
      }
      fx.ctx.save();
      fx.ctx.translate(Math.random() - 0.5, Math.random() - 0.5);
      fx.ctx.fillText(frame.text[i], xx + (x * dx), yy + (y * dy));
      fx.ctx.restore();
      x ++;
    }
    fx.ctx.restore();
  }
 
  y = 0;
  x = 0;
  //gx.ctx.font = this.opts.font_size + '28pt ubuntu mono';
  gx.ctx.font = '16pt robotron';
 
  gx.ctx.save();
  gx.ctx.translate(this.opts.max_x * 0.1, this.opts.max_y * 0.1);

  var h = (Date.now()%360 * 0.22) - 10;
  gx.ctx.fillStyle = 'hsl(' + h + ', 100%, 50%)';
  
  if(Math.random() < 0.025){
    gx.ctx.fillStyle = 'rgba(255,255,0,0.5)';
    gx.ctx.translate(0, ((Math.random()-0.5))*this.opts.max_y * 0.5)
  }

  if(Math.random() < 0.025){
    gx.ctx.fillStyle = 'rgba(255,255,255,1)';
    gx.ctx.translate(0, ((Math.random()-0.5))*this.opts.max_y * 0.5)
  }

  if(Math.random() < 0.025){
    gx.ctx.fillStyle = 'rgba(255,255,255,1)';
    gx.ctx.translate(((Math.random()-0.5))*this.opts.max_y * 0.5, 0)
  }

  if(Math.random() < 0.025){
    gx.ctx.fillStyle = 'rgba(255,255,255,1)';
    gx.ctx.translate(((Math.random()-0.5))*this.opts.max_y * 0.25, 0)
  }
  
  for (var i = 0; i < ix; i++) {
    if(frame.text[i] === "\n"){
      y ++;
      x = 0;
      continue;
    }
    gx.ctx.save();
    gx.ctx.translate(Math.random() - 0.5, Math.random() - 0.5);
    gx.ctx.fillText(frame.text[i], xx + (x * dx), yy + (y * dy));
    gx.ctx.restore();
    x ++;
  }
  gx.ctx.restore();
  
}

Scenes.story.prototype.frames = [];

Scenes.story.prototype.frames.push({
  text:[
    'THE YEAR IS 2048',
  ].join("\n")
})

Scenes.story.prototype.frames.push({
  text:[
    '30 years ago we ',
    'outsourced the very ',
    'runnings of our',
    'lives to Machines.'
  ].join("\n")
})

Scenes.story.prototype.frames.push({
  text:[
    'Machines that learn.',
  ].join("\n")
})

Scenes.story.prototype.frames.push({
  text:[
    'The Machines learnt',
    '   ',
    '...too well.'
  ].join("\n")
})

Scenes.story.prototype.frames.push({
  text:[
    'Today, all computing',
    'resource on the planet',
    'has been consolidated',
    'in a vast Maze, hewn',
    'out of solid rock.'
  ].join("\n")
})


Scenes.story.prototype.frames.push({
  text:[
    'No humans have access',
    'to The Maze, but the',
    'warm glow of it\'s',
    'reactors make an',
    'ideal home for',
    'millions of flesh',
    'eating RATS.'
  ].join("\n")
})


Scenes.story.prototype.frames.push({
  text:[
    'Your mission is to ',
    'enter The Maze, sabotage',
    'the power source of',
    'The Machines and free',
    'the Human Race from ',
    'it\'s self inflicted,',
    'automated prison.',
  ].join("\n")
})

Scenes.story.prototype.frames.push({
  text:[
    'You are our last best hope,',
    '     ',
    'but until today',
    'no Human has survived...',
 ].join("\n")
})
