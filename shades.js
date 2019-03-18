qKit.init({border:{width:8,color:'#808080'}});

const suffusion = 160;

const cellSize = qKit.screen.width / suffusion;

const canvas = new Array(suffusion);// x=suffusion by y=suffusion by rgb=3
qKit.repeat(r =>
{
  canvas[r] = new Array(suffusion);

  qKit.repeat(c =>
  {
    canvas[r][c] = new Array(3);//rgb

    qKit.repeat(h =>
    {
      canvas[r][c][h] = 0;
    }, 3);//rgb
  }, suffusion);
}, suffusion);

const byteToHex = function(n)
{
  let x = '0';

  if(n < 16)
    x += n.toString(16);
  else
    x = n.toString(16);

  return x;
}

qKit.repeat(r =>
{
  qKit.repeat(c =>
  {
    qKit.draw.quad
    ({
      x:c*( cellSize),y:r*( cellSize),
      width:cellSize,height:cellSize,

      color:'#'+byteToHex(canvas[r][c][0])+
                byteToHex(canvas[r][c][1])+
                byteToHex(canvas[r][c][2]),//rgb by rows by columns

      group: 'matrix'
    });
  }, suffusion);
}, suffusion);

const matrix = qKit.groups('matrix');

const O = new Array(7);//shade; see initializations below
qKit.repeat(o =>
{
  O[o] = new Array(3);
}, suffusion);

//position; initially big, gray square in the middle
O[0][0] = Math.floor(suffusion*.25);//low x
O[1][0] = Math.floor(suffusion*.25);//low y
O[2][0] = Math.floor(suffusion*.75);//high x
O[3][0] = Math.floor(suffusion*.75);//high y
O[4][0] = 128;//r
O[5][0] = 128;//g
O[6][0] = 128;//b

//momentum; initially growing and brightening
O[0][1] =  1;//lx
O[1][1] =  1;//ly
O[2][1] = -1;//hx
O[3][1] = -1;//hy
O[4][1] =  1;//r
O[5][1] =  1;//g
O[6][1] =  1;//b

//momentum; initially tending to shrink and darken
O[0][2] = -.125;//lx
O[1][2] = -.125;//ly
O[2][2] =  .125;//hx
O[3][2] =  .125;//hy
O[4][2] = -.125;//r
O[5][2] = -.125;//g
O[6][2] = -.125;//b

const render = function()//draw shade on canvas and canvas on ("matrix") display
{
  qKit.repeat(r =>
  {
    qKit.repeat(c =>
    {
      qKit.repeat(h =>
      {
        canvas[O[1][0] + r][O[0][0] + c][h] = Math.floor((canvas[O[1][0] + r][O[0][0] + c][h]*.85 + .15*O[4 + h][0]));//85% transparent
      }, 3);//rgb

      matrix[((O[1][0] + r) * suffusion) + O[0][0] + c].color='#'+
        byteToHex(canvas[O[1][0] + r][O[0][0] + c][0])+
        byteToHex(canvas[O[1][0] + r][O[0][0] + c][1])+
        byteToHex(canvas[O[1][0] + r][O[0][0] + c][2]);
    }, O[2][0] - O[0][0]);//width of shade
  }, O[3][0] - O[1][0]);//height of shade
}

const realize = function()
{
  qKit.repeat(o =>
  {
    O[o][0] = Math.floor(O[o][0] + O[o][1]);//integrate momentum to position
    O[o][1] += O[o][2];//integrate forces to momentum

    O[o][2] = qKit.util.randomDouble(-.120,.130);//random force on momentum of about one-eighth, bias toward increase
  }, O.length);
}

const bound = function()
{
  //ensure higher position-value at higher index by swapping if needed (position and derivatives)
  if(O[0][0] > O[2][0])//low x vs. high x
  {
    let s = O[0][0];
            O[0][0] = O[2][0];
                      O[2][0] = s;
    s = O[0][1];
        O[0][1] = O[2][1];
                  O[2][1] = s;
    s = O[0][2];
        O[0][2] = O[2][2];
                  O[2][2] = s;
  }

  if(O[1][0] > O[3][0])//low y vs. high y
  {
    let s = O[1][0];
            O[1][0] = O[3][0];
                      O[3][0] = s;
    s = O[1][1];
        O[1][1] = O[3][1];
                  O[3][1] = s;
    s = O[1][2];
        O[1][2] = O[3][2];
                  O[3][2] = s;
  }

  //if any value goes negative, set it and forces to zero and (bounce) reverse momentum
  qKit.repeat(o =>
  {
    if(O[o][0] < 0)//if lower-bound
    {
      O[o][0] = 0;//bottom-out
      O[o][1] = -O[o][1];//(bounce) reverse momentum
      O[o][2] = qKit.util.randomDouble(-.125,.125);//random force on momentum of one-eighth
    }
  }, O.length);

  //if any value exceeds respective maximum, set it to max., forces to zero, and (bounce) reverse momentum
  qKit.repeat(o =>
  {
    if(O[o][0] > suffusion)//spatial coordinates max. at suffusion
    {
      O[o][0] = suffusion;//top-out
      O[o][1] = -O[o][1];//(bounce) reverse momentum
      O[o][2] = qKit.util.randomDouble(-.125,.125);//random force on momentum of one-eighth
    }
  }, 4);//spatial coordinates max. at suffusion

  qKit.repeat(o =>
  {
    if(O[o + 4][0]>255)//RGB max. at 255
    {
      O[o + 4][0] = 255;//top-out
      O[o + 4][1] = -O[o + 4][1];//(bounce) reverse momentum
      O[o + 4][2] = qKit.util.randomDouble(-.125,.125);//random force on momentum of one-eighth
    }
  }, 3);//RGB max. at 255

  //restrain spatial momentums that would leave gaps
  if(O[0][0] + O[0][1] > O[2][0])
  {
    O[0][1] = Math.sign(O[0][1])*.85;//restrain to 85% of pixel in current direction
    O[0][2] = qKit.util.randomDouble(-.25,.25);//random force on momentum of one-quarter
  }

  if(O[1][0] + O[1][1] > O[3][0])
  {
    O[1][1] = Math.sign(O[1][1])*.85;//restrain to 85% of pixel in current direction
    O[1][2] = qKit.util.randomDouble(-.25,.25);//random force on momentum of one-quarter
  }

  if(O[2][0] + O[2][1] < O[0][0])
  {
    O[2][1] = Math.sign(O[2][1])*.85;//restrain to 85% of pixel in current direction
    O[2][2] = qKit.util.randomDouble(-.25,.25);//random force on momentum of one-quarter
  }

  if(O[3][0] + O[3][1] < O[1][0])
  {
    O[3][1] = Math.sign(O[3][1])*.85;//restrain to 85% of pixel in current direction
    O[3][2] = qKit.util.randomDouble(-.25,.25);//random force on momentum of one-quarter
  }
}

qKit.update(() => 
{
  render();
  realize();
  bound();
});
