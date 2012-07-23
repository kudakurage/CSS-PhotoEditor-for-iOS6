
///////////////////////////////////////////////////////// Init
var pe = {
  footerScrollLeft: 0,
  footerScrollTop: 0,
  orientation: 0,
  checkStyleContent: false
};
pe.menuLandscapeOffsetArray = {
  'saturate':80,
  'brightness':132,
  'contrast':184,
  'huerotate':236,
  'invert':288,
  'blur':340,
  'sepia':392,
  'grayscale':444,
  'opacity':496
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
  
  pe.debugCheck();
  if(pe.mobile){
    $('body').addClass('mobile');
  }
  if(window.navigator.standalone){
    pe.webapp = true;
    $('body').addClass('webapp');
  }
  
  pe.switchOrientation();
  $(window).resize(function(){
    pe.switchOrientation();
    pe.checkMenuScroll();
    if(pe.mobile){
      $('#disabled').css({'display':'block', 'opacity':0});
      var t = setTimeout(function(){
        $('#disabled').css({'display':'none', 'opacity':1});
      }, 0);
    }
  });
  
  if(!pe.mobile){
    $('#wrapper').addClass('start').append('<img src="images/iphone.png" id="iphone"><a href="#" onclick="pe.checkStyle();return false;" id="check-style-button">Check the style</a>');
    $('#wrapper').append('<div id="pc"><img src="images/logo.png" id="pc-logo"><p id="pc-text">CSS PhotoEditor is a test site for new features that will be installed in iOS6.<span>The browsers supported this site are Chrome19, Safari6 & iOS6.</span></p><a href="#" onclick="alert(\'show video\');" id="video"><img src="images/video.png"><span>DEMO on iOS simulator</span></a><ul id="features"><li class="upload">Input type=file</li><li class="filter">CSS Filters</li><li class="slider">Custom Slider UI</li><li class="font">Landscape Mode</li></ul><div class="profile"><a href="http://d.hatena.ne.jp/kudakurage/"><img src="images/profile.png" class="profile-image"></a><p class="profile-name">Kazuyuki Motoyama<span>Kudakurage</span></p><p class="profile-acount"><a href="https://twitter.com/kudakurage" class="twitter">twitter</a><a href="http://dribbble.com/kudakurage" class="dribbble">dribbble</a><a href="https://github.com/kudakurage" class="github">github</a></p><p class="profile-text">I have been working as a Web designer in Kyoto.<br />UI Design / App Design / Illustration / HTML5&CSS3 / Javascript / PHP</p><p class="copyright">Copyright &copy; 2012 kazuyuki motoyama</p></div></div>');
    $.get("images/iphone.png", function(){
      $('#wrapper').removeClass('start');
    });
  }
  
  $('#footer a').click(function(){
    pe.sliderReset(this);
    pe.menuSelected(this);
    return false;
  });
  
  $('#footer').scroll(function(){
    pe.checkMenuScroll();
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
    pe.startView1 = setTimeout(function(){
      pe.startView2 = setInterval(function(){
        var val = $('#saturate-slider input').attr('value');
        val = parseInt(val)+2;
        if(val >= 148){
          clearInterval(pe.startView2);
        }
        $('#saturate-slider input').attr('value',val);
        pe.filterValueArray['saturate'] = val;
        $('#saturate-slider output span').text(val);
        pe.setFilter();
      }, 0);
    }, 600);
  }, 1000);
});

///////////////////////////////////////////////////////// Function
pe.menuSelected = function(e){
  var id = $(e).attr('id');
  $(e).addClass('selected');
  if(pe.orientation == 0){
    var bgPositionLeft = -320 + pe.menuOffsetArray[id] - pe.footerScrollLeft;
    $('#slider').css('backgroundPosition', bgPositionLeft + 'px 0');
  }else if(pe.orientation == 1){
    if(pe.webapp){
      var webappOffset = 20;
    }else{
      var webappOffset = 0;
    }
    var sliderPositionTop = -25 +  webappOffset + pe.menuLandscapeOffsetArray[id] - pe.footerScrollTop;
    $('#slider').css('top', sliderPositionTop + 'px');
  }
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
  $('#photo img').addClass('animate');
  pe.setFilter();
  var t = setTimeout(function(){
    $('#photo img').removeClass('animate');
  }, 1000);
}
pe.checkMenuScroll = function(){
  pe.sliderBlur();
  pe.footerScrollLeft = $('#footer').scrollLeft();
  pe.footerScrollTop = $('#footer').scrollTop();
}
pe.checkStyle = function(){
  if(pe.checkStyleContent){
    pe.checkStyleContent.remove();
    pe.checkStyleContent = false;
  }else{
    pe.checkStyleContent = $('<div/>').attr('id','check-style-content').html('<h2>-webkit-filter:</h2><p>saturate(<span>'+ pe.filterValueArray["saturate"] +'%</span>)</p><p>brightness(<span>'+ pe.filterValueArray["brightness"] +'%</span>)</p><p>contrast(<span>'+ pe.filterValueArray["contrast"] +'%</span>)</p><p>hue-rotate(<span>'+ pe.filterValueArray["huerotate"] +'deg</span>)</p><p>invert(<span>'+ pe.filterValueArray["invert"] +'%</span>)</p><p>blur(<span>'+ pe.filterValueArray["blur"] +'px</span>)</p><p>sepia(<span>'+ pe.filterValueArray["sepia"] +'%</span>)</p><p>grayscale(<span>'+ pe.filterValueArray["grayscale"] +'%</span>)</p><p>opacity(<span>'+ pe.filterValueArray["opacity"] +'%</span>)</p>');
    pe.checkStyleContent.click(function(){
      pe.checkStyle();
    });
    $('#wrapper').append(pe.checkStyleContent);
  }
  return false;
}
pe.switchOrientation = function(){
  pe.windowWidth = $('#display').width();
  pe.windowHeight = $('#display').height();
  if(pe.windowWidth > pe.windowHeight){
    pe.orientation = 1;
  }else{
    pe.orientation = 0;
  }
  if(pe.orientation == 0){
    $("body").addClass("portrait");
    $("body").removeClass("landscape");
  }else if(pe.orientation == 1){
    $("body").addClass("landscape");
    $("body").removeClass("portrait");
  }
}
pe.debugCheck = function(){
  if(location.hash == '#dev' || location.hash == '#debug'){
    pe.debug = true;
  }else{
    pe.debug = false;
  }
}

