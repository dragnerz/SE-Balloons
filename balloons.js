// SE Party Balloons
//
// written by Ky/dragnerz
//
// built using ComfyJS: https://github.com/instafluff/ComfyJS
// Balloon HTML Canvas code by Logan Franken: https://www.loganfranken.com/blog/64/html5-canvas-balloon/


const TWITCHUSER = "{{username}}"
const OAUTH_USER = "{{ouath}}"

let color_list = [{{listColors}}];

String.prototype.convertToRGB = function() {
    if(this.length != 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = this.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];
    return aRgb;
}

function getRandID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function createCanvasHTMLTag(canvasID) {
  return '<canvas class="canvas_style" id="' + canvasID + '" width="1920px" height="1080px"></canvas>';
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function drawBalloon(username, color="000000") {
  
  const canvasID = getRandID();
  $('#canvas_folder').append(createCanvasHTMLTag(canvasID));
  
  let colorRGB = color.convertToRGB();
  if ("{{colorDropdown}}" === "optionB") {
    const tempFontColor = "{{fontColor}}".replace('#', '');
    colorRGB = tempFontColor.convertToRGB();
  } else {
    colorRGB = color.convertToRGB();
  }
  let colorRGBString = "rgba(" + colorRGB[0] + "," + colorRGB[1] + "," + colorRGB[2] + ",";
  
  // Initial Positions
  let xPos = 960;
  if (Math.random() >= 0.5) {
    xPos = randomIntFromInterval(100,700);
  } else {
    xPos = randomIntFromInterval(1200,1800); 
  }
  let yPos = 1200; 
  let alpha = randomIntFromInterval(parseInt("{{opacityMin}}"),parseInt("{{opacityMax}}"))/100;
  let speed = randomIntFromInterval(parseInt("{{speedMin}}"),parseInt("{{speedMax}}"))/100;
  let radius = randomIntFromInterval(parseInt("{{sizeMin}}"),parseInt("{{sizeMax}}"));
  
  let KAPPA = (4 * (Math.sqrt(2) - 1))/3;
  let handleLength = KAPPA * radius;
  let heightDiff = (radius * 0.4);  
  

      function update() {
        let context_name = $('#' + canvasID)[0].getContext("2d");
        context_name.clearRect(0, 0, 1920, 1080);
        
        const alpha_change = parseFloat("{{nameFade}}");

        // Begin balloon path
        context_name.beginPath();
        
        let balloonBottomY = yPos + radius + heightDiff;
        
        // Top Left Curve        
        let topLeftCurveStartX = xPos - radius;
        let topLeftCurveStartY = yPos;

        let topLeftCurveEndX = xPos;
        let topLeftCurveEndY = yPos - radius;
        
        context_name.moveTo(topLeftCurveStartX, topLeftCurveStartY);
        context_name.bezierCurveTo(topLeftCurveStartX, topLeftCurveStartY - handleLength,
                    topLeftCurveEndX - handleLength, topLeftCurveEndY,
                    topLeftCurveEndX, topLeftCurveEndY);
        
        // Top Right Curve
	
        let topRightCurveStartX = xPos;
        let topRightCurveStartY = yPos - radius;

        let topRightCurveEndX = xPos + radius;
        let topRightCurveEndY = yPos;

        context_name.bezierCurveTo(topRightCurveStartX + handleLength, topRightCurveStartY,
                    topRightCurveEndX, topRightCurveEndY - handleLength,
                    topRightCurveEndX, topRightCurveEndY);
        
        // Bottom Right Curve
	
        let bottomRightCurveStartX = xPos + radius;
        let bottomRightCurveStartY = yPos;

        let bottomRightCurveEndX = xPos;
        let bottomRightCurveEndY = balloonBottomY;

        context_name.bezierCurveTo(bottomRightCurveStartX, bottomRightCurveStartY + handleLength,
                    bottomRightCurveEndX + handleLength, bottomRightCurveEndY,
                    bottomRightCurveEndX, bottomRightCurveEndY);	

        // Bottom Left Curve
	
        let bottomLeftCurveStartX = xPos;
        let bottomLeftCurveStartY = balloonBottomY;

        let bottomLeftCurveEndX = xPos - radius;
        let bottomLeftCurveEndY = yPos;

        context_name.bezierCurveTo(bottomLeftCurveStartX - handleLength, bottomLeftCurveStartY,
                    bottomLeftCurveEndX, bottomLeftCurveEndY + handleLength,
                    bottomLeftCurveEndX, bottomLeftCurveEndY);
        
        context_name.fillStyle = colorRGBString + alpha + ")";
        context_name.shadowColor="{{shadowColor}}";
		context_name.shadowBlur="{{shadowBlur}}";
        context_name.fill();
        
        yPos = yPos - speed;    

        if (yPos > -200) {
          requestAnimationFrame(update);
        } else {
          $('#' + canvasID).remove();
        }
      }
      update();

}


ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if ("{{privileges}}" === "everybody" && command.toLowerCase() === "{{chatCommand}}".toLowerCase()) {
    drawBalloon(user, extra.userColor.substring(1));
      }
  if ("{{privileges}}" === "subs" && ( flags.subscriber && command.toLowerCase() === "{{chatCommand}}".toLowerCase())) {
    drawBalloon(user, extra.userColor.substring(1));
      }
  if ("{{privileges}}" === "vips" && ( ( flags.subscriber || flags.vip ) && command.toLowerCase() === "{{chatCommand}}".toLowerCase())) {
    drawBalloon(user, extra.userColor.substring(1));
      }
  if ("{{privileges}}" === "mods" && ( flags.mod && command.toLowerCase() === "{{chatCommand}}".toLowerCase())) {
    drawBalloon(user, extra.userColor.substring(1));
      }
  if( flags.broadcaster && command.toLowerCase() === "{{chatCommand}}".toLowerCase() ) {
    drawBalloon(user, extra.userColor.substring(1)); 
  }
}

ComfyJS.onReward = ( user, reward, cost, extra ) => {
  if ( reward.toLowerCase() === "{{redemptionName}}".toLowerCase() ) {
    drawBalloon(user, color_list[Math.floor(Math.random()*color_list.length)]);  
  }
}

ComfyJS.Init(TWITCHUSER, OAUTH_USER);
