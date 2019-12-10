const storyPost = document.querySelector( '.story-post' ),
      downloadImage = document.querySelector( '.downloadImage' ),
      btnClearCanvas = document.querySelector( '.clearCanvas' ),
      undoButton = document.querySelector( '.undo' ),
      redoButton = document.querySelector( '.redo' ),
      eraserButton = document.querySelector( '.eraser' ),
      brushColor = document.querySelector( '.brushColor' ),
      brushSizeContainer = document.querySelector( '.brushSizeContainer' ),
      brushSizeContainer_input = document.querySelector( '.brushSizeContainer input' ),
      brushSizeContainer_num = document.querySelector( '.brushSizeContainer span ' ),
      sizeButtons = document.querySelector( '.sizeButtons' ),
      colorButtons = document.querySelector( '.colorButtons' ),
      canvas = document.querySelector( 'main canvas' ),
      ctx = canvas.getContext( '2d' )

const sizes = [ 1, 5, 10, 12, 15, 20 ],
      colors = [
          '#ff5252', '#fff885', '#93c9fb',
          '#97e5bd', '#ad8600', '#b5089f',
          '#2b857e', '#000000', '#003ba6',
          '#f1872a', '#c6e9e9', '#707070',
          '#aaaaaa', '#5200a6', '#f093e2'
      ]

let painting = false,
    size = 15, 
    currentBrashColor = '#00a651', 
    memory = [],
    memory2 = []

for ( let i = 0; i < sizes.length; i++ ) {
    let btn = document.createElement( 'button' )
    btn.addEventListener( 'click', () => {
        size = sizes[ i ]
        brushSizeContainer_input.value = sizes[ i ]
        brushSizeContainer_num.innerText = sizes[ i ]
    } )
    btn.innerText = sizes[ i ]
    sizeButtons.appendChild( btn )
}

for ( let i = 0; i < colors.length; i++ ) {
    let btn = document.createElement( 'button' )
    btn.addEventListener( 'click', () => {
        currentBrashColor = colors[ i ]
        brushColor.value = colors[ i ]
        if ( !eraserButtonFlag ) eraserButton.classList.remove( 'eraserActive' )
    } )
    btn.style.background = colors[ i ]
    colorButtons.appendChild( btn )
}

brushSizeContainer_input.addEventListener( 'mousemove', () => {
    brushSizeContainer_num.innerText = brushSizeContainer_input.value
    size = +brushSizeContainer_input.value
} )

brushColor.addEventListener( 'change', () => {
    currentBrashColor = brushColor.value
    eraserButton.classList.remove( 'eraserActive' ) 
    eraserButtonFlag = true
} )

let eraserButtonFlag = true, lastColor
    eraserButton.addEventListener( 'click', () => {
    if ( eraserButtonFlag ) {
        lastColor = currentBrashColor
        currentBrashColor = 'white'
        eraserButtonFlag = false
        eraserButton.classList.add( 'eraserActive' )
    } else {
        currentBrashColor = lastColor
        eraserButtonFlag = true
        eraserButton.classList.remove( 'eraserActive' )  
    }
} )

canvas.width = 1080
canvas.height = 1080
let storyPost_flag = true
storyPost.addEventListener( 'click', () => {
    if ( storyPost_flag ) {
        canvas.height = 1920
        downloadImage.title = 'png / 1080x1920'
        storyPost_flag = false
    } else {
        canvas.height = 1080
        downloadImage.title = 'png / 1080x1080'
        storyPost_flag = true
    }
    
} )

function startPosition( e ) {
    painting = true
    draw( e )
}

function finishedPosition() {
    painting = false
    ctx.beginPath()
    //laaa.push( counter )
    //counter = 0
    memory.push( ctx.getImageData(0, 0, canvas.width, canvas.height) )
    memory2.push( ctx.getImageData(0, 0, canvas.width, canvas.height) )
    if ( memory.length != memory2.length ) memory2 = memory.slice()
}

function draw( e ) {
    if ( !painting ) return 
    ctx.lineWidth = size
    ctx.lineCap = 'round'
    ctx.strokeStyle = currentBrashColor

    let fixeMousePosition = 0
    if ( window.innerWidth < 1080 ) {
        fixeMousePosition = 1080 - window.innerWidth
    }
    const mouseX = e.changedTouches ? ( e.changedTouches[ 0 ].clientX - (( window.innerWidth - 540 + fixeMousePosition ) / 2 )) * 2 : ( e.clientX - (( window.innerWidth - 540 + fixeMousePosition ) / 2 )) * 2
    const mouseY = e.changedTouches ? ( e.changedTouches[ 0 ].clientY - canvas.offsetTop ) * 2 : ( e.clientY - canvas.offsetTop ) * 2
    
    ctx.lineTo( mouseX, mouseY )
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo( mouseX, mouseY )   
}

canvas.addEventListener( 'mousedown', startPosition )
canvas.addEventListener( 'mouseup', finishedPosition )
canvas.addEventListener( 'mousemove', draw )

canvas.addEventListener( 'touchstart', startPosition )
canvas.addEventListener( 'touchend', finishedPosition )
canvas.addEventListener( 'touchmove', draw )

btnClearCanvas.addEventListener( 'click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    memory = []
} )

undoButton.addEventListener( 'click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    memory = memory.slice( 0, memory.length - 1 )
    if ( memory.length === 0 ) return
    ctx.putImageData( memory[ memory.length - 1 ], 0, 0 )
} )

redoButton.addEventListener( 'click', () => {
    const redo = memory2.slice( memory.length, memory2.length )
    if ( redo.length === 0 ) return
    ctx.putImageData( redo[ 0 ], 0, 0 )
    memory.push( memory2[ memory.length ] )
} )

downloadImage.addEventListener( 'click', () => {
        if ( window.navigator.msSaveBlob ) {
                window.navigator.msSaveBlob( canvas.msToBlob(), 'download.png' )
            } else {
                const a = document.createElement( 'a' )
                document.body.appendChild( a )
                a.href = canvas.toDataURL()
                a.download = 'download.png'
                a.click()
                document.body.removeChild( a )
            }
    
} )

window.addEventListener( 'resize', ( ) => {
    if (  window.innerWidth < 1080 ) {
        //canvas.style.transform = `scale( ${ ( window.innerWidth / 2 ) / 1000 } ) translateX( -${ ( window.innerWidth / 2 ) }px )`
        
    }

    if ( window.innerWidth < 520 ) {
    }
} )