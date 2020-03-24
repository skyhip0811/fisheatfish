var socket = io();
socket.emit('player_join','player ' +' join');

var speed = 0;
var rotation = 0;


if(window.DeviceOrientationEvent) {

  DeviceOrientationEvent.requestPermission()
.then(response => {
  if (response == 'granted') {
    window.addEventListener("deviceorientation", handleOrientation, true);
  }
})
.catch(console.error)
  


}else{
    document.querySelector('body').innerHTML = '你的瀏覽器不支援喔';
}





function handleOrientation(event) {
  var absolute = event.absolute;
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;
  speed = Math.cos(degrees_to_radians(beta))*30;
  rotation = gamma;

  // Do stuff with the new orientation data
document.getElementById('test').innerHTML  = [absolute,alpha,speed,gamma];

}

setInterval(()=>{
	socket.emit('update_position',{speed,rotation});
}, 100);

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}