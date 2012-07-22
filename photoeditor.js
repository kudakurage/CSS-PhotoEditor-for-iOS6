
///////////////////////////////////////////////////////// Init
var pe = {
  footerScroll: 0
};
pe.menuOffsetArray = {
  'saturate':109,
  'brightness':175,
  'contrast':241,
  'huerotate':307,
  'invert':373,
  'blur':439,
  'sepia':505,
  'grayscale':571,
  'opacity':638
};
pe.filterInitArray = {
  'saturate':100,
  'brightness':0,
  'contrast':100,
  'huerotate':0,
  'invert':0,
  'blur':0,
  'sepia':0,
  'grayscale':0,
  'opacity':100
};
pe.filterValueArray = {
  'saturate':100,
  'brightness':0,
  'contrast':100,
  'huerotate':0,
  'invert':0,
  'blur':0,
  'sepia':0,
  'grayscale':0,
  'opacity':100
};

if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
  pe.mobile = true;
  document.title='PhotoEditor';
}

///////////////////////////////////////////////////////// Bind Evnet
$(function(){
  
  if(!pe.mobile){
    $('#wrapper').addClass('start').append('<img src="images/iphone.png" id="iphone">');
    $('#wrapper').append('<div id="pc"><img src="images/logo.png" id="pc-logo"><p id="pc-text">CSS PhotoEditor is a test site for new features that will be installed in iOS6.</p><a href="#" onclick="alert(\'show video\');" id="video"><img src="images/video.png"><span>DEMO on iOS simulator</span></a><ul id="features"><li class="upload">Input type=file</li><li class="filter">CSS Filters</li><li class="slider">Custom Slider UI</li><li class="font">Ligature Symbols</li></ul><div class="profile"><a href="http://d.hatena.ne.jp/kudakurage/"><img src="images/profile.png" class="profile-image"></a><p class="profile-name">Kazuyuki Motoyama<span>Kudakurage</span></p><p class="profile-acount"><a href="https://twitter.com/kudakurage" class="twitter">twitter</a><a href="http://dribbble.com/kudakurage" class="dribbble">dribbble</a><a href="https://github.com/kudakurage" class="github">github</a></p><p class="profile-text">I have been working as a Web designer in Kyoto.<br />UI Design / App Design / Illustration / HTML5&CSS3 / Javascript / PHP</p><p class="copyright">Copyright &copy; 2012 kazuyuki motoyama</p></div></div>');
    pe.startViewWrapper = setTimeout(function(){
      $('#wrapper').removeClass('start');
    }, 600);
  }
  
  $('#footer a').click(function(){
    pe.sliderReset(this);
    pe.menuSelected(this);
    return false;
  });
  
  $('#footer').scroll(function(){
    pe.sliderBlur();
    pe.footerScroll = $(this).scrollLeft();
  });
  
  $('#slider input[type="range"]').change(function(){
    var filterName = $(this).attr('name');
    var filterValue = $(this).attr('value');
    pe.filterValueArray[filterName] = filterValue;
    $('#'+filterName+'-slider output span').text(filterValue);
    pe.setFilter();
  });
  
  $('#refresh').click(function(){
    pe.sliderBlur();
    pe.resetFilter();
    return false;
  });
  
  $('#info').click(function(){
    pe.sliderBlur();
    $('#display').addClass('flip');
    return false;
  });
  
  $('#back').click(function(){
    $('#display').removeClass('flip');
    return false;
  });
  
  $('#photo').click(function(){
    pe.sliderBlur();
    return false;
  });
  
  $('input[type=file]').click(function(){
    pe.sliderBlur();
  });
  $('input[type=file]').change(function() {
    if(pe.mobile){
      $('#disabled').css('display','-webkit-box');
    }else{
      $('#disabled').show();
    }
    $(this).upload('upload.php', function(res) {
      $('#disabled').hide();
      if(res.result){
        $('#photo img').attr('src', 'images/'+res.filename);
      }
    }, 'json');
  });
  
  //StartView
  pe.startView = setTimeout(function(){
    pe.menuSelected($('#saturate'));
  }, 1600);
});

///////////////////////////////////////////////////////// Function
pe.menuSelected = function(e){
  var id = $(e).attr('id');
  var bgPositionLeft = -320 + pe.menuOffsetArray[id] - pe.footerScroll;
  $(e).addClass('selected');
  $('#slider').css('backgroundPosition', bgPositionLeft + 'px 0');
  $('#slider').attr('class',id);
  $('#slider').fadeIn(300);
};
pe.sliderReset = function(e){
  $('#footer a').removeClass('selected');
  $('#slider').attr('class','');
};
pe.sliderBlur = function(e){
  pe.sliderReset(e);
  $('#slider').fadeOut(300);
};

pe.setFilter = function(){
  $('#photo img').attr('style','-webkit-filter:saturate('+ pe.filterValueArray["saturate"] +'%) brightness('+ pe.filterValueArray["brightness"] +'%) contrast('+ pe.filterValueArray["contrast"] +'%) hue-rotate('+ pe.filterValueArray["huerotate"] +'deg) invert('+ pe.filterValueArray["invert"] +'%) blur('+ pe.filterValueArray["blur"] +'px) sepia('+ pe.filterValueArray["sepia"] +'%) grayscale('+ pe.filterValueArray["grayscale"] +'%) opacity('+ pe.filterValueArray["opacity"] +'%)');
}

pe.resetFilter = function(){
  for(key in pe.filterInitArray){
    $('#'+key+'-slider input').attr('value',pe.filterInitArray[key]);
    $('#'+key+'-slider output span').text(pe.filterInitArray[key]);
    pe.filterValueArray[key] = pe.filterInitArray[key];
  }
  pe.setFilter();
}

