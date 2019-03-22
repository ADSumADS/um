qKit.init({border:{width:8,color:'#808080'}});

const suffusion = 192;

const cellSize = qKit.screen.width / suffusion;

qKit.repeat(r =>
{
  qKit.repeat(c =>
  {
    qKit.draw.quad
    ({
      //on odd rows, all but initial half-tile are offset by that half-width
      x: (c * cellSize) - (r & 1 == 1 && c > 0 ? cellSize >> 1 : 0),
      y: r * cellSize,
      //on odd rows, first tile is split with half at start, wrapping to extra half at end
      width:  cellSize >> (r & 1 == 1 && (c == 0 || c == suffusion + 1) ? 1 : 0),
      height: cellSize,

      color:  '#000000',

      group: 'matrix'
    });
  }, suffusion + (r & 1));//odd rows have extra half-tile to which first half-tile wraps
}, suffusion);

const matrix = qKit.groups('matrix');

//x & y coordinates translated to hexagonal position and then, in turn, index within matrix
//color in the RGB, hexadecimal form of a string as "#00C8FF" for blue-bias cyan
const colorTile = function(x,y,c)
{
  //the extra half-tile on odd-numbered rows creates a progressive offset
  let l = ((y % suffusion) * suffusion) + (x % suffusion) + (y >> 1);

  matrix[l].color = c;

  //wrap half-tiles at opposite sides
  if(x == 0 && y & 1 == 1)
    matrix[l + suffusion].color = c;
}

const clockfaceAdjustment = new Array(2);
clockfaceAdjustment[0] = new Array(4);//output-X adjustments
clockfaceAdjustment[0][0] = new Array(12);//input-X least-significant bit of 0, input-Y LSB=0, output-X adjustment for each clockface direction
clockfaceAdjustment[0][1] = new Array(12);//input-X least-significant bit of 1, input-Y LSB=0, output-X adjustment for each clockface direction
clockfaceAdjustment[0][2] = new Array(12);//input-X least-significant bit of 0, input-Y LSB=1, output-X adjustment for each clockface direction
clockfaceAdjustment[0][3] = new Array(12);//input-X least-significant bit of 1, input-Y LSB=1, output-X adjustment for each clockface direction
clockfaceAdjustment[1] = new Array(4);//output-Y adjustments
clockfaceAdjustment[1][0] = new Array(12);//input-X LSB=0, input-Y LSB=0, output-Y adjustments
clockfaceAdjustment[1][1] = new Array(12);//input-X LSB=1, input-Y LSB=0, output-Y adjustments
clockfaceAdjustment[1][2] = new Array(12);//input-X LSB=0, input-Y LSB=1, output-Y adjustments
clockfaceAdjustment[1][3] = new Array(12);//input-X LSB=1, input-Y LSB=1, output-Y adjustments

//set X & Y adjustments for each clockface direction w.r.t. LSB of starting X & Y
qKit.repeat(d => 
{
  qKit.repeat(a => 
  { //default decrement
    clockfaceAdjustment[0][a][d] = clockfaceAdjustment[1][a][d] = -1;

    //increase X for most even cases at right of clock
    if(d == 3 || (d < 6 && d !=3 && a < 3))
      clockfaceAdjustment[0][a][d] = 1;

    //no adjustments to X for most evens to the left and odds to the right
    if((a < 2 && (d + 11) % 12 > 4 && d != 9) || (a > 1 &&  d < 7 && d != 3))
      clockfaceAdjustment[0][a][d] = 0;

    //no adjustments to Y for directly flat horizontals
    if(d == 3 || d == 9)
      clockfaceAdjustment[1][a][d] = 0;

    //Y increases for most cases at bottom of clock
    if(d > 3 && d < 9)
      clockfaceAdjustment[1][a][d] = 1;
  }, 4);
}, 12);

//continued: oblique (non-hexagonal) directions stay flat for an extra step
clockfaceAdjustment[1][0][ 2] = 0;
clockfaceAdjustment[1][1][ 4] = 0;
clockfaceAdjustment[1][2][10] = 0;
clockfaceAdjustment[1][3][ 8] = 0;

/*
attrib.:0	1	2	3	0	1	2	3

dir. |	x	x	x	x	y	y	y	y
____ |______________________________________________________________
 3	 1	 1	 1	 1	 0	 0	 0	 0
 9	-1	-1	-1	-1	 0	 0	 0	 0
11	 0	 0	-1	-1	-1	-1	-1	-1
10	 0	 0	-1	-1	-1	-1	 0	-1
 8	 0	 0	-1	-1	 1	 1	 1	 0
 7	 0	 0	-1	-1	 1	 1	 1	 1
 6	 0	 0	 0	 0	 1	 1	 1	 1
 0	 0	 0	 0	 0	-1	-1	-1	-1
 1	 1	 1	 0	 0	-1	-1	-1	-1
 2	 1	 1	 0	 0	 0	-1	-1	-1
 4	 1	 1	 0	 0	 1	 0	 1	 1
 5	 1	 1	 0	 0	 1	 1	 1	 1
*/

const byteToHex = function(n)
{
  let x = '0';

  if(n < 16)
    x += n.toString(16);
  else
    x = n.toString(16);

  return x;
}

//sample use of clockface-adjustment walk in the form of a spiral
let x = (suffusion >> 1) + 3;
let y = (suffusion >> 1) - 3;

qKit.repeat(i => 
{//rotation
  qKit.repeat(z =>
  {//length of walk along leg at the given direction
    let c = '#' 
      + byteToHex(255 * (i % 3 != 2 ? 1 : 0)) 
      + byteToHex(255 * (i % 3 != 1 ? 1 : 0)) 
      + byteToHex(255 * (i % 3 != 0 ? 1 : 0));

    let a = ((y & 1) << 1) | (x & 1);

    x += clockfaceAdjustment[0][a][i % 12]; 
    x = (x + suffusion) % suffusion;

    y += clockfaceAdjustment[1][a][i % 12]; 
    y = (y + suffusion) % suffusion;

    colorTile(x,y,c);
  }, i + 1);
}, 72);
