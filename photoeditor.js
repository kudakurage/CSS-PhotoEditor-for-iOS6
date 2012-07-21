
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

