var socket = io();
socket.emit('player_join','player ' +' join');

var speed = 0;
var rotation = 0;




function onClick() {
  // feature detect
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(function(){
        
          window.addEventListener("deviceorientation", handleOrientation, true);
        
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
   if(window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);

    }else{
        document.querySelector('body').innerHTML = '你的瀏覽器不支援喔';
    }
  }
}


onClick();

function handleOrientation(event) {
  // var absolute = event.absolute;
  // var alpha    = event.alpha;
  // var beta     = event.beta;
  // var gamma    = event.gamma;
  // speed = Math.cos(degrees_to_radians(beta))*30;
  // rotation = gamma;

  // // Do stuff with the new orientation data
// document.getElementById('test').innerHTML  = [absolute,alpha,speed,gamma];

}

function handleJoystick(data){
  console.log(data);
  speed = data.force?data.force*10:0+10;
  rotation = -data.angle.radian;
  document.getElementById('test').innerHTML  = [JSON.stringify(data)];
}

setInterval(()=>{
	socket.emit('update_position',{speed,rotation});
}, 100);

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}
