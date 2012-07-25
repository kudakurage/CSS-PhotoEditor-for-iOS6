
///////////////////////////////////////////////////////// Init
var pe = {
  footerScrollLeft: 0,
  footerScrollTop: 0,
  orientation: 0,
  dblTap: false,
  captureModeStatus: false,
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


///////////////////////////////////////////////////////// Bind Evnet
$(function(){
  
  pe.init();
  
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
  
  $('#photo img').dblclick(function(){
    pe.captureMode();
  });
  $('#photo img').bind('touchend',function(){
    if(pe.dblTap){
      pe.captureMode();
      pe.dblTap = false;
    }else{
      pe.dblTap = true;
    }
    setTimeout(function(){
      pe.dblTap = false;
    },500);
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
        pe.resetFilter();
      }else{
        alert('Sorry, upload failed.');
      }
    }, 'json');
  });
  
  $('#force-webapp').toggle(function(){
    $(this).addClass('on').text('ON');
    setTimeout(function(){
      $('body').addClass('fullscreen');
    }, 350);
  }, function(){
    $(this).removeClass('on').text('OFF');
    setTimeout(function(){
      $('body').removeClass('fullscreen');
    }, 350);
  });
});

///////////////////////////////////////////////////////// Function
pe.init = function(){
  if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0) {
    pe.mobile = true;
    document.title='PhotoEditor';
    if(navigator.userAgent.indexOf('iPhone OS 6') == -1){
      pe.osAlert = $('<div/>').attr('id', 'os-alert').html('<div><p>This app will work correctly only on the iOS6!</p><span>Tap and close</span></div>').click(function(){$(this).hide();});
      $('#display').append(pe.osAlert);
    }
  }
  if(pe.mobile){
    $('body').addClass('mobile');
  }
  if(window.navigator.standalone){
    pe.webapp = true;
    $('body').addClass('webapp');
  }
  pe.switchOrientation();
  if(!pe.mobile){
    $('#wrapper').addClass('start').append('<img src="images/iphone.png" id="iphone"><a href="#" onclick="pe.checkStyle();return false;" id="check-style-button">Check the style</a>');
    $('#wrapper').append('<div id="pc"><img src="images/logo.png" id="pc-logo"><p id="pc-text">CSS PhotoEditor is a test site for new features that will be installed in iOS6.<span>The browsers supported this site are Chrome20, Safari6 & iOS6. <a href="http://d.hatena.ne.jp/kudakurage/">Learn more about this page</a></span></p><a href="#" onclick="pe.showVideo();return false;" id="video"><img src="images/video.png"><span>DEMO on iOS simulator</span></a><ul id="features"><li class="upload">Input type=file</li><li class="filter">CSS Filters</li><li class="slider">Custom Slider UI</li><li class="font">Landscape Mode</li></ul><div class="profile"><a href="http://d.hatena.ne.jp/kudakurage/"><img src="images/profile.png" class="profile-image"></a><p class="profile-name">Kazuyuki Motoyama<span>Kudakurage</span></p><p class="profile-acount"><a href="https://twitter.com/kudakurage" class="twitter">twitter</a><a href="http://dribbble.com/kudakurage" class="dribbble">dribbble</a><a href="https://github.com/kudakurage" class="github">github</a></p><p class="profile-text">I have been working as a Web designer in Kyoto.<br />UI Design / App Design / Illustration / HTML5&CSS3 / Javascript / PHP</p><p class="copyright">Copyright &copy; 2012 kazuyuki motoyama</p></div></div>');
    pe.videoWindow = $('<div/>').attr('id','video-window').click(function(){pe.hideVideo();});
    $('body').append(pe.videoWindow);
  }
  $.get("images/sample.png", function(){
    $('#wrapper').removeClass('start');
    //StartView - start
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
    //StartView - end
  });
  pe.debugCheck();
}

pe.menuSelected = function(e){
  var id = $(e).attr('id');
  $(e).addClass('selected');
  if(pe.orientation == 0){
    var menuLeftMargin = parseInt($('#footer menu').css('marginLeft'));
    var bgPositionLeft = -320 + menuLeftMargin + pe.menuOffsetArray[id] - pe.footerScrollLeft;
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

pe.captureMode = function(){
  pe.photoWidth = $('#photo img')[0].naturalWidth;
  pe.photoHeight = $('#photo img')[0].naturalHeight;
  pe.photoDisplayWidth = $('#photo img').width();
  pe.photoDisplayHeight = $('#photo img').height();
  $('#photo img').addClass('animate');
  var t = setTimeout(function(){
    $('#photo img').removeClass('animate');
  }, 1000);
  if(pe.captureModeStatus){
    $('#photo img').css('webkitTransform', 'scale(1)');
    $('#refresh, #info, #footer').fadeIn(400);
    pe.captureModeStatus = false;
  }else{
    if(pe.photoWidth > pe.windowWidth && pe.photoHeight > pe.windowHeight){
      if(pe.photoWidth / pe.photoHeight > pe.windowWidth / pe.windowHeight){
        var zoom = pe.windowHeight / pe.photoDisplayHeight;
        $('#photo img').css('webkitTransform', 'scale('+zoom+')');
      }else{
        var zoom = pe.windowWidth / pe.photoDisplayWidth;
        $('#photo img').css('webkitTransform', 'scale('+zoom+')');
      }
    }
    pe.sliderBlur();
    $('#refresh, #info, #footer').fadeOut(400);
    pe.captureModeStatus = true;
  }
}

pe.showVideo = function(){
  $(pe.videoWindow).html('<div id="video-content"><iframe width="640" height="360" src="http://www.youtube.com/embed/Z5bFwu5WSeg?rel=0&autoplay=1&controls=0&showinfo=0" frameborder="0" allowfullscreen></iframe></div>');
  $('#video-window').addClass('show');
  return false;
}
pe.hideVideo = function(){
  $('#video-window').removeClass('show').delay(700).html('');
}

pe.debugCheck = function(){
  if(location.hash == '#dev' || location.hash == '#debug'){
    pe.debug = true;
  }else{
    pe.debug = false;
  }
}

