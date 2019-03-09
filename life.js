qKit.init({border:{width:8,color:'#824222'}});

const suffusion	=160;

var habitat=new Array(2);
habitat[0]=new Array(suffusion);
habitat[1]=new Array(suffusion);
for(var r=0;r<suffusion;r++)
{
	habitat[0][r]=new Array(suffusion);
	habitat[1][r]=new Array(suffusion);
}

var phase=0;
var auto=false;

function Random5050Habitat()
{
	for(var r=0;r<suffusion;r++)for(var c=0;c<suffusion;c++)
		habitat[phase][r][c]=Math.floor((Math.random()*2));
}

function PopulateOneWalker()
{
	var m=Math.floor(suffusion/2);

	for(var r=0;r<suffusion;r++)for(var c=0;c<suffusion;c++)habitat[phase][r][c]=0;

	habitat[phase][m-1][m+1]=1;
	habitat[phase][m  ][m+1]=1;
	habitat[phase][m+1][m+1]=1;
	habitat[phase][m+1][m  ]=1;
	habitat[phase][m  ][m-1]=1;
}

function ComputeNextPhase()
{
	for(var r=0;r<suffusion;r++)for(var c=0;c<suffusion;c++)
	{
		var a=0;for(var j=-1;j<=1;j++)for(var i=-1;i<=1;i++)if((i!=0)||(j!=0))
			a+=habitat[phase][(suffusion+r+j)%suffusion][(suffusion+c+i)%suffusion];

		habitat[(phase+1)%2][r][c]=(a==3 || (a==2 && habitat[phase][r][c]==1))?1:0;
	}
}

const cellSize	=qKit.screen.width/suffusion;
for(var r=0;r<suffusion;r++)for(var c=0;c<suffusion;c++)qKit.draw.quad
({
	x:c*(	cellSize),y:r*(	cellSize),
	width:	cellSize,height:cellSize,

	color:	0,

	group: 'matrix',
	extension:{id:`${r}-${c}`,}
});

const matrix=qKit.groups('matrix');

function RenderCurrentPhase()
{
	for(var i=0;i<matrix.length;i++)
		matrix[i].color=habitat[phase][Math.floor(i/suffusion)][i%suffusion]?'#D0FFC0':'#102040';
}

Random5050Habitat();
//PopulateOneWalker();
RenderCurrentPhase();

qKit.update(() => {if(auto){ComputeNextPhase();phase=(phase+1)%2;RenderCurrentPhase();}});
