// Forked from https://github.com/klokantech/gl-style-package-spec/blob/master/task/deploy.js
// and https://github.com/klokantech/gl-style-package-spec/blob/master/task/transform.js

var langFallback = require('./lang-fallback.js');
var fs = require('fs-extra');

var adjustStyle = function(opts) {

  var style = opts.style;

  delete style.created;
  delete style.draft;
  delete style.modified;
  delete style.owner;

  if (style.sources['openmaptiles']) {
    style.sources['openmaptiles'] = {
      "type": "vector",
      "url": "https://free.tilehosting.com/data/v3.json?key=RiS4gsgZPZqeeMlIyxFo"
    }
  }

  if(opts.needSprite) {
    style.sprite = "https://"+"TODO"+".github.io/"+"TODO"+"/sprite";
  } else {
    delete style.sprite;
  }

  style.glyphs = "https://free.tilehosting.com/fonts/{fontstack}/{range}.pbf?key=RiS4gsgZPZqeeMlIyxFo";

  var langCfg = opts.langCfg;
  if(langCfg) {
    langFallback.decorate(style, langCfg);
  }

};

var needSprite = fs.existsSync('src/Map/style/icons');

var stylePath = 'src/Map/style/style.json';
var styleStr = fs.readFileSync(stylePath, 'utf8');

var langCfgPath = 'src/Map/style/lang-fallback.json';
console.log(fs.existsSync(langCfgPath))
if(fs.existsSync(langCfgPath)) {
  var langCfgStr = fs.readFileSync(langCfgPath, 'utf8');
  var langCfg = JSON.parse(langCfgStr);
}

var style = JSON.parse(styleStr);
adjustStyle({
  style: style,
  needSprite: needSprite,
  langCfg: langCfg
});
fs.writeFileSync('public/mapboxstyle/style.json', JSON.stringify(style, null, 2), 'utf8');

var style = JSON.parse(styleStr);
adjustStyle({
  style: style,
  needSprite: needSprite
});
fs.writeFileSync('public/mapboxstyle/style-undecorated.json', JSON.stringify(style, null, 2), 'utf8');
