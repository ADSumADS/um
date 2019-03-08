qKit.init({border:{width:10,color:'#824222',}});

const numCols	=42;
const numRows	=numCols;
const cellSize	=qKit.screen.width/numRows;

var habitat=new Array(2);

habitat[0]=new Array(numRows);
habitat[1]=new Array(numRows);

var phase=0;

for(var r=0;r<numRows;r++)
{
	habitat[0][r]=new Array(numCols);
	habitat[1][r]=new Array(numCols);

	for(var c=0;c<numCols;c++)
		habitat[phase][r][c]=Math.floor((Math.random()*2));
}

for(var r=0;r<numRows;r++)for(var c=0;c<numRows;c++)qKit.draw.quad
({
	x:c*(	cellSize),y:r*(	cellSize),
	width:	cellSize,height:cellSize,

	color:	0,

	group: 'matrix',
	extension:{id:`${r}-${c}`,}
});

const matrix=qKit.groups('matrix');

qKit.update(() => 
{
	for(var r=0;r<numRows;r++)for(var c=0;c<numCols;c++)
	{
		var a=0;for(var j=-1;j<=1;j++)for(var i=-1;i<=1;i++)if((i!=0)||(j!=0))
			a+=habitat[phase][(numRows+r+j)%numRows][(numCols+c+i)%numCols];

		habitat[(phase+1)%2][r][c]=(a==3 || (a==2 && habitat[phase][r][c]==1))?1:0;
	}

	phase=(phase+1)%2;

	for(var i=0;i<matrix.length;i++)
		matrix[i].color=habitat[phase][Math.floor(i/numRows)][i%numCols]?'#C0FFC0':'#000000';
});
