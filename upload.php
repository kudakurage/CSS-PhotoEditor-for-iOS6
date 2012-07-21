<?php
function img_upload($name, $uploadPath="./", $upImageName=false) {
  $type = $_FILES[$name]['type'];
  if( $type == "image/gif" ) {$tail = '.gif';
  }else if( $type == "image/jpeg" || $type == "image/jpg" || $type == "image/pjpeg" )  {$tail = '.jpg';
  }else if( $type == "image/png" || $type == "image/x-png" ) {$tail = '.png';
  }else {return false;}
  
  if($upImageName){
    $filename = $upImageName . $tail;
  }else{
    $filename = $name . $tail;
  }
  $fullname = $uploadPath . $filename;
  
  if( ! move_uploaded_file($_FILES[$name]['tmp_name'], $fullname) ) {
    return false;
  }
  
  switch ($type) {
    case 1 : ImageGIF($im_out, $src); break;
    case 2 : ImageJPEG($im_out, $src); break;
    case 3 : ImagePNG($im_out, $src); break;
  }
  
  return $filename;
}
$res = img_upload("image", "./images/", "upload");
if($res){
    $data = array('result' => true, 'filename' => $res);
}else{
    $data = array('result' => false);
}
header('Content-type: text/html');
echo json_encode($data);
?>